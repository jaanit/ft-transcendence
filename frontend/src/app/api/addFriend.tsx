import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function addFriend(auth_id: string) {
  try {
    const response: AxiosResponse = await API.post("/friends/addFriend", {
      auth: auth_id,
    });
    return response.data;
  } catch (error) {
  }
}
