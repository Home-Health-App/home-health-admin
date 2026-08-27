import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getUsers, getUserById } from "@/services/user.service"
import { GetUsersQueryParams } from "@/types/user.type"

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
