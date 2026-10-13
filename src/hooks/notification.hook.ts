import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminNotifications,
  markNotificationsRead,
  deleteNotification,
} from "@/services/notification.service"
import {
  GetAdminNotificationsQueryParams,
  MarkNotificationsReadPayload,
  INotification,
} from "@/types/notification.type"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params?: GetAdminNotificationsQueryParams) =>
    [...notificationKeys.lists(), params || {}] as const,
  admin: (params?: GetAdminNotificationsQueryParams) =>
    [...notificationKeys.lists(), params || {}] as const,
}

export const useGetAdminNotifications = (
  params?: GetAdminNotificationsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    PaginatedResponse<INotification[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: notificationKeys.list(params),
    queryFn: () => getAdminNotifications(params),
    enabled: options?.enabled ?? true,
  })
}

export const useSuspenseGetAdminNotifications = (
  params?: GetAdminNotificationsQueryParams
) => {
  return useSuspenseQuery<
    PaginatedResponse<INotification[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: notificationKeys.list(params),
    queryFn: () => getAdminNotifications(params),
  })
}

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    MarkNotificationsReadPayload
  >({
    mutationFn: (payload) => markNotificationsRead(payload),
    mutationKey: ["mark_notifications_read"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    string
  >({
    mutationFn: (id) => deleteNotification(id),
    mutationKey: ["delete_notification"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
