import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAdmins, createAdminUser, updateAdminUser } from "@/services/admin.service"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
  AdminUserType,
  GetAdminsQueryParams,
} from "@/types/admin.type"
import { AxiosError } from "axios"

export const adminKeys = {
  all: ["admins"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (params?: GetAdminsQueryParams) => [...adminKeys.lists(), params || {}] as const,
}

export const useGetAdmins = (params?: GetAdminsQueryParams, enabled = true) => {
  return useQuery<
    GeneralResponse<AdminUserType[]> & PaginatedResponse<AdminUserType[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: adminKeys.list(params),
    queryFn: () => getAdmins(params),
    enabled,
  })
}

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<AdminUserType>,
    AxiosError<GeneralResponse>,
    CreateAdminUserPayload
  >({
    mutationFn: createAdminUser,
    mutationKey: ["create_admin_user"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<AdminUserType>,
    AxiosError<GeneralResponse>,
    { id: string; payload: UpdateAdminUserPayload }
  >({
    mutationFn: ({ id, payload }) => updateAdminUser(id, payload),
    mutationKey: ["update_admin_user"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all })
    },
  })
}

