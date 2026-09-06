export interface PatientPlan {
  id: string
  name: string
  category: string
  tier: string
  price: number
  price_in_usd: number
  coverage: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
}

export interface PatientUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
}

export interface PatientAssignment {
  id?: string
  user_id?: string
  caregiver?: any
  user?: any
  status?: string
  created_at?: string
}

export interface PatientType {
  id: string
  user_id: string
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
  relationship: string
  notes: string
  chronic_conditions: string[]
  allergies: string[]
  age: number
  blood_group: string
  genotype: string
  height: number
  weight: number
  plan_id: string
  isSuspended: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  plan?: PatientPlan
  user?: PatientUser
  assignments?: PatientAssignment[]
}

export interface GetPatientsQueryParams {
  page?: number
  limit?: number
  isSuspended?: boolean
  search?: string
  plan_id?: string
}

export interface UpdatePatientPayload {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  address?: string
  profile_picture?: string | null
  country?: string
  state?: string
  gender?: string
  date_of_birth?: string
  relationship?: string
  notes?: string
  chronic_conditions?: string[]
  allergies?: string[]
  age?: number
  blood_group?: string
  genotype?: string
  height?: number
  weight?: number
  plan_id?: string
  isSuspended?: boolean
}

export interface SuspendPatientPayload {
  isSuspended: boolean
}

export interface AssignPatientPayload {
  patient_id: string
  user_id: string
  user_role?: "CARE_GIVER" | string
  start_date?: string
  end_date?: string
  family_access_permissions?: string[]
  status?: "ACTIVE" | string
}

export interface UnassignPatientPayload {
  patient_id: string
  user_id: string
}

