import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getAdminNotifications } from "@/services/notification.service"
import { AdminNotification, GetAdminNotificationsParams } from "@/types/notification.type"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const notificationKeys = {
  all: ["notifications"] as const,
  admin: (params?: GetAdminNotificationsParams) =>
    [...notificationKeys.all, "admin", params || {}] as const,
}

export const useGetAdminNotifications = (
  params?: GetAdminNotificationsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    PaginatedResponse<AdminNotification[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: notificationKeys.admin(params),
    queryFn: () => getAdminNotifications(params),
    enabled: options?.enabled ?? true,
  })
}

export const useSuspenseGetAdminNotifications = (
  params?: GetAdminNotificationsParams
) => {
  return useSuspenseQuery<PaginatedResponse<AdminNotification[]>>({
    queryKey: notificationKeys.admin(params),
    queryFn: () => getAdminNotifications(params),
  })
}
