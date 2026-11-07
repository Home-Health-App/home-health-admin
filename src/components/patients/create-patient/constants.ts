import { PlanCategory, PlanTier, PlanType } from "@/types/billing.type"

export const CATEGORIES_UI = [
  { key: "Elderly_Care" as PlanCategory, label: "Elderly Care" },
  { key: "Special_Health_Condition" as PlanCategory, label: "Special Health Condition" },
  { key: "Pediatric_Care" as PlanCategory, label: "Pediatric (Special Needs)" },
  { key: "Post_surgery_Recovery_Care" as PlanCategory, label: "Post-surgery Recovery" },
  { key: "Pre_Post_Natal_Care" as PlanCategory, label: "Pre & Post Natal Care" },
] as const

export const TIER_COLORS: Record<string, string> = {
  Bronze: "text-pending-border",
  Silver: "text-zinc-500",
  Gold: "text-yellow-600",
  Diamond: "text-cyan-600",
}

export const TIER_BORDER_COLORS: Record<string, string> = {
  Bronze: "border-pending-border",
  Silver: "border-[#6F6F6F]",
  Gold: "border-secondary-color",
  Diamond: "border-active-border",
}

export const DEFAULT_COVERAGE_ITEMS = [
  "Bathing & Grooming",
  "Toilet Care & Hygiene",
  "Vital Signs Monitoring",
  "Feeding Assistance",
  "Medication Management & Reminders (Non-administered)",
  "Mobility Assistance & Fall Prevention",
  "Companionship & Mental Stimulation",
  "Escorting to Appointments & Social Functions",
  "Emotional Support & Reducing Isolation",
  "Communication Management (Phone, email, etc.)",
]

const TIERS: PlanTier[] = ["Bronze", "Silver", "Gold", "Diamond"]

export const STATIC_FALLBACK_PLANS: PlanType[] = CATEGORIES_UI.flatMap((cat) =>
  TIERS.map((tier) => ({
    id: `${cat.key.toLowerCase()}-${tier.toLowerCase()}-plan`,
    tier,
    name: `${tier} Tier Plan`,
    category: cat.key,
    price: 50,
    price_in_usd: 50,
    coverage: DEFAULT_COVERAGE_ITEMS,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    isDeleted: false,
  }))
)

