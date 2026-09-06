import { Permission } from "@/types/auth.type"

export interface AdminRole {
  id: string
  name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  status: "ACTIVE" | "INACTIVE"
}

export interface CreateAdminRolePayload {
  name: string
  permissions: Permission[]
}
