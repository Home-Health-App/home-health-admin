import { PlanType, PlanTier } from "./billing.type"
import { PatientType, PatientUser, PatientPlan } from "./patient.type"

export type BillStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED"

export type PaystackPaymentMethod = "card" | "bank_transfer" | "ussd" | "qr"

export interface CreatePaymentLinkPayload {
  patient_id: string
  plan_id: string
  first_name: string
  last_name: string
  email: string
  currency: string
}

export interface CreateBillPayload {
  patient_id: string
  user_id: string
  plan_id: string
  invoice_notes?: string
  start_date?: string
  due_date?: string
  currency?: "USD" | "NGN"
}

export interface GeneratedBillData {
  id: string
  patient: PatientType
  user?: PatientUser | null
  plan: PlanType | PatientPlan
  total_amount: number
  currency: "USD" | "NGN"
  status: BillStatus
  payment_link: string
  invoice_notes?: string
  created_at: string
  due_date?: string
}

export interface PaystackTransactionReceipt {
  reference: string
  bill_id: string
  patient_id: string
  patient_name: string
  payer_id?: string
  payer_name: string
  payer_email: string
  plan_id: string
  plan_name: string
  plan_tier: PlanTier | string
  amount: number
  currency: "USD" | "NGN"
  payment_method: PaystackPaymentMethod
  status: "success" | "failed" | "abandoned"
  paid_at: string
  authorization_code?: string
  channel?: string
}

export interface PaymentLinkResponseData {
  id: string
  payment_id: string
  patient_id: string
  plan_id: string
  first_name: string
  last_name: string
  email: string
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | string
  created_at: string
  updated_at: string
  deleted_at: string | null
  isDeleted: boolean
  patient: {
    id: string
    user_id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    profile_picture?: string | null
    country?: string
    state?: string
    gender?: string
    date_of_birth?: string
    relationship?: string
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
    user?: {
      id: string
      first_name: string
      last_name: string
      email: string
      phone?: string
    }
  }
  plan: PlanType
  payment: {
    id: string
    user_id: string
    status: string
    plan_id: string
    patient_id: string
    currency: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    isDeleted: boolean
    user?: {
      id: string
      first_name: string
      last_name: string
      email: string
      phone?: string
    }
  }
}

