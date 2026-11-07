import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse } from "@/types/response.type"
import {
  ActivityLogItem,
  GetActivityLogsQueryParams,
} from "@/types/activity-log.type"

export const getActivityLogs = async (
  params?: GetActivityLogsQueryParams
): Promise<PaginatedResponse<ActivityLogItem[]>> => {
  return api.get<PaginatedResponse<ActivityLogItem[]>>(
    URLs.activityLogs["get-activity-logs"],
    { params }
  )
}

export const getUserActivityLogs = async (
  userId: string,
  params?: GetActivityLogsQueryParams
): Promise<PaginatedResponse<ActivityLogItem[]>> => {
  return api.get<PaginatedResponse<ActivityLogItem[]>>(
    URLs.activityLogs["get-user-activity-logs"](userId),
    { params }
  )
}

