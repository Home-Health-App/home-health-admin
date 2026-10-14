import { IUser, IAdmin } from "@/libs/types"

export type NotificationCategory =
  | "Vitals"
  | "Medication"
  | "Symptoms"
  | "Moods"
  | "Activities"
  | "Incident_Reports"
  | "Care_giver"
  | "AI_Report"
  | "Others"
  | string

export type UserType = "USER" | "CARE_GIVER"

export interface INotification {
  id: string
  user_id?: string | null
  user?: Partial<IUser> | null
  admin_id?: string | null
  admin?: Partial<IAdmin> | null
  title: string
  message: string
  is_read: boolean
  read_by?: string[]
  category: NotificationCategory
  user_type?: UserType | null
  created_at: string | Date
  deleted_at?: string | Date | null
  isDeleted?: boolean
}

// Backwards-compatibility alias
export type AdminNotification = INotification

export interface GetAdminNotificationsQueryParams {
  page?: number
  limit?: number
  category?: NotificationCategory
  is_read?: boolean
  unread?: boolean
  user_id?: string // filter for the specific admin user id
}

export type GetAdminNotificationsParams = GetAdminNotificationsQueryParams

export interface MarkNotificationsReadPayload {
  notification_ids: string[]
}

export const NOTIFICATION_CATEGORIES: { value: NotificationCategory; label: string }[] = [
  { value: "Vitals", label: "Vitals" },
  { value: "Medication", label: "Medication" },
  { value: "Symptoms", label: "Symptoms" },
  { value: "Moods", label: "Moods" },
  { value: "Activities", label: "Activities" },
  { value: "Incident_Reports", label: "Incident Reports" },
  { value: "Care_giver", label: "Caregiver" },
  { value: "AI_Report", label: "AI Report" },
  { value: "Others", label: "Others" },
]

export const NOTIFICATION_CATEGORY_LABELS: Record<string, string> = {
  VITALS: "Vitals",
  MEDICATIONS: "Medications",
  INCIDENTS: "Incidents",
  CAREGIVER: "Caregiver",
  FAMILY: "Family",
  AI_REPORTS: "AI Reports",
  GENERAL: "General",
  Vitals: "Vitals",
  Medication: "Medication",
  Symptoms: "Symptoms",
  Moods: "Moods",
  Activities: "Activities",
  Incident_Reports: "Incident Reports",
  Care_giver: "Caregiver",
  AI_Report: "AI Report",
  Others: "Others",
}
