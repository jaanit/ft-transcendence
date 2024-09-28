import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { useQuery } from "@tanstack/react-query";

async function getStats(nickname: string | undefined) {
  const response: AxiosResponse = await API.get(
    "/user/Stats?nickname=" + nickname
  );
  return response.data;
}

export function useGetStats(nickname: string | undefined) {
  return useQuery(["Stats", nickname], () => getStats(nickname));
}

async function getStatsUser(auth_id: string) {
  const response: AxiosResponse = await API.get(
    "/GameMatch/Stats?auth_id=" + auth_id
  );
  return response.data;
}

export function useGetStatsUser(auth_id: string) {
  return useQuery(["Stats", auth_id], () => getStatsUser(auth_id));
}
