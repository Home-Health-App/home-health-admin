export type UserTypeEnum = "USER" | "CARE_GIVER"

export interface UserCount {
  patients: number
  assignments: number
  emergencyContacts: number
}

export interface UserType {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  profile_picture: string | null
  country: string
  state: string
  gender: "MALE" | "FEMALE" | string
  date_of_birth: string
  push_notification_token: string | null
  certification: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  type: UserTypeEnum
  isDeleted: boolean
  isSuspended: boolean
  emergencyContacts?: any[]
  patients?: any[]
  assignments?: any[]
  payments?: any[]
  _count?: UserCount
}

export interface GetUsersQueryParams {
  page?: number
  limit?: number
  type?: UserTypeEnum
  isSuspended?: boolean
  search?: string
}
