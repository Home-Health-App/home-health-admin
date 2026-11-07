import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanCategories,
  getPlanTiers,
  GetAllPlansParams,
  getAdminPayments,
  getPaymentByPatientId,
  createPaymentLink,
  getPaymentById,
  verifyPaymentLink,
} from "@/services/billing.service"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import {
  PlanType,
  CreatePlanType,
  UpdatePlanType,
  AdminPaymentItem,
  GetAdminPaymentsParams,
} from "@/types/billing.type"
import { CreatePaymentLinkPayload, PaymentLinkResponseData } from "@/types/billing-link.type"
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

export const paymentKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentKeys.all, "list"] as const,
  list: (params?: GetAdminPaymentsParams) => [...paymentKeys.lists(), params] as const,
  patient: (patientId: string) => [...paymentKeys.all, "patient", patientId] as const,
  detail: (id: string) => [...paymentKeys.all, "detail", id] as const,
}

// ─── Queries ─────────────────────────────────────────────────────────────────

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

export const useGetAdminPayments = (params?: GetAdminPaymentsParams) => {
  const { isPending, data, error, refetch } = useQuery<
    PaginatedResponse<AdminPaymentItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: paymentKeys.list(params),
    queryFn: () => getAdminPayments(params),
  })

  return { isPending, data, error, refetch }
}

export const useGetPaymentByPatientId = (patientId: string) => {
  const { isPending, data, error, refetch } = useQuery<
    PaginatedResponse<AdminPaymentItem[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: paymentKeys.patient(patientId),
    queryFn: () => getPaymentByPatientId(patientId),
    enabled: !!patientId,
  })

  return { isPending, data, error, refetch }
}

export const useGetPaymentById = (paymentId: string) => {
  const { isPending, data, error, refetch } = useQuery<
    GeneralResponse<PaymentLinkResponseData>,
    AxiosError<GeneralResponse>
  >({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: !!paymentId,
  })

  return { isPending, data, error, refetch }
}

// ─── Mutations ───────────────────────────────────────────────────────────────


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

export const useCreatePaymentLink = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    CreatePaymentLinkPayload
  >({
    mutationFn: createPaymentLink,
    mutationKey: ["create_payment_link"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}

export const useVerifyPaymentLink = () => {
  const queryClient = useQueryClient()

  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<PaymentLinkResponseData>,
    AxiosError<GeneralResponse>,
    { paymentRecordId: string}
  >({
    mutationFn: ({ paymentRecordId }) =>
      verifyPaymentLink(paymentRecordId),
    mutationKey: ["verify_payment_link"],
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: paymentKeys.all
      })
    },
  })

  return { isPending, mutate, mutateAsync, error, data }
}

export const useVerifyPayment = useVerifyPaymentLink

