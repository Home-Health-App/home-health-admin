import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminRoles,
  createAdminRole,
  updateAdminRole,
  deleteAdminRole,
  getAdminRoleById,
} from "@/services/admin-role.service"
import { GeneralResponse } from "@/types/response.type"
import { AdminRole, CreateAdminRolePayload } from "@/types/admin-role.type"
import { AxiosError } from "axios"

export const adminRoleKeys = {
  all: ["admin_roles"] as const,
  lists: () => [...adminRoleKeys.all, "list"] as const,
  details: () => [...adminRoleKeys.all, "detail"] as const,
  detail: (id: string) => [...adminRoleKeys.details(), id] as const,
}

export const useGetAdminRoles = () => {
  return useQuery<
    GeneralResponse<AdminRole[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: adminRoleKeys.lists(),
    queryFn: getAdminRoles,
  })
}

export const useGetAdminRoleById = (id: string) => {
  return useQuery<
    GeneralResponse<AdminRole>,
    AxiosError<GeneralResponse>
  >({
    queryKey: adminRoleKeys.detail(id),
    queryFn: () => getAdminRoleById(id),
    enabled: !!id,
  })
}

export const useCreateAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<AdminRole>,
    AxiosError<GeneralResponse>,
    CreateAdminRolePayload
  >({
    mutationFn: createAdminRole,
    mutationKey: ["create_admin_role"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() })
    },
  })
}

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<AdminRole>,
    AxiosError<GeneralResponse>,
    { id: string; payload: CreateAdminRolePayload }
  >({
    mutationFn: ({ id, payload }) => updateAdminRole(id, payload),
    mutationKey: ["update_admin_role"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() })
      queryClient.invalidateQueries({ queryKey: adminRoleKeys.detail(variables.id) })
    },
  })
}

export const useDeleteAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<null>,
    AxiosError<GeneralResponse>,
    string
  >({
    mutationFn: deleteAdminRole,
    mutationKey: ["delete_admin_role"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminRoleKeys.lists() })
    },
  })
}
