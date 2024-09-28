import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

export interface matchInterface {
    score1: number;
    score2: number;
    winner: string;
    user1: {
      auth_id: string;
      nickname: string;
      picture: string;
    };
    user2: {
      auth_id: string;
      nickname: string;
      picture: string;
    };
  }

async function getMatchHistory(data: string | null)  {
  const response: AxiosResponse = await API.get(data ? "/GameMatch/get?nickname=" + data : "/GameMatch/global");
  return response.data;
}


export function useGetMatchHistory(data: string | null){
  return useQuery({
    queryKey: ["MatchHistory"],
    queryFn: () => getMatchHistory(data),
  });
}
