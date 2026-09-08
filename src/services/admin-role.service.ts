import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import { AdminRole, CreateAdminRolePayload } from "@/types/admin-role.type"

export const getAdminRoles = async (): Promise<GeneralResponse<AdminRole[]>> => {
  return api.get<GeneralResponse<AdminRole[]>>(URLs.adminRoles["get-roles"])
}

export const createAdminRole = async (
  payload: CreateAdminRolePayload
): Promise<GeneralResponse<AdminRole>> => {
  return api.post<GeneralResponse<AdminRole>>(
    URLs.adminRoles["create-role"],
    payload
  )
}

export const updateAdminRole = async (
  id: string,
  payload: CreateAdminRolePayload
): Promise<GeneralResponse<AdminRole>> => {
  return api.put<GeneralResponse<AdminRole>>(
    URLs.adminRoles["update-role"](id),
    payload
  )
}

export const deleteAdminRole = async (
  id: string
): Promise<GeneralResponse<null>> => {
  return api.delete<GeneralResponse<null>>(URLs.adminRoles["delete-role"](id))
}

export const getAdminRoleById = async (
  id: string
): Promise<GeneralResponse<AdminRole>> => {
  return api.get<GeneralResponse<AdminRole>>(
    URLs.adminRoles["get-role-by-id"](id)
  )
}
