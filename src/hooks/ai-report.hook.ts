import {
  useQuery,
  useSuspenseQuery,
  useMutation,
} from "@tanstack/react-query"
import {
  getPatientAiReports,
  getAiReportById,
  downloadAiReport,
} from "@/services/ai-report.service"
import {
  AiHealthReport,
  GetAiReportsQueryParams,
} from "@/types/ai-report.type"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const aiReportKeys = {
  all: ["ai-reports"] as const,
  patient: (patientId: string, params?: GetAiReportsQueryParams) =>
    [...aiReportKeys.all, "patient", patientId, params || {}] as const,
  detail: (reportId: string) =>
    [...aiReportKeys.all, "detail", reportId] as const,
}

export const useGetPatientAiReports = (
  patientId: string,
  params?: GetAiReportsQueryParams,
  enabled = true
) => {
  return useQuery<
    PaginatedResponse<AiHealthReport[]>,
    AxiosError<GeneralResponse>
  >({
    queryKey: aiReportKeys.patient(patientId, params),
    queryFn: () => getPatientAiReports(patientId, params),
    enabled: enabled && !!patientId,
  })
}

export const useSuspenseGetPatientAiReports = (
  patientId: string,
  params?: GetAiReportsQueryParams
) => {
  return useSuspenseQuery<PaginatedResponse<AiHealthReport[]>>({
    queryKey: aiReportKeys.patient(patientId, params),
    queryFn: () => getPatientAiReports(patientId, params),
  })
}

export const useGetAiReportById = (reportId: string, enabled = true) => {
  return useQuery<GeneralResponse<AiHealthReport>, AxiosError<GeneralResponse>>({
    queryKey: aiReportKeys.detail(reportId),
    queryFn: () => getAiReportById(reportId),
    enabled: enabled && !!reportId,
  })
}

export const useDownloadAiReport = () => {
  return useMutation<
    Blob,
    AxiosError<GeneralResponse>,
    { reportId: string; filename?: string }
  >({
    mutationFn: ({ reportId }) => downloadAiReport(reportId),
    mutationKey: ["download_ai_report"],
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = variables.filename || `ai_report_${variables.reportId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("AI Health Report downloaded successfully!")
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to download report PDF."
      toast.error(msg)
    },
  })
}
