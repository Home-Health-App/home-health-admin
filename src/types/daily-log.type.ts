export interface DailyLogVital {
  id: string
  daily_log_id: string
  heart_rate?: number | null
  respiratory_rate?: number | null
  systolic_bp?: number | null
  diastolic_bp?: number | null
  temperature?: number | null
  oxygen_saturation?: number | null
  pain_level?: number | null
  blood_glucose?: string | number | null
  weight?: number | null
  time_taken?: string
  notes?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogMedicationRecord {
  id: string
  daily_log_id: string
  medication_name: string
  dose: string
  time_taken: string
  notes?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogIncidentReport {
  id: string
  daily_log_id: string
  incident_type: string
  time_taken: string
  notes?: string | null
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string
  description?: string
  action_taken?: string
  reported_to_family?: boolean
  reported_to_family_time?: string | null
  reported_to_professional?: boolean
  reported_to_professional_time?: string | null
  next_follow_up_date?: string | null
  location?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogMood {
  id: string
  daily_log_id: string
  mode: "HAPPY" | "NEUTRAL" | "SAD" | "ANXIOUS" | "CONFUSED" | string
  time_taken: string
  notes?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogSymptom {
  id: string
  daily_log_id: string
  symptom: string
  severity: "MILD" | "MEDIUM" | "HIGH" | "SERIOUS" | string
  time_taken: string
  notes?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogADL {
  id: string
  daily_log_id: string
  personal_hygiene_assistance?: string | null
  personal_hygiene_assistance_note?: string | null
  feeding_assistance?: string | null
  feeding_assistance_note?: string | null
  mobility_assistance?: string | null
  mobility_assistance_note?: string | null
  exercise_assistance?: string | null
  pressure_area_care?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogPhysical {
  id: string
  daily_log_id: string
  sleep_last_night?: string | null
  hydration?: string | null
  fall_risk?: string | null
  skin_condition?: string | null
  bowel_function?: string | null
  bladder_function?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogCareGiverNote {
  id: string
  daily_log_id: string
  note: string
  time_taken: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
}

export interface DailyLogType {
  id: string
  patient_id: string
  user_id?: string | null
  date: string
  note?: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
  isDeleted: boolean
  vitals: DailyLogVital[]
  medicationRecords: DailyLogMedicationRecord[]
  incidentReports: DailyLogIncidentReport[]
  moods: DailyLogMood[]
  symptoms: DailyLogSymptom[]
  adls: DailyLogADL[]
  physicals: DailyLogPhysical[]
  activities: any[]
  careGiverNotes: DailyLogCareGiverNote[]
}

export interface GetDailyLogsQueryParams {
  page?: number
  limit?: number
}
