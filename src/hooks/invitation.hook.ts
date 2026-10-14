import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import {
  sendInvitation,
  getInvitations,
  getInvitationById,
  GetInvitationsParams,
} from "@/services/invitation.service"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import { InvitationType, SendInvitationType } from "@/types/invitation.type"
import { AxiosError } from "axios"

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const invitationKeys = {
  all: ["invitations"] as const,
  lists: () => [...invitationKeys.all, "list"] as const,
  list: (params?: GetInvitationsParams) =>
    [...invitationKeys.lists(), params] as const,
  detail: (id: string) => [...invitationKeys.all, "detail", id] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useGetInvitations = (params?: GetInvitationsParams) => {
  const { isPending, data, error, refetch } = useQuery<
    PaginatedResponse<InvitationType[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: invitationKeys.list(params),
    queryFn: () => getInvitations(params),
  })

  return { isPending, data, error, refetch }
}

export const useGetInvitationById = (id: string) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<InvitationType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: invitationKeys.detail(id),
    queryFn: () => getInvitationById(id),
    enabled: !!id,
  })

  return { isPending, data, error, refetch }
}

export const useSuspenseGetInvitations = (params?: GetInvitationsParams) => {
  return useSuspenseQuery<PaginatedResponse<InvitationType[]>, AxiosError<GeneralResponse>>({
    queryKey: invitationKeys.list(params),
    queryFn: () => getInvitations(params),
  })
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useSendInvitation = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse,
    AxiosError<GeneralResponse>,
    SendInvitationType
  >({
    mutationFn: sendInvitation,
    mutationKey: ["send_invitation"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}
