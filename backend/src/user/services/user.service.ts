import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { createWriteStream } from 'fs';
import { Multer } from 'multer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  async getUserStats(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      },
    });
    if (!user) return null;
    const stats = await this.prisma.stats.findUnique({
      where: {
        user_id: user.auth_id,
      },
    });
    return stats;
  }

  async getUserbyNickname(nickname: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        nickname: nickname,
      },
    });
    return user;
  }

  async getUsersbyName(name: string) {
    const users = this.prisma.users.findMany({
      where: {
        OR: [
          {
            nickname: {
              startsWith: name,
            },
          },
          {
            displayname: {
              startsWith: name,
            },
          },
        ],
      },
    });
    return users;
  }

  async getAllAchievements() {
    return this.prisma.achievement.findMany();
  }

  async tfaStatus(nickname: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { nickname: nickname },
      });
      return user.isTfaEnabled;
    } catch (error) {}
  }

  async enableTFA(nickname: string) {
    try {
      const user = await this.prisma.users.update({
        where: {
          nickname: nickname,
        },
        data: {
          isTfaEnabled: true,
          tfaSecret: this.authService.generateSecret(),
        },
      });
      return user.isTfaEnabled;
    } catch (error) {}
  }

  async disableTFA(nickname: string) {
    try {
      const user = await this.prisma.users.update({
        where: {
          nickname: nickname,
        },
        data: {
          isTfaEnabled: false,
          isTfaValidated: false,
          tfaSecret: null,
        },
      });
      return !user.isTfaEnabled;
    } catch (error) {}
  }

  async verifyTfa(nickname: string, code: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { nickname: nickname },
      });
      if (!user || !user.isTfaEnabled || !user.tfaSecret) {
        return false;
      }
      const isTfaVerified = this.authService.verifyTFA(user.tfaSecret, code);
      if (isTfaVerified) {
        await this.prisma.users.update({
          where: {
            nickname: nickname,
          },
          data: {
            isTfaValidated: true,
          },
        });
      }
      return isTfaVerified;
    } catch (error) {}
  }

  async getUserInfo(nickname: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { nickname: nickname },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async getUsersByRank() {
    return await this.prisma.stats.findMany({
      orderBy: { leaderboard: 'desc' },
      select: {
        leaderboard: true,
        user: {
          select: {
            nickname: true,
            picture: true,
            auth_id: true,
          },
        },
      },
    });
  }

  async uploadProfilePicture(nickname: string, file: Multer.File) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { nickname: nickname },
      });

      if (!user) {
        return false;
      }
      const picturePath = `upload/${user.nickname}_${file.originalname}`;
      const stream = createWriteStream(picturePath);
      stream.write(file.buffer);
      stream.end();

      return this.config.get('NEXT_PUBLIC_FRONT_PORT') + picturePath;
    } catch (error) {
      return false;
    }
  }
}
