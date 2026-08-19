// ─── Enums ───────────────────────────────────────────────────────────────────

export type InviteeType = "USER" | "CARE_GIVER"

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED"

// ─── Entity Types ────────────────────────────────────────────────────────────

export type InvitationType = {
  id: string
  email: string
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
  type: InviteeType
}
