import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  InvitationType,
  SendInvitationType,
  InviteeType,
  InvitationStatus,
} from "@/types/invitation.type"

// ─── Send Invitation ─────────────────────────────────────────────────────────

export const sendInvitation = async (
  payload: SendInvitationType
): Promise<GeneralResponse> => {
  return api.post<GeneralResponse>(URLs.invitation["send-invitation"], payload)
}

// ─── Get Invitations ─────────────────────────────────────────────────────────

export interface GetInvitationsParams {
  page?: number
  limit?: number
  type?: InviteeType
  status?: InvitationStatus
}

export const getInvitations = async (
  params?: GetInvitationsParams
): Promise<PaginatedResponse<InvitationType[]>> => {
  return api.get<PaginatedResponse<InvitationType[]>>(
    URLs.invitation["get-invitations"],
    { params }
  )
}

// ─── Get Invitation By ID ────────────────────────────────────────────────────

export const getInvitationById = async (
  id: string
): Promise<GeneralResponse<InvitationType>> => {
  return api.get<GeneralResponse<InvitationType>>(
    URLs.invitation["get-invitation-by-id"](id)
  )
}

