import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { useQuery } from "@tanstack/react-query";



export interface GameData {
	botGameId: number,
	gameId: number,
	score1: number,
	score2: number,
	status: string,
	user1_id: string,
	user2_id?: string,
	map: string,
	dimensio: string,
	option: string,
	winner: string,
	time: Date,
	user1: {
		nickname: string,
		picture: string,
	},
	user2?: {
		nickname: string,
		picture: string,
	}
}

async function getGame(type: string, gameId: string) {
  const response: AxiosResponse = await API.get(`/Game/getGame/${type}/${gameId}`);
  return response.data;
}

export function useGetGame(type: string, gameId: string) {
  return useQuery({
    queryKey: ["gameData", type, gameId],
    queryFn: () => getGame(type, gameId),
  });
}
