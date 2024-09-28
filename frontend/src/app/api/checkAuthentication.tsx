import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { constants } from "buffer";

export interface UserProfileUpdate {
  nickname: string;
  displayname: string;
  picture: string;
}
interface GroupCreate {
  groupName: string;
  password: string;
  type: string;
}

interface messagesData {
  groupId: string;
}
export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

async function checkAuthentication() {
  const response: AxiosResponse = await API.get("auth/checkAuth");
  localStorage.setItem("token", response.data.token);
  return response.data;
}
export async function updateUserProfile(data: UserProfileUpdate) {
  const response: AxiosResponse = await API.post("auth/UpdateData", data);
  return response.data;
}

export function useCheckAuthentication(): UseQueryResult<any> {
  return useQuery({
    queryKey: ["data"],
    queryFn: checkAuthentication,
  });
}

export async function logoutUser(auth_id: string | undefined) {
  const response: AxiosResponse = await API.post("auth/logout", { auth_id });
  return response.data;
}
