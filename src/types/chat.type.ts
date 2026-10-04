export type ChatTargetType = "ADMIN" | "USER"

export interface CreateAdminChatPayload {
  type: ChatTargetType
  reciever_id: string
  is_for_admin: boolean
}

export interface AdminChatCreator {
  id: string
  first_name: string
  last_name: string
}

export interface AdminChatData {
  id: string
  type: ChatTargetType | string
  creator_id: string | null
  reciever_id: string
  is_for_admin: boolean
  admin_creator_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  user_creator: any | null
  admin_creator: AdminChatCreator | null
}
