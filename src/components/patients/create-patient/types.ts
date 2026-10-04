import { MedicationSchedule } from "@/types/patient.type"
import { PlanCategory } from "@/types/billing.type"

export interface PatientDemographicsData {
  profilePicPreview: string | null
  profilePicUrl: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  relationship: string
  address: string
  country: string
  state: string
}

export interface PatientMedicalData {
  conditions: string[]
  allergies: string[]
  medicationsList: MedicationSchedule[]
  weight: string
  weightUnit: "kg" | "lbs"
  height: string
  heightUnit: "cm" | "in"
  bloodGroup: string
  genotype: string
  additionalHeight: string
  specialInstructions: string
}

export interface PatientPlanData {
  selectedCategory: PlanCategory
  billingPeriod: "monthly" | "yearly"
  selectedPlanId: string
}
