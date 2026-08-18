import { z } from "zod/v4"

// ─── Invitee Type Enum ───────────────────────────────────────────────────────

export const inviteeTypeEnum = z.enum(["USER", "CARE_GIVER"])

// ─── Send Invitation Schema ─────────────────────────────────────────────────

export const sendInvitationSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  type: inviteeTypeEnum,
})

export type SendInvitationSchemaType = z.infer<typeof sendInvitationSchema>
