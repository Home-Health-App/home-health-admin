import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse } from "@/types/response.type"
import { AdminNotification, GetAdminNotificationsParams } from "@/types/notification.type"

export const getAdminNotifications = async (
  params?: GetAdminNotificationsParams
): Promise<PaginatedResponse<AdminNotification[]>> => {
  return api.get<PaginatedResponse<AdminNotification[]>>(
    URLs.notifications["get-admin-notifications"],
    { params }
  )
}
