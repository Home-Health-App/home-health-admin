import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import {
  NotificationPreferences,
  UpdateNotificationPreferencesPayload,
} from "@/types/notification-preferences.type"

export const getNotificationPreferences = async (
  adminId: string
): Promise<GeneralResponse<NotificationPreferences>> => {
  return api.get<GeneralResponse<NotificationPreferences>>(
    URLs.notificationPreferences["admin-preferences"](adminId)
  )
}

export const updateNotificationPreferences = async (
  adminId: string,
  payload: UpdateNotificationPreferencesPayload
): Promise<GeneralResponse<NotificationPreferences>> => {
  return api.patch<GeneralResponse<NotificationPreferences>>(
    URLs.notificationPreferences["admin-preferences"](adminId),
    payload
  )
}
