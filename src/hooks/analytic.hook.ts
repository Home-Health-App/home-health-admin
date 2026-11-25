import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"
import {
  AdminAnalyticType,
  AdminGraphsAnalyticType,
  AdminGraphsQueryParams,
  AdminUserAnalyticType,
  CaregiverAnalyticType,
  PatientPaymentAnalyticType,
  UserAnalyticType,
} from "@/types/analytic.type"
import {
  getAdminAnalytics,
  getAdminGraphsAnalytics,
  getAdminUserAnalytics,
  getCaregiverAnalytics,
  getPatientPaymentAnalytics,
  getUserAnalytics,
} from "@/services/analytic.service"

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const analyticKeys = {
  all: ["analytics"] as const,
  admin: ["admin-analytic"] as const,
  adminGraphs: (params?: AdminGraphsQueryParams) =>
    ["admin-graphs-analytic", params ?? {}] as const,
  adminUser: (userId: string) => ["admin-user-analytic", userId] as const,
  caregiver: ["caregiver-analytic"] as const,
  user: (userId: string) => ["user-analytic", userId] as const,
  patientPayments: (patientId: string) =>
    ["patient-payment-analytic", patientId] as const,
}

// Preserve legacy export name for backwards compatibility
export const planKeys = {
  admin: analyticKeys.admin,
  caregiver: analyticKeys.caregiver,
  user: ["user-analytic"] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useSuspenseGetAdminAnalytics = () => {
  return useSuspenseQuery<
    GeneralResponse<AdminAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.admin,
    queryFn: getAdminAnalytics,
  })
}

export const useGetAdminAnalytics = () => {
  return useQuery<
    GeneralResponse<AdminAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.admin,
    queryFn: getAdminAnalytics,
  })
}

export const useGetAdminGraphsAnalytics = (params?: AdminGraphsQueryParams) => {
  return useQuery<
    GeneralResponse<AdminGraphsAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.adminGraphs(params),
    queryFn: () => getAdminGraphsAnalytics(params),
    placeholderData: keepPreviousData,
  })
}

export const useSuspenseGetAdminGraphsAnalytics = (
  params?: AdminGraphsQueryParams
) => {
  return useSuspenseQuery<
    GeneralResponse<AdminGraphsAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.adminGraphs(params),
    queryFn: () => getAdminGraphsAnalytics(params),
  })
}

export const useGetAdminUserAnalytics = (userId: string, enabled = true) => {
  return useQuery<
    GeneralResponse<AdminUserAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.adminUser(userId),
    queryFn: () => getAdminUserAnalytics(userId),
    enabled: enabled && !!userId,
  })
}

export const useSuspenseGetCareGiverAnalytics = () => {
  return useSuspenseQuery<
    GeneralResponse<CaregiverAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.caregiver,
    queryFn: getCaregiverAnalytics,
  })
}

export const useGetCaregiverAnalytics = () => {
  return useQuery<
    GeneralResponse<CaregiverAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.caregiver,
    queryFn: getCaregiverAnalytics,
  })
}

export const useSuspenseGetUserAnalytics = (userId: string) => {
  return useSuspenseQuery<
    GeneralResponse<UserAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.user(userId),
    queryFn: () => getUserAnalytics(userId),
  })
}

export const useGetPatientPaymentAnalytics = (
  patientId: string,
  enabled = true
) => {
  return useQuery<
    GeneralResponse<PatientPaymentAnalyticType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: analyticKeys.patientPayments(patientId),
    queryFn: () => getPatientPaymentAnalytics(patientId),
    enabled: enabled && !!patientId,
  })
}
