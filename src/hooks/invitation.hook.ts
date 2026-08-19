import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  sendInvitation,
  getInvitations,
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
