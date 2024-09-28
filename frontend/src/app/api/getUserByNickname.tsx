import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { API } from "./checkAuthentication";

async function getUserbyNickName(nickname: string) {
  try {
    const response: AxiosResponse = await API.get(
      "/user/profile?nickname=" + nickname
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function GetUser(nickname: string) {
  return useQuery({
    queryKey: ["profileData", nickname],
    queryFn: () => getUserbyNickName(nickname),
  });
}
