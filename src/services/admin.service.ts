import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  CreateAdminUserPayload,
  UpdateAdminUserPayload,
  AdminUserType,
  GetAdminsQueryParams,
} from "@/types/admin.type"

export const createAdminUser = async (
  payload: CreateAdminUserPayload
): Promise<GeneralResponse<AdminUserType>> => {
  return api.post<GeneralResponse<AdminUserType>>(
    URLs.admin["create-admin"],
    payload
  )
}

export const updateAdminUser = async (
  id: string,
  payload: UpdateAdminUserPayload
): Promise<GeneralResponse<AdminUserType>> => {
  return api.put<GeneralResponse<AdminUserType>>(
    URLs.admin["update-admin"](id),
    payload
  )
}

export const getAdmins = async (
  params?: GetAdminsQueryParams
): Promise<GeneralResponse<AdminUserType[]> & PaginatedResponse<AdminUserType[]>> => {
  return api.get(URLs.admin["get-admins"], { params })
}

