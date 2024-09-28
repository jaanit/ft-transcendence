import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Server } from "socket.io";
import { Socket } from "socket.io";
import { GroupsService } from "../services/groups/groups.service";
import { subscribe } from "diagnostics_channel";

@WebSocketGateway({
    namespace: 'chat',
    cors:{
        credentials: true,
        origin: '*',
    },
})
export class chatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    IdToSocket : Record<string, Socket>;
    constructor(private GroupsService: GroupsService){
        this.IdToSocket = {}
    }
    @WebSocketServer() server:Server
    async afterInit(server: any) {
    }
    async handleConnection(client: any, ...args: any[]) {

    }
    async handleDisconnect(client: any) {
    }

    @SubscribeMessage("getId")
    async handelGetId(client: Socket, payload: {auth_id: string})
    {
        if (!payload.auth_id)
            return ;
        this.IdToSocket[payload.auth_id] = client;
    }
    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: {group_id: string})
    {
        const members = await this.GroupsService.getMembers(Number(payload.group_id))
        members.map((member) => {
            if (this.IdToSocket[member.user_id])
            {
                this.IdToSocket[member.user_id].emit("reload")
            }
        })
    }
    @SubscribeMessage("typing")
    async typing(client: Socket, payload: {group_id: string, user: string})
    {
        const members = await this.GroupsService.getMembers(Number(payload.group_id))
        members.map((member) => {
            if (this.IdToSocket[member.user_id])
            {
                this.IdToSocket[member.user_id].emit("isTyping", {message: payload.user + ' is typing', id: Number(payload.group_id)})
            }
        })
    }
    @SubscribeMessage("stop typing")
    async stopTyping(client: Socket, payload: {group_id: string})
    {
        const members = await this.GroupsService.getMembers(Number(payload.group_id))
        members.map((member) => {
            if (this.IdToSocket[member.user_id])
            {
                this.IdToSocket[member.user_id].emit("notTyping")
            }
        })
    }


}