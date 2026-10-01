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
  profile_picture?: string | null
}

export interface PatientAssignmentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  profile_picture?: string | null
  phone?: string
}

export interface PatientCaregiver {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  profile_picture?: string | null
  country?: string
  state?: string
  gender?: string
  date_of_birth?: string
  push_notification_token?: string | null
  certification?: string[]
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  type?: string
  isDeleted?: boolean
  isSuspended?: boolean
}

export interface PatientAssignment {
  id?: string
  patient_id?: string
  user_id?: string
  start_date?: string
  end_date?: string | null
  status?: string
  assigned_by?: string
  relationship?: string | null
  family_access_permissions?: string[]
  user_role?: "CARE_GIVER" | "FAMILY" | string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
  user?: PatientAssignmentUser
  caregiver?: PatientCaregiver | PatientAssignmentUser | any
}

export interface PatientMedication {
  id: string
  name: string
  doseage?: string
  dosage?: string
  frequency?: string
  patient_id?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
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
  relationship: string | null
  notes: string | null
  chronic_conditions: string[]
  allergies: string[]
  age: number
  blood_group: string
  genotype: string
  height: number
  weight: number
  status?: "ACTIVE" | "NOT_ACTIVE" | string
  plan_id: string
  caregiver_id?: string | null
  isSuspended: boolean
  isCreatedByAdmin?: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  plan?: PatientPlan
  user?: PatientUser
  caregiver?: PatientCaregiver | PatientAssignmentUser | any | null
  assignments?: PatientAssignment[]
  patientMedications?: PatientMedication[]
}

export interface GetPatientsQueryParams {
  page?: number
  limit?: number
  isSuspended?: boolean
  search?: string
  plan_id?: string
}

export interface CreatePatientPayload {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  country?: string
  state?: string
  gender?: string
  date_of_birth?: string
  relationship?: string
  notes?: string
  chronic_conditions?: string[]
  allergies?: string[]
  blood_group?: string
  genotype?: string
  height?: number
  weight?: number
  plan_id?: string
  user_id?: string
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
