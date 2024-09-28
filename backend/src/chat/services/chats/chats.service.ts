import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { group } from 'console';

@Injectable()
export class DuoService {
    constructor(private prisma: PrismaService){}

    async getDuoByUsers(user1_id: string, user2_id: string)
    {
        const group = await  this.prisma.groups.findFirst({
            where:{
                type: "duo",
                AND:[
                    {
                        members: {
                            some:
                            {
                                user_id: user1_id,
                            }
                        },
                    },
                    {
                        members: {
                            some:
                            {
                                user_id: user2_id,
                            }
                        }
                    }
                ]
            }
        })
        return group
    }

    async createDuo(user1_id: string, user2_id: string)
    {
        const user2 = await this.prisma.users.findUnique({
            where:{
                auth_id: user2_id
            }
        })
        if (!user2)
            throw new HttpException("user not found", HttpStatus.NOT_FOUND)
        const existGroup = await this.getDuoByUsers(user1_id, user2_id);
        if (existGroup)
            return existGroup;
        return await this.prisma.groups.create({
            data:{
                name: "",
                type: "duo",
                privacy: "private",
                members:{
                    createMany:{
                        data:[
                            {user_id: user1_id},
                            {user_id: user2_id}
                        ]
                    }
            }

        }})
    }

    async getDuos(auth_id: string)
    {
        return await this.prisma.groups.findMany({
            where:{
                type: "duo",
                members: {
                    some: {
                        user_id: auth_id,
                        banned: false
                    },
                },
            },
            orderBy: {
                lastChange: 'desc',
            },
            select:{
                id: true,
                lastChange:true,
                members:
                {
                    where: {
                        NOT:{
                            user_id: auth_id
                        }
                    },
                    select:{
                        user: true
                    },
                    take: 1
                },
                messages:{
                    orderBy: {lastmodif: 'desc'},
                    take: 1,
                    select:{
                        message_text: true
                    }
                }
              },
        })
    }

    async block(blocker_id:string, blocked_id:string)
    {
        const duo = await this.getDuoByUsers(blocker_id, blocked_id)
        if (!duo)
            return ;
        let membership = await this.prisma.members.findFirst({
            where:{
                user_id: blocked_id,
                group_id: duo.id,
            }
        })

        if (!membership)
            return ;
        membership = await this.prisma.members.update({
            where:{
                id: membership.id
            },
            data:{
                banned:true
            }
        })
    }

    async unblock(blocker_id:string, blocked_id:string)
    {
        const duo = await this.getDuoByUsers(blocker_id, blocked_id)
        if (!duo)
            return ;
        const membership = await this.prisma.members.findFirst({
            where:{
                user_id: blocked_id,
                group_id: duo.id,
            }
        })
        if (!membership)
            return ;
        await this.prisma.members.update({
            where:{
                id: membership.id
            },
            data:{
                banned: false
            }
        })
    }
}