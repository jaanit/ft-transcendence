import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { API } from "../checkAuthentication";
import { error, group } from "console";

interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
  picture: string;
}

interface GroupUpdate {
  group_id: number;
  name: string;
  password: string;
  privacy: string;
  picture: string;
}
interface Message {
  groupId: number;
  message: string;
}

interface Chat {
  groupId: number;
  type: string;
  password: string;
}

interface messagesData {
  groupId: string;
}

interface idGroup {
  group: number;
  userId: string;
}
interface idGroupMute {
  group: number;
  userId: string;
  date: Date;
}

async function getInvited(data: string) {
  const response: AxiosResponse = await API.get(
    "/groups/getInvited?groupId=" + data
  );
  return response.data;
}

export function useGetInvited(data: string) {
  return useQuery({
    queryKey: ["getInvited"],
    queryFn: () => getInvited(data),
  });
}

async function getGroups() {
  const response: AxiosResponse = await API.get("/groups/getGroups");
  return response.data;
}
export function UsegetGroups(): UseQueryResult<any> {
  return useQuery({ queryKey: ["dataGroups"], queryFn: getGroups });
}

async function getFriends() {
  const response: AxiosResponse = await API.get("/chat/FriendsRoom");
  return response.data;
}
export function UsegetFriends(): UseQueryResult<any> {
  return useQuery({ queryKey: ["dataFriend"], queryFn: getFriends });
}

export async function creatGroup(data: GroupCreate) {
  const response: AxiosResponse = await API.post("/groups/createGroup", data);
  return response.data;
}

export async function updateGroup(data: GroupUpdate) {
  const response: AxiosResponse = await API.post("/groups/UpdateGroup", data);
  return response.data;
}

export async function upload(data: FormData) {
  const response = await API.post("/image/uploadPicture", data);
  return response.data;
}

async function getMessages(data: string) {
  const response: AxiosResponse = await API.get("/groups/get/" + data);
  return response.data;
}

export function UseGetMessages(data: string) {
  return useQuery({
    queryKey: ["getMessages"],
    queryFn: () => getMessages(data),
  });
}

export async function deleteGroup(data: number) {
  const response: AxiosResponse = await API.post("/groups/delete", {
    group: data,
  });
  return response.data;
}

export async function sendMessages(data: Message) {
  const response: AxiosResponse = await API.post(
    "/messages/sendMessages",
    data
  );
  return response.data;
}

export async function addFriendToGroup(data: {
  group: number;
  userId: string;
}) {
  const response: AxiosResponse = await API.post("/groups/addMember", data);
  return response.data;
}

export async function getMemberGroup(data: string) {
  const response: AxiosResponse = await API.get(
    "/groups/getMembers?groupId=" + data
  );
  return response.data;
}

export function useGetMembers(data: string) {
  return useQuery({
    queryKey: ["getMembers"],
    queryFn: () => getMemberGroup(data),
  });
}

async function getMemberShip(data: string) {
  const response: AxiosResponse = await API.get(
    "/groups/getMembership?groupId=" + data
  );
  return response.data;
}

export function useGetMemberShip(data: string) {
  return useQuery({
    queryKey: ["getMembership", data],
    queryFn: () => getMemberShip(data),
  });
}

export async function banUserFromGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/banUser", data);
  return response.data;
}
export async function unBanUserFromGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/unBanUser", data);
  return response.data;
}
export async function deleteFromGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/deleteUser", data);
  return response.data;
}
export async function muteFromGroup(data: idGroupMute) {
  const response: AxiosResponse = await API.post("/groups/mute", data);
  return response.data;
}
export async function makeUserAdmin(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/changeRole", data);
  return response.data;
}

export async function unmuteFromGroup(data: idGroup) {
  const response: AxiosResponse = await API.post("/groups/unmute", data);
  return response.data;
}

export async function joinToGroup(data: { group: number; password: string }) {
  const response: AxiosResponse = await API.post("/groups/joinGroup", data);
  return response.data;
}
export async function quitGroup(data: { group: number }) {
  const response: AxiosResponse = await API.post("/groups/quit", data);
  return response.data;
}

async function checkIsGroupMember(data: idGroup) {
  const response: AxiosResponse = await API.get(
    "/groups/memberType/" + "?groupId=" + data.group
  );
  return response.data;
}

export function useCheckIsGroupMember(data: idGroup) {
  return useQuery({
    queryKey: ["groupId", data.group],
    queryFn: () => checkIsGroupMember(data),
  });
}

export async function createDuo(friendId: string) {
  const response: AxiosResponse = await API.post("/duo/create", {
    user_id: friendId,
  });
  return response.data;
}
