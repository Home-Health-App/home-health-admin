import { z } from "zod/v4"

// ─── Plan Categories & Tiers ─────────────────────────────────────────────────

export const planCategoryEnum = z.enum([
  "Elderly_Care",
  "Special_Health_Condition",
  "Pediatric_Care",
  "Post_surgery_Recovery_Care",
  "Pre_Post_Natal_Care",
])

export const planTierEnum = z.enum(["Silver", "Bronze", "Gold", "Diamond"])

// ─── Create Plan Schema ──────────────────────────────────────────────────────

export const createPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required"),
  category: planCategoryEnum,
  tier: planTierEnum,
  price: z
    .number()
    .positive("Price must be greater than 0"),
  price_in_usd: z
    .number()
    .positive("USD price must be greater than 0"),
  coverage: z
    .array(z.string().min(1, "Coverage item cannot be empty"))
    .min(1, "At least one coverage item is required"),
})

export type CreatePlanSchemaType = z.infer<typeof createPlanSchema>

// ─── Update Plan Schema ──────────────────────────────────────────────────────

export const updatePlanSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .optional(),
  category: planCategoryEnum.optional(),
  tier: planTierEnum.optional(),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .optional(),
  price_in_usd: z
    .number()
    .positive("USD price must be greater than 0")
    .optional(),
  coverage: z
    .array(z.string().min(1, "Coverage item cannot be empty"))
    .min(1, "At least one coverage item is required")
    .optional(),
})

export type UpdatePlanSchemaType = z.infer<typeof updatePlanSchema>
