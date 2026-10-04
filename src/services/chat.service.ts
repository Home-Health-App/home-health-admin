import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import { CreateAdminChatPayload, AdminChatData } from "@/types/chat.type"

export const createAdminChat = async (
  payload: CreateAdminChatPayload
): Promise<GeneralResponse<AdminChatData>> => {
  return api.post<GeneralResponse<AdminChatData>>(
    URLs.chat["create-admin-chat"],
    payload
  )
}
