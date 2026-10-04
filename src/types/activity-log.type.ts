export interface ActivityLogItem {
  _id: string
  admin_id?: string
  user_id?: string
  patient_id?: string
  action: string
  message: string
  actor_type: string
  log_type: string
  created_at: string
  __v?: number
}

export interface GetActivityLogsQueryParams {
  admin_id?: string
  page?: number
  limit?: number
  // user_id?: string
  // patient_id?: string
}
