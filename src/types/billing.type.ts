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
