import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import { PlanType, CreatePlanType, UpdatePlanType, PlanCategory, PlanTier } from "@/types/billing.type"

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
