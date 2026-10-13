import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanCategories,
  getPlanTiers,
  getAdminPayments,
  getPaymentByPatientId,
  createPaymentLink,
  getPaymentById,
  GetAllPlansParams,
} from "@/services/billing.service"
import { GeneralResponse } from "@/types/response.type"
import {
  PlanType,
  CreatePlanType,
  UpdatePlanType,
  AdminPaymentItem,
} from "@/types/billing.type"
import {
  CreatePaymentLinkPayload,
  PaymentLinkResponseData,
} from "@/types/billing-link.type"
import { AxiosError } from "axios"

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  list: (params?: GetAllPlansParams) => [...planKeys.lists(), params] as const,
  details: () => [...planKeys.all, "detail"] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
  categories: () => [...planKeys.all, "categories"] as const,
  tiers: () => [...planKeys.all, "tiers"] as const,
}

// ─── Plan Queries ────────────────────────────────────────────────────────────

export const useGetAllPlans = (params?: GetAllPlansParams) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<PlanType[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: planKeys.list(params),
    queryFn: () => getAllPlans(params),
  })

  return { isPending, data, error, refetch }
}

export const useGetPlanById = (id: string) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<PlanType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: planKeys.detail(id),
    queryFn: () => getPlanById(id),
    enabled: !!id,
  })

  return { isPending, data, error, refetch }
}

export const useGetPlanCategories = () => {
  const { isPending, data, error } = useQuery<
    GeneralResponse<string[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: planKeys.categories(),
    queryFn: getPlanCategories,
  })

  return { isPending, data, error }
}

export const useGetPlanTiers = () => {
  const { isPending, data, error } = useQuery<
    GeneralResponse<string[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: planKeys.tiers(),
    queryFn: getPlanTiers,
  })

  return { isPending, data, error }
}

// ─── Plan Mutations ──────────────────────────────────────────────────────────

export const useCreatePlan = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<PlanType>,
    AxiosError<GeneralResponse>,
    CreatePlanType
  >({
    mutationFn: createPlan,
    mutationKey: ["create_plan"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}

export const useUpdatePlan = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<PlanType>,
    AxiosError<GeneralResponse>,
    { id: string; payload: UpdatePlanType }
  >({
    mutationFn: ({ id, payload }) => updatePlan(id, payload),
    mutationKey: ["update_plan"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() })
      queryClient.invalidateQueries({ queryKey: planKeys.detail(variables.id) })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}

export const useDeletePlan = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<null>,
    AxiosError<GeneralResponse>,
    string
  >({
    mutationFn: deletePlan,
    mutationKey: ["delete_plan"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}

// ─── Payment Hooks ──────────────────────────────────────────────────────────

export const useGetAdminPayments = () => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<AdminPaymentItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: ["payments", "admin"],
    queryFn: getAdminPayments,
  })

  return { isPending, data, error, refetch }
}

export const useGetPaymentByPatientId = (patientId: string) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<AdminPaymentItem>,
    AxiosError<GeneralResponse>
  >({
    queryKey: ["payments", "patient", patientId],
    queryFn: () => getPaymentByPatientId(patientId),
    enabled: !!patientId,
  })

  return { isPending, data, error, refetch }
}

export const useCreatePaymentLink = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<PaymentLinkResponseData>,
    AxiosError<GeneralResponse>,
    CreatePaymentLinkPayload
  >({
    mutationFn: createPaymentLink,
    mutationKey: ["create_payment_link"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    },
  })
}

export const useGetPaymentById = (id: string) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<PaymentLinkResponseData>,
    AxiosError<GeneralResponse>
  >({
    queryKey: ["payment-link", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  })

  return { isPending, data, error, refetch }
}
