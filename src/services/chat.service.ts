import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  CreateAdminChatPayload,
  AdminChatData,
  ChatMessageData,
  SendAdminMessagePayload,
  GetAdminChatsQueryParams,
  GetChatMessagesQueryParams,
} from "@/types/chat.type"

export const getAdminChats = async (
  params?: GetAdminChatsQueryParams
): Promise<PaginatedResponse<AdminChatData[]>> => {
  return api.get<PaginatedResponse<AdminChatData[]>>(
    URLs.chat["get-admin-chats"],
    { params }
  )
}

export const getChatMessages = async (
  chatId: string,
  params?: GetChatMessagesQueryParams
): Promise<PaginatedResponse<ChatMessageData[]>> => {
  return api.get<PaginatedResponse<ChatMessageData[]>>(
    URLs.chat["get-chat-messages"](chatId),
    { params }
  )
}

export const sendAdminMessage = async (
  payload: SendAdminMessagePayload
): Promise<GeneralResponse<ChatMessageData>> => {
  return api.post<GeneralResponse<ChatMessageData>>(
    URLs.chat["send-admin-message"],
    payload
  )
}

export const createAdminChat = async (
  payload: CreateAdminChatPayload
): Promise<GeneralResponse<AdminChatData>> => {
  return api.post<GeneralResponse<AdminChatData>>(
    URLs.chat["create-admin-chat"],
    payload
  )
}

