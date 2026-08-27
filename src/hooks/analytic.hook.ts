import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { GeneralResponse } from "@/types/response.type"
import { PlanType, CreatePlanType, UpdatePlanType } from "@/types/billing.type"
import { AxiosError } from "axios"
import { AdminAnalyticType, CaregiverAnalyticType, UserAnalyticType } from "@/types/analytic.type"
import { getAdminAnalytics, getCaregiverAnalytics, getUserAnalytics } from "@/services/analytic.service"

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const planKeys = {
    admin: ["admin-analytic"] as const,
    caregiver: ["caregiver-analytic"] as const,
    user: ["user-analytic"] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useSuspenseGetAdminAnalytics = () => {
    return useSuspenseQuery<
        GeneralResponse<AdminAnalyticType>,
        AxiosError<GeneralResponse>
    >({
        queryKey: planKeys.admin,
        queryFn: getAdminAnalytics,
    })
}



export const useSuspenseGetCareGiverAnalytics = () => {
    return useSuspenseQuery<
        GeneralResponse<CaregiverAnalyticType>,
        AxiosError<GeneralResponse>
    >({
        queryKey: planKeys.admin,
        queryFn: getCaregiverAnalytics,
    })
}

export const useSuspenseGetUserAnalytics = (userId: string) => {
    return useSuspenseQuery<
        GeneralResponse<UserAnalyticType>,
        AxiosError<GeneralResponse>
    >({
        queryKey: planKeys.admin,
        queryFn: () => getUserAnalytics(userId),
    })
}



