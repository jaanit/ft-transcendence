import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

async function searchByName(name: string) {
  const response: AxiosResponse = await API.get(
    "/user/userByName?name=" + name
  );
  return response.data;
}

export function useSearchByName(name: string): UseQueryResult<any> {
  return useQuery({
    queryKey: ["getUsersbyname", name],
    queryFn: () => searchByName(name),
  });
}
