import { z } from "zod/v4"

export const medicationScheduleSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  schedule_type: z.enum(["Specific Times", "Interval"]).optional(),
  times: z.array(z.string()).optional(),
  interval: z.string().optional(),
  starting_from: z.string().optional(),
  days_of_week: z.array(z.string()).optional(),
})

export const step1PatientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Residential address is required"),
  profile_picture: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  relationship: z.string().min(1, "Relationship to family member is required"),
})

export const step2MedicalSchema = z.object({
  chronic_conditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  blood_group: z.string().optional(),
  genotype: z.string().optional(),
  height: z.number().or(z.string()).optional(),
  weight: z.number().or(z.string()).optional(),
  notes: z.string().optional(),
  medications: z.array(medicationScheduleSchema).optional(),
})

export const step3PlanSchema = z.object({
  plan_id: z.string().min(1, "Please select a subscription plan"),
})

export const createPatientSchema = step1PatientSchema.and(step2MedicalSchema).and(step3PlanSchema.partial())

export type Step1PatientSchemaType = z.infer<typeof step1PatientSchema>
export type Step2MedicalSchemaType = z.infer<typeof step2MedicalSchema>
export type Step3PlanSchemaType = z.infer<typeof step3PlanSchema>
export type CreatePatientSchemaType = z.infer<typeof createPatientSchema>
export type MedicationScheduleType = z.infer<typeof medicationScheduleSchema>
