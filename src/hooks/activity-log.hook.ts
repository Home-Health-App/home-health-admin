import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
  getActivityLogs,
  getUserActivityLogs,
} from "@/services/activity-log.service"
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
  userLogs: (userId: string, params?: GetActivityLogsQueryParams) =>
    [...activityLogKeys.all, "user-logs", userId, params || {}] as const,
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

export const useGetUserActivityLogs = (
  userId: string,
  params?: GetActivityLogsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    PaginatedResponse<ActivityLogItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: activityLogKeys.userLogs(userId, params),
    queryFn: () => getUserActivityLogs(userId, params),
    enabled: (options?.enabled ?? true) && !!userId,
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

