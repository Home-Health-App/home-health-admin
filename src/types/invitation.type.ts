// ─── Enums ───────────────────────────────────────────────────────────────────

export type InviteeType = "USER" | "CARE_GIVER"

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED"

// ─── Entity Types ────────────────────────────────────────────────────────────

export type InvitationType = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  type: InviteeType
  status: InvitationStatus
  expiresAt: string
  code: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
}

// ─── Request (Payload) Types ─────────────────────────────────────────────────

export type SendInvitationType = {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  type: InviteeType
}
