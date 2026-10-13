import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { getActivityLogs } from "@/services/activity-log.service"
import {
  ActivityLogItem,
  GetActivityLogsQueryParams,
} from "@/types/activity-log.type"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const activityLogKeys = {
  all: ["activity-logs"] as const,
  lists: () => [...activityLogKeys.all, "list"] as const,
  list: (params?: GetActivityLogsQueryParams) =>
    [...activityLogKeys.lists(), params || {}] as const,
}

export const useGetActivityLogs = (
  params?: GetActivityLogsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    PaginatedResponse<ActivityLogItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: activityLogKeys.list(params),
    queryFn: () => getActivityLogs(params),
    enabled: options?.enabled ?? true,
  })
}

export const useSuspenseGetActivityLogs = (
  params?: GetActivityLogsQueryParams
) => {
  return useSuspenseQuery<
    PaginatedResponse<ActivityLogItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: activityLogKeys.list(params),
    queryFn: () => getActivityLogs(params),
  })
}
