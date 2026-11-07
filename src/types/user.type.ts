export type UserTypeEnum = "USER" | "CARE_GIVER"

export interface UserCount {
  patients: number
  assignments: number
  emergencyContacts: number
}

import { PatientType } from "./patient.type"

export interface UserAssignment {
  id: string
  patient_id: string
  user_id: string
  start_date: string
  end_date: string | null
  status: string
  assigned_by: string
  relationship: string | null
  family_access_permissions?: string[]
  user_role?: "CARE_GIVER" | "FAMILY" | string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  patient?: PatientType
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
  certification: string[] | string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  type: UserTypeEnum
  isDeleted: boolean
  isSuspended: boolean
  emergencyContacts?: any[]
  patients?: PatientType[]
  caregiver_patient?: PatientType | null
  assignments?: UserAssignment[]
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
