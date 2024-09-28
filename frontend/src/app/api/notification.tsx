import axios, { AxiosResponse } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { API } from "./checkAuthentication";


async function getNotification() {
  try {
    const response: AxiosResponse = await API.get("/notification/get");
    return response.data;
  } catch (error) {
    throw error;
  }
}
export function useGetNotification() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotification(),
  });
}

export async function seeAllNotification() {
  const response: AxiosResponse = await API.post("/notification/seenAll");
  return response.data;

}