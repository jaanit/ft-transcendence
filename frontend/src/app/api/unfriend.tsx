import { AxiosResponse } from "axios";
import { API } from "./checkAuthentication";

export async function unFriend(auth_id: string) {
  try {
    const response: AxiosResponse = await API.delete(
      "/friends/unFriend?auth=" + auth_id
    );
    return response.data;
  } catch (error) {
  }
}
