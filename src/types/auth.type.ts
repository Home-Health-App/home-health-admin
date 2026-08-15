export type Permission =
  | "Admins"
  | "Users"
  | "Overview"
  | "Patients"
  | "Plans"
  | "Finance"
  | "Caregivers"

export type Role = {
  id: string
  name: string
  permissions: Permission[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  status: "ACTIVE" | "INACTIVE" | string
}

export type Admin = {
  id: string
  first_name: string
  last_name: string
  email: string
  address: string
  profile_picture: string | null
  country: string
  state: string
  gender: "MALE" | "FEMALE" | string
  date_of_birth: string | null
  role_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  role: Role
}

export type AuthType = {
  access_token: string
  admin: Admin
}