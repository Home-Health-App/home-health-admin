// ─── Enums ───────────────────────────────────────────────────────────────────

export type PlanCategory =
  | "Elderly_Care"
  | "Special_Health_Condition"
  | "Pediatric_Care"
  | "Post_surgery_Recovery_Care"
  | "Pre_Post_Natal_Care"

export type PlanTier = "Silver" | "Bronze" | "Gold" | "Diamond"

// ─── Entity Types ────────────────────────────────────────────────────────────

export type PlanType = {
  id: string
  name: string
  category: PlanCategory
  tier: PlanTier
  price: number
  price_in_usd: number
  coverage: string[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
}

// ─── Request (Payload) Types ─────────────────────────────────────────────────

export type CreatePlanType = {
  name: string
  category: PlanCategory
  tier: PlanTier
  price: number
  price_in_usd: number
  coverage: string[]
}

export type UpdatePlanType = {
  name?: string
  category?: PlanCategory
  tier?: PlanTier
  price?: number
  price_in_usd?: number
  coverage?: string[]
}

// ─── Payment Entity Types ───────────────────────────────────────────────────

export interface AdminPaymentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_picture?: string | null
}

export interface AdminPaymentPatient {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  profile_picture?: string | null
  country?: string
  state?: string
  gender?: string
  date_of_birth?: string
  relationship?: string
  notes?: string | null
  chronic_conditions?: string[]
  allergies?: string[]
  age?: number
  blood_group?: string
  genotype?: string
  height?: number
  weight?: number
  status?: string
  plan_id?: string
  caregiver_id?: string | null
  isSuspended?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
  isCreatedByAdmin?: boolean
}

export interface AdminPaymentItem {
  id: string
  user_id: string
  status: "PENDING" | "PAID" | "SUCCESS" | "FAILED" | "EXPIRED" | string
  plan_id: string
  patient_id: string
  currency: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  plan: PlanType
  patient: AdminPaymentPatient
  user: AdminPaymentUser
}

export interface GetAdminPaymentsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  tier?: string
  category?: string
}

