import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import { PlanType, CreatePlanType, UpdatePlanType, PlanCategory, PlanTier } from "@/types/billing.type"
import { AdminAnalyticType, CaregiverAnalyticType, UserAnalyticType } from "@/types/analytic.type"


// ─── Get Plan By ID ──────────────────────────────────────────────────────────

export const getAdminAnalytics = async (): Promise<GeneralResponse<AdminAnalyticType>> => {
  return api.get<GeneralResponse<AdminAnalyticType>>(URLs.analytics["admin-analytic"])
}



export const getCaregiverAnalytics = async (): Promise<GeneralResponse<CaregiverAnalyticType>> => {
  return api.get<GeneralResponse<CaregiverAnalyticType>>(URLs.analytics["caregiver-analytic"])
}


export const getUserAnalytics = async (
  userId: string
): Promise<GeneralResponse<UserAnalyticType>> => {
  return api.get<GeneralResponse<UserAnalyticType>>(URLs.analytics["user-analytic"](userId))
}

