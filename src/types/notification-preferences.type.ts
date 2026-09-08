export interface NotificationPreferences {
  id: string
  user_id: string | null
  admin_id: string
  vitals: boolean
  medication: boolean
  symptoms: boolean
  moods: boolean
  activities: boolean
  incident_reports: boolean
  care_giver: boolean
  ai_report: boolean
  created_at: string
  updated_at: string
}

export type UpdateNotificationPreferencesPayload = Omit<
  NotificationPreferences,
  "id" | "user_id" | "admin_id" | "created_at" | "updated_at"
>
