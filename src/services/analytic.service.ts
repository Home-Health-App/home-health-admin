import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import {
  AdminAnalyticType,
  AdminGraphsAnalyticType,
  AdminGraphsQueryParams,
  AdminUserAnalyticType,
  CaregiverAnalyticType,
  PatientPaymentAnalyticType,
  UserAnalyticType,
} from "@/types/analytic.type"

export const getAdminAnalytics = async (): Promise<
  GeneralResponse<AdminAnalyticType>
> => {
  return api.get<GeneralResponse<AdminAnalyticType>>(
    URLs.analytics["admin-analytic"]
  )
}

export const getAdminGraphsAnalytics = async (
  params?: AdminGraphsQueryParams
): Promise<GeneralResponse<AdminGraphsAnalyticType>> => {
  return api.get<GeneralResponse<AdminGraphsAnalyticType>>(
    URLs.analytics["admin-graphs"],
    { params }
  )
}

export const getAdminUserAnalytics = async (
  userId: string
): Promise<GeneralResponse<AdminUserAnalyticType>> => {
  return api.get<GeneralResponse<AdminUserAnalyticType>>(
    URLs.analytics["admin-user-analytic"](userId)
  )
}

export const getCaregiverAnalytics = async (): Promise<
  GeneralResponse<CaregiverAnalyticType>
> => {
  return api.get<GeneralResponse<CaregiverAnalyticType>>(
    URLs.analytics["caregiver-analytic"]
  )
}

export const getUserAnalytics = async (
  userId: string
): Promise<GeneralResponse<UserAnalyticType>> => {
  return api.get<GeneralResponse<UserAnalyticType>>(
    URLs.analytics["user-analytic"](userId)
  )
}

export const getPatientPaymentAnalytics = async (
  patientId: string
): Promise<GeneralResponse<PatientPaymentAnalyticType>> => {
  return api.get<GeneralResponse<PatientPaymentAnalyticType>>(
    URLs.analytics["patient-payment-analytic"](patientId)
  )
}
