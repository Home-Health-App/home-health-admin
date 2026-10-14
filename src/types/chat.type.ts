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
  message: string
  files: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  user_sender: ChatSender | null
  admin_sender: ChatSender | null
}

export interface SendAdminMessagePayload {
  chat_id: string
  message: string
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
