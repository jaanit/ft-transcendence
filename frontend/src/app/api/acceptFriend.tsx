import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function acceptFriend(auth_id: string) {
    const response: AxiosResponse = await API.post("/friends/accepteFriend", {
      auth: auth_id,
    });
    return response.data;
  
}
