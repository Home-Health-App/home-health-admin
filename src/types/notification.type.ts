export type NotificationCategory =
  | "VITALS"
  | "MEDICATIONS"
  | "INCIDENTS"
  | "CAREGIVER"
  | "FAMILY"
  | "AI_REPORTS"
  | "GENERAL"
  | string

export interface AdminNotification {
  id: string
  title: string
  message: string
  category: NotificationCategory
  is_read: boolean
  created_at: string
  updated_at?: string
}

export interface GetAdminNotificationsParams {
  page?: number
  limit?: number
  unread?: boolean
}

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  VITALS: "Vitals",
  MEDICATIONS: "Medications",
  INCIDENTS: "Incidents",
  CAREGIVER: "Caregiver",
  FAMILY: "Family",
  AI_REPORTS: "AI Reports",
  GENERAL: "General",
  Vitals: "Vitals",
  Medications: "Medications",
  Incidents: "Incidents",
  Caregiver: "Caregiver",
  Family: "Family",
  "AI Reports": "AI Reports",
}
