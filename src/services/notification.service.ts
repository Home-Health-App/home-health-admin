import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import {
  INotification,
  GetAdminNotificationsQueryParams,
  MarkNotificationsReadPayload,
} from "@/types/notification.type"

export const getAdminNotifications = async (
  params?: GetAdminNotificationsQueryParams
): Promise<PaginatedResponse<INotification[]>> => {
  return api.get<PaginatedResponse<INotification[]>>(
    URLs.notification["get-admin-notifications"],
    { params }
  )
}

export const markNotificationsRead = async (
  payload: MarkNotificationsReadPayload
): Promise<GeneralResponse<any>> => {
  return api.patch<GeneralResponse<any>>(
    URLs.notification["mark-read"],
    payload
  )
}

export const deleteNotification = async (
  id: string
): Promise<GeneralResponse<any>> => {
  return api.delete<GeneralResponse<any>>(
    URLs.notification["delete-notification"](id)
  )
}
