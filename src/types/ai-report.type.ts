import { PatientType, PatientUser } from "./patient.type"

export interface AiReportKeyMetrics {
  moodChange: string
  moodSummary: string
  avgHeartRate: number
  avgPainLevel: number
}

export interface AiReportSymptomItem {
  name?: string
  count?: number
  severity?: "Mild" | "Moderate" | "Serious" | string
  [key: string]: any
}

export interface AiReportMedicationAdherenceItem {
  name?: string
  dosage?: string
  adherencePercentage?: number
  [key: string]: any
}

export interface AiReportMedicationAdherence {
  items: AiReportMedicationAdherenceItem[]
  overallPercentage: number
}

export interface AiReportPatient {
  id: string
  user_id?: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  profile_picture?: string | null
  country?: string
  state?: string
  gender?: string
  date_of_birth?: string
  relationship?: string | null
  notes?: string | null
  chronic_conditions?: string[]
  allergies?: string[]
  age?: number
  blood_group?: string
  genotype?: string
  height?: number
  weight?: number
  status?: string
  plan_id?: string
  caregiver_id?: string | null
  isSuspended?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  isDeleted?: boolean
  isCreatedByAdmin?: boolean
}

export interface AiHealthReport {
  id: string
  patient_id: string
  user_id: string
  reporting_period_start: string
  reporting_period_end: string
  executive_summary: string
  ai_recommendations: string[]
  key_metrics: AiReportKeyMetrics
  symptom_analysis: AiReportSymptomItem[]
  medication_adherence: AiReportMedicationAdherence
  pdf_url: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  patient?: AiReportPatient | PatientType
  user?: PatientUser
}

export interface GetAiReportsQueryParams {
  page?: number
  limit?: number
  patient_id?: string
}

