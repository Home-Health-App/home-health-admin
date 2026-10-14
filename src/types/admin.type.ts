import { Role } from "./auth.type"

export interface CreateAdminUserPayload {
  first_name: string
  last_name: string
  email: string
  country: string
  state: string
  address: string
  gender: "MALE" | "FEMALE" | string
  role_id: string
}

export interface UpdateAdminUserPayload {
  first_name?: string
  last_name?: string
  email?: string
  country?: string
  state?: string
  address?: string
  gender?: "MALE" | "FEMALE" | string
  role_id?: string
  profile_picture?: string | null
}


export interface AdminUserType {
  id: string
  first_name: string
  last_name: string
  email: string
  address: string
  profile_picture?: string | null
  country: string
  state: string
  gender: "MALE" | "FEMALE" | string
  date_of_birth?: string | null
  role_id: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  isDeleted: boolean
  role?: Role
}

export interface GetAdminsQueryParams {
  page?: number
  limit?: number
  search?: string
}
