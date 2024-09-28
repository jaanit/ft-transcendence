import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function unblockFriend(auth_id: string) {
  try {
    const response: AxiosResponse = await API.post("/block/unblock", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
