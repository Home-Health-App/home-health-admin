import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  getUserById,
  suspendCaregiver,
  SuspendCaregiverPayload,
  suspendUser,
  SuspendUserPayload,
} from "@/services/user.service"
import { GetUsersQueryParams } from "@/types/user.type"
import { GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: GetUsersQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export const useGetUsers = (params?: GetUsersQueryParams) => {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
  })
}

export const useSuspenseGetUsers = (params?: GetUsersQueryParams) => {
  return useSuspenseQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => getUsers(params),
  })
}

export const useGetUserById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
  })
}

export const useSuspenseGetUserById = (id: string) => {
  return useSuspenseQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
  })
}

export const useSuspendCaregiver = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    { id: string; payload: SuspendCaregiverPayload }
  >({
    mutationFn: ({ id, payload }) => suspendCaregiver(id, payload),
    mutationKey: ["suspend_caregiver"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
    },
  })
}

export const useSuspendUser = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    { id: string; payload: SuspendUserPayload }
  >({
    mutationFn: ({ id, payload }) => suspendUser(id, payload),
    mutationKey: ["suspend_user"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
    },
  })
}
