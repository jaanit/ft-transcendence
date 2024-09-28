import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { groupDto } from 'src/chat/dto/group.dto';
import * as bcrypt from 'bcrypt';
import { memberDto } from '../../dto/member.dto';
import { joinRequest } from 'src/chat/dto/joinRequest.dto';
import { muteDto } from 'src/chat/dto/mute.dto';
import { changePrivacyDto } from 'src/chat/dto/changePrivacy.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  async getGroups(user_id: string) {
    const groups = await this.prisma.groups.findMany({
      where: {
        type: 'group',
        OR: [
          {
            privacy: 'public',
          },
          {
            privacy: 'protected',
          },
          {
            members: {
              some: {
                user_id: user_id,
              },
            },
          },
        ],
        NOT: {
          members: {
            some: {
              user_id: user_id,
              banned: true,
            },
          },
        },
      },
      orderBy: {
        lastChange: 'desc',
      },
      select: {
        id: true,
        name: true,
        privacy: true,
        picture: true,
        lastChange: true,
        members: {
          where: {
            user_id: user_id,
          },
          select: {
            type: true,
          },
        },
        messages: {
          orderBy: { lastmodif: 'desc' },
          take: 1,
          select: {
            message_text: true,
          },
        },
      },
    });
    return groups;
  }
  async getGroup(group_id: number, user_id: string) {
    const group = await this.prisma.groups.findUnique({
      where: {
        id: group_id,
      },
      select: {
        id: true,
        name: true,
        type: true,
        picture: true,
        privacy: true,
        members: {
          where: {
            NOT: {
              user_id: user_id,
            },
          },
          select: {
            user_id: true,
            type: true,
            banned: true,
            user: {
              select: {
                auth_id: true,
                nickname: true,
                picture: true,
              },
            },
          },
        },
        messages: {
          where: {
            group_id: group_id,
            NOT: {
              sender: {
                OR: [
                  {
                    blocker: {
                      some: {
                        blocked_id: user_id,
                      },
                    },
                  },
                  {
                    blocked: {
                      some: {
                        blocker_id: user_id,
                      },
                    },
                  },
                ],
              },
            },
          },
          orderBy: { lastmodif: 'asc' },
          select: {
            sender_id: true,
            group_id: true,
            lastmodif: true,
            message_text: true,
            sender: {
              select: {
                nickname: true,
                picture: true,
              },
            },
          },
        },
      },
    });
    return group;
  }

  async createGroup(creator_id: string, group: groupDto) {
    let hash: null | string = null;
    if (group.type === 'protected') {
      const salt = await bcrypt.genSalt();
      hash = await bcrypt.hash(group.password, salt);
    }
    const createdGroup = await this.prisma.groups.create({
      data: {
        name: group.groupName,
        type: 'group',
        privacy: group.type,
        password: hash,
        picture: group.picture,
        members: {
          create: {
            user_id: creator_id,
            type: 'creator',
            banned: false,
          },
        },
      },
    });
    return createdGroup;
  }

  async checkAdmin(user_id: string, group_id: number): Promise<string> {
    const member = await this.prisma.members.findFirst({
      where: {
        user_id: user_id,
        group_id: group_id,
      },
    });
    if (!member) return 'notMember';
    if (member.banned) return 'banned';
    return member.type;
  }
  async addMember(creator_id: string, add_member: memberDto) {
    const admin = await this.checkAdmin(creator_id, add_member.group);
    if (!admin || admin === 'member' || admin === 'notMember')
      throw new HttpException("you're not an admin!", 401);
    const member = await this.checkAdmin(add_member.userId, add_member.group);
    if (member !== 'notMember') throw new HttpException('already exist', 200);
    const new_member = await this.prisma.members.create({
      data: {
        user_id: add_member.userId,
        group_id: add_member.group,
        type: 'member',
        banned: false,
      },
    });
    return new_member;
  }
  async changeRole(creator_id: string, add_member: memberDto) {
    const admin = await this.checkAdmin(creator_id, add_member.group);
    if (!admin || admin !== 'creator')
      throw new HttpException("you're not an admin!", 401);
    const member = await this.checkAdmin(add_member.userId, add_member.group);
    if (!member) throw new HttpException("doesn't exist", 404);
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: add_member.group,
        user_id: add_member.userId,
      },
    });
    if (!relation) return ;
    const new_member = await this.prisma.members.update({
      where: {
        id: relation.id,
      },
      data: {
        type: 'admin',
      },
    });
    return new_member;
  }

  async getMembers(group_id: number) {
    const members = this.prisma.members.findMany({
      where: {
        group_id: group_id,
      },
      select: {
        user_id: true,
        type: true,
        banned: true,
        muted: true,
        user: {
          select: {
            nickname: true,
            picture: true,
            auth_id: true,
          },
        },
      },
    });
    return members;
  }

  async banUser(member: memberDto) {
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: member.group,
        user_id: member.userId,
      },
    });
    if (!relation) return;
    return await this.prisma.members.update({
      where: {
        id: relation.id,
      },
      data: {
        banned: true,
      },
    });
  }
  async unBanUser(member: memberDto) {
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: member.group,
        user_id: member.userId,
      },
    });
    if (!relation) return;
    return await this.prisma.members.update({
      where: {
        id: relation.id,
      },
      data: {
        banned: false,
      },
    });
  }
  async mute(member: muteDto) {
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: member.group,
        user_id: member.userId,
      },
    });
    if (!relation) return;
    return await this.prisma.members.update({
      where: {
        id: relation.id,
      },
      data: {
        muted: member.date,
      },
    });
  }
  async unmute(member: memberDto) {
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: member.group,
        user_id: member.userId,
      },
    });
    if (!relation) return;
    return await this.prisma.members.update({
      where: {
        id: relation.id,
      },
      data: {
        muted: new Date(0),
      },
    });
  }

  async deleteUser(member: memberDto) {
    const relation = await this.prisma.members.findFirst({
      where: {
        group_id: member.group,
        user_id: member.userId,
      },
    });
    if (!relation) return;
    return await this.prisma.members.delete({
      where: {
        id: relation.id,
      },
    });
  }

  async joinGroup(user_id: string, joinRequest: joinRequest) {
    const group = await this.prisma.groups.findUnique({
      where: {
        id: joinRequest.group,
      },
    });
    if (!group || group.type !== 'group')
      throw new HttpException("group doesn't exist", HttpStatus.NOT_FOUND);
    if (group.privacy === 'private')
      throw new HttpException('this group is private', HttpStatus.FORBIDDEN);
    if (group.privacy === 'protected') {
      if (!joinRequest.password || !(await bcrypt.compare(joinRequest.password, group.password)))
        throw new HttpException('wrong password', HttpStatus.FORBIDDEN);
    }
    await this.prisma.members.create({
      data: {
        user_id: user_id,
        group_id: joinRequest.group,
        type: 'member',
        banned: false,
      },
    });
  }

  async deleteGroup(group_id: number) {
    await this.prisma.members.deleteMany({
      where: {
        group_id: group_id,
      },
    });
    await this.prisma.message.deleteMany({
      where: {
        group_id: group_id,
      },
    });
    await this.prisma.groups.delete({
      where: { id: group_id },
    });
  }
  async quitGroup(user_id: string, group_id: number) {
    const checkAdmin = await this.checkAdmin(user_id, group_id);
    await this.prisma.members.deleteMany({
      where: {
        group_id: group_id,
        user_id: user_id,
      },
    });
    if (checkAdmin === 'creator') {
      const newCreator = await this.prisma.members.findFirst({
        where: {
          group_id: group_id,
          banned: false,
        },
      });
      if (!newCreator) return this.deleteGroup(group_id);
      await this.prisma.members.update({
        where: {
          id: newCreator.id,
        },
        data: {
          type: 'creator',
          muted: new Date(0),
        },
      });
    }
  }
  async getMembership(user_id: string, group_id: number) {
    const member = await this.prisma.members.findFirst({
      where: {
        user_id: user_id,
        group_id: group_id,
      },
    });
    if (!member) throw new HttpException('not a member', HttpStatus.NOT_FOUND);
    return member;
  }

  async changePrivacy(group: changePrivacyDto) {
    if (group.privacy === 'protected') {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(group.password, salt);
      return await this.prisma.groups.update({
        where: {
          id: group.group_id,
        },
        data: {
          name: group.name,
          picture: group.picture,
          privacy: group.privacy,
          password: hash,
        },
      });
    }
    return await this.prisma.groups.update({
      where: {
        id: group.group_id,
      },
      data: {
        name: group.name,
        picture: group.picture,
        privacy: group.privacy,
      },
    });
  }

  async getInvite(group: number) {
    return await this.prisma.users.findMany({
      where: {
        NOT: {
          Member: {
            some: {
              group_id: group,
            },
          },
        },
      },
    });
  }
}
