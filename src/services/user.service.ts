import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { UserType, GetUsersQueryParams } from "@/types/user.type"

export const getUsers = async (
  params?: GetUsersQueryParams
): Promise<PaginatedResponse<UserType[]>> => {
  return api.get<PaginatedResponse<UserType[]>>(URLs.users["get-users"], { params })
}

export const getUserById = async (
  id: string
): Promise<GeneralResponse<UserType>> => {
  return api.get<GeneralResponse<UserType>>(URLs.users["get-user-by-id"](id))
}
