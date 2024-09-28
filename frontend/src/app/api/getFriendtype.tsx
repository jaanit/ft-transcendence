import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { useQuery } from "@tanstack/react-query";

async function getFriendType(auth_id: string) {
  try {
    const response: AxiosResponse = await API.get(
      "/friends/FriendStats?id=" + auth_id
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useFriendType(auth_id: string) {
  return useQuery({
    queryKey: ["FriendshipType", auth_id],
    queryFn: () => getFriendType(auth_id),
  });
}
