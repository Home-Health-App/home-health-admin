import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import {
  getAdminPatients,
  getPatientById,
  createPatient,
  updatePatient,
  suspendPatient,
  assignPatient,
  unassignPatient,
  getPatientDailyLogs,
  getDailyLogById,
} from "@/services/patient.service"
import {
  PatientType,
  GetPatientsQueryParams,
  CreatePatientPayload,
  UpdatePatientPayload,
  SuspendPatientPayload,
  AssignPatientPayload,
  UnassignPatientPayload,
} from "@/types/patient.type"
import {
  DailyLogType,
  GetDailyLogsQueryParams,
} from "@/types/daily-log.type"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params?: GetPatientsQueryParams) =>
    [...patientKeys.lists(), params || {}] as const,
  details: () => [...patientKeys.all, "detail"] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
}

export const useGetAdminPatients = (params?: GetPatientsQueryParams) => {
  return useQuery<
    PaginatedResponse<PatientType[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: patientKeys.list(params),
    queryFn: () => getAdminPatients(params),
  })
}

export const useSuspenseGetAdminPatients = (
  params?: GetPatientsQueryParams
) => {
  return useSuspenseQuery<PaginatedResponse<PatientType[]>>({
    queryKey: patientKeys.list(params),
    queryFn: () => getAdminPatients(params),
  })
}

export const useGetPatientById = (id: string, enabled = true) => {
  return useQuery<GeneralResponse<PatientType>, AxiosError<GeneralResponse>>({
    queryKey: patientKeys.detail(id),
    queryFn: () => getPatientById(id),
    enabled: enabled && !!id,
  })
}

export const useSuspenseGetPatientById = (id: string) => {
  return useSuspenseQuery<GeneralResponse<PatientType>>({
    queryKey: patientKeys.detail(id),
    queryFn: () => getPatientById(id),
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<PatientType>,
    AxiosError<GeneralResponse>,
    CreatePatientPayload
  >({
    mutationFn: (payload) => createPatient(payload),
    mutationKey: ["create_patient"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export const useUpdatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<PatientType>,
    AxiosError<GeneralResponse>,
    { id: string; payload: UpdatePatientPayload }
  >({
    mutationFn: ({ id, payload }) => updatePatient(id, payload),
    mutationKey: ["update_patient"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      })
    },
  })
}

export const useSuspendPatient = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    { id: string; payload: SuspendPatientPayload }
  >({
    mutationFn: ({ id, payload }) => suspendPatient(id, payload),
    mutationKey: ["suspend_patient"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      })
    },
  })
}

export const useAssignPatient = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    AssignPatientPayload
  >({
    mutationFn: (payload) => assignPatient(payload),
    mutationKey: ["assign_patient"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.patient_id),
      })
    },
  })
}

export const useUnassignPatient = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse>,
    UnassignPatientPayload
  >({
    mutationFn: (payload) => unassignPatient(payload),
    mutationKey: ["unassign_patient"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.patient_id),
      })
    },
  })
}

export const useGetPatientDailyLogs = (
  patientId: string,
  params?: GetDailyLogsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    PaginatedResponse<DailyLogType[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: [...patientKeys.detail(patientId), "daily-logs", params || {}],
    queryFn: () => getPatientDailyLogs(patientId, params),
    enabled: (options?.enabled ?? true) && !!patientId,
  })
}

export const useSuspenseGetPatientDailyLogs = (
  patientId: string,
  params?: GetDailyLogsQueryParams
) => {
  return useSuspenseQuery<PaginatedResponse<DailyLogType[]>>({
    queryKey: [...patientKeys.detail(patientId), "daily-logs", params || {}],
    queryFn: () => getPatientDailyLogs(patientId, params),
  })
}

export const useGetDailyLogById = (
  logId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<
    GeneralResponse<DailyLogType>,
    AxiosError<GeneralResponse>
  >({
    queryKey: ["daily-log", logId],
    queryFn: () => getDailyLogById(logId),
    enabled: (options?.enabled ?? true) && !!logId,
  })
}

export const useSuspenseGetDailyLogById = (logId: string) => {
  return useSuspenseQuery<GeneralResponse<DailyLogType>>({
    queryKey: ["daily-log", logId],
    queryFn: () => getDailyLogById(logId),
  })
}
