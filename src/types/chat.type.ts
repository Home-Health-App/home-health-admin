export type ChatTargetType = "ADMIN" | "USER" | "CARE_GIVER"

export interface CreateAdminChatPayload {
  type: ChatTargetType | string
  reciever_id: string
  is_for_admin: boolean
}

export interface ChatUser {
  id: string
  first_name: string
  last_name: string
  email: string
  profile_picture?: string | null
  phone?: string | null
  type?: string
}

export interface AdminChatCreator {
  id: string
  first_name: string
  last_name: string
  email?: string
}

export interface AdminChatData {
  id: string
  type: ChatTargetType | string
  creator_id: string | null
  reciever_id: string
  is_for_admin: boolean
  admin_creator_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  user_creator: ChatUser | null
  admin_creator: AdminChatCreator | null
  reciever?: ChatUser | null
  receiver?: ChatUser | null
  last_message?: ChatMessageData | null
  messages?: ChatMessageData[]
  unread_count?: number
}

export interface ChatSender {
  id: string
  first_name: string
  last_name: string
  profile_picture?: string | null
  email?: string
}

export interface ChatMessageData {
  id: string
  chat_id: string
  sender_id: string | null
  is_admin: boolean
  admin_sender_id: string | null
  message: string | null
  files: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  user_has_read?: boolean
  admin_has_read?: boolean
  user_sender: ChatSender | null
  admin_sender: ChatSender | null
}

export interface SendAdminMessagePayload {
  chat_id: string
  message?: string
  files?: string[]
}

export interface GetAdminChatsQueryParams {
  page?: number
  limit?: number
  search?: string
}

export interface GetChatMessagesQueryParams {
  page?: number
  limit?: number
}

export interface SocketSendMessagePayload {
  chat_id: string
  message?: string
  files?: string[]
  sender_id: string
  is_admin?: boolean
}

export interface SocketMessageAck {
  success: boolean
  message?: string
  data?: ChatMessageData
}

