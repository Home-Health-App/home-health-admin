import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  PlanType,
  CreatePlanType,
  UpdatePlanType,
  PlanCategory,
  PlanTier,
  AdminPaymentItem,
  GetAdminPaymentsParams,
} from "@/types/billing.type"
import { CreatePaymentLinkPayload, PaymentLinkResponseData } from "@/types/billing-link.type"

// ─── Create Plan ─────────────────────────────────────────────────────────────

export const createPlan = async (
  payload: CreatePlanType
): Promise<GeneralResponse<PlanType>> => {
  return api.post<GeneralResponse<PlanType>>(URLs.plans["create-plan"], payload)
}

// ─── Get All Plans ───────────────────────────────────────────────────────────

export interface GetAllPlansParams {
  category?: PlanCategory
  tier?: PlanTier
}

export const getAllPlans = async (
  params?: GetAllPlansParams
): Promise<GeneralResponse<PlanType[]>> => {
  return api.get<GeneralResponse<PlanType[]>>(URLs.plans["get-all-plans"], { params })
}

// ─── Get Plan By ID ──────────────────────────────────────────────────────────

export const getPlanById = async (
  id: string
): Promise<GeneralResponse<PlanType>> => {
  return api.get<GeneralResponse<PlanType>>(URLs.plans["get-plan-by-id"](id))
}

// ─── Update Plan ─────────────────────────────────────────────────────────────

export const updatePlan = async (
  id: string,
  payload: UpdatePlanType
): Promise<GeneralResponse<PlanType>> => {
  return api.put<GeneralResponse<PlanType>>(URLs.plans["update-plan"](id), payload)
}

// ─── Delete Plan ─────────────────────────────────────────────────────────────

export const deletePlan = async (
  id: string
): Promise<GeneralResponse<null>> => {
  return api.delete<GeneralResponse<null>>(URLs.plans["delete-plan"](id))
}

// ─── Get Categories ──────────────────────────────────────────────────────────

export const getPlanCategories = async (): Promise<GeneralResponse<string[]>> => {
  return api.get<GeneralResponse<string[]>>(URLs.plans["get-categories"])
}

// ─── Get Tiers ───────────────────────────────────────────────────────────────

export const getPlanTiers = async (): Promise<GeneralResponse<string[]>> => {
  return api.get<GeneralResponse<string[]>>(URLs.plans["get-tiers"])
}

// ─── Get Admin Payments ──────────────────────────────────────────────────────

export const getAdminPayments = async (
  params?: GetAdminPaymentsParams
): Promise<PaginatedResponse<AdminPaymentItem[]>> => {
  return api.get<PaginatedResponse<AdminPaymentItem[]>>(
    URLs.payment["get-admin-payments"],
    { params }
  )
}

// ─── Get Payment By Patient ID ───────────────────────────────────────────────

export const getPaymentByPatientId = async (
  patientId: string
): Promise<PaginatedResponse<AdminPaymentItem[]>> => {
  return api.get<PaginatedResponse<AdminPaymentItem[]>>(
    URLs.payment["get-patient-payment"](patientId)
  )
}

// ─── Create Payment Link ─────────────────────────────────────────────────────

export const createPaymentLink = async (
  payload: CreatePaymentLinkPayload
): Promise<GeneralResponse<any>> => {
  return api.post<GeneralResponse<any>>(
    URLs.payment["create-payment-link"],
    payload
  )
}

// ─── Get Payment By ID ────────────────────────────────────────────────────────

export const getPaymentById = async (
  paymentId: string
): Promise<GeneralResponse<PaymentLinkResponseData>> => {
  return api.get<GeneralResponse<PaymentLinkResponseData>>(
    URLs.payment["get-payment-by-id"](paymentId)
  )
}


