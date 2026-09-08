import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/services/notification-preferences.service"
import { GeneralResponse } from "@/types/response.type"
import {
  NotificationPreferences,
  UpdateNotificationPreferencesPayload,
} from "@/types/notification-preferences.type"
import { AxiosError } from "axios"

export const preferenceKeys = {
  all: ["notification_preferences"] as const,
  detail: (adminId: string) => [...preferenceKeys.all, "admin", adminId] as const,
}

export const useGetNotificationPreferences = (adminId: string) => {
  return useQuery<
    GeneralResponse<NotificationPreferences>,
    AxiosError<GeneralResponse>
  >({
    queryKey: preferenceKeys.detail(adminId),
    queryFn: () => getNotificationPreferences(adminId),
    enabled: !!adminId,
  })
}

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<NotificationPreferences>,
    AxiosError<GeneralResponse>,
    { adminId: string; payload: UpdateNotificationPreferencesPayload }
  >({
    mutationFn: ({ adminId, payload }) =>
      updateNotificationPreferences(adminId, payload),
    mutationKey: ["update_notification_preferences"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: preferenceKeys.detail(variables.adminId),
      })
    },
  })
}
