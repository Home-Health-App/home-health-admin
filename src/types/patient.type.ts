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
  caregiver?: PatientCaregiver | null
  plan?: PatientPlan
  user?: PatientUser
  assignments?: PatientAssignment[]
  patientMedications?: PatientMedication[]
}

/**
 * Extracts caregiver details from a Patient object, checking both the direct
 * `patient.caregiver` field and `patient.assignments` fallback.
 */
export function getPatientCaregiver(patient?: PatientType | null) {
  if (!patient) return null

  // 1. Direct caregiver object from backend response
  if (patient.caregiver && (patient.caregiver.first_name || patient.caregiver.last_name || patient.caregiver.id)) {
    const cg = patient.caregiver
    const fullName = `${cg.first_name || ""} ${cg.last_name || ""}`.trim()
    return {
      id: cg.id || patient.caregiver_id || "",
      first_name: cg.first_name || "",
      last_name: cg.last_name || "",
      name: fullName || "Caregiver",
      email: cg.email || "",
      phone: cg.phone || "",
      profile_picture: cg.profile_picture || null,
      address: cg.address || "",
      gender: cg.gender || "",
      state: cg.state || "",
      country: cg.country || "",
      type: cg.type || "CARE_GIVER",
    }
  }

  // 2. Active assignment or fallback in assignments array
  if (patient.assignments && patient.assignments.length > 0) {
    const activeAssignment =
      patient.assignments.find((a) => a.status === "ACTIVE" && (a.caregiver || a.user)) ||
      patient.assignments.find((a) => a.caregiver || a.user) ||
      patient.assignments[0]

    const assignmentUser = activeAssignment?.caregiver || activeAssignment?.user
    if (assignmentUser && (assignmentUser.first_name || assignmentUser.last_name || assignmentUser.id)) {
      const fullName = `${assignmentUser.first_name || ""} ${assignmentUser.last_name || ""}`.trim()
      return {
        id: assignmentUser.id || activeAssignment.user_id || "",
        first_name: assignmentUser.first_name || "",
        last_name: assignmentUser.last_name || "",
        name: fullName || "Caregiver",
        email: assignmentUser.email || "",
        phone: ("phone" in assignmentUser ? assignmentUser.phone : "") || "",
        profile_picture: assignmentUser.profile_picture || null,
        address: ("address" in assignmentUser ? assignmentUser.address : "") || "",
        gender: ("gender" in assignmentUser ? assignmentUser.gender : "") || "",
        state: ("state" in assignmentUser ? assignmentUser.state : "") || "",
        country: ("country" in assignmentUser ? assignmentUser.country : "") || "",
        type: ("type" in assignmentUser ? (assignmentUser as any).type : "") || "CARE_GIVER",
      }
    }
  }

  return null
}

export interface GetPatientsQueryParams {
  page?: number
  limit?: number
  isSuspended?: boolean
  search?: string
  plan_id?: string
}

export interface MedicationSchedule {
  name: string
  dosage?: string
  frequency?: string
  schedule_type?: "Specific Times" | "Interval"
  times?: string[]
  interval?: string
  starting_from?: string
  days_of_week?: string[]
}

export interface PatientMedicationItem {
  name: string
  doseage: string
  frequency: string
}

export interface CreatePatientPayload {
  plan_id?: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  profile_picture?: string
  country?: string
  state?: string
  gender?: "MALE" | "FEMALE" | string
  date_of_birth?: string
  relationship?: string
  notes?: string
  height?: number
  weight?: number
  allergies?: string[]
  chronic_conditions?: string[]
  age?: number
  blood_group?: string
  genotype?: string
  medications?: PatientMedicationItem[]
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
