import { AxiosResponse } from "axios";
import { API, UserProfileUpdate } from "./checkAuthentication";

export async function updateUserProfile(data: UserProfileUpdate) {
  const response: AxiosResponse = await API.post("/auth/UpdateData", data);
  return response.data;
}
