import { api } from "./httpservice"
import httpService from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import { AiHealthReport, GetAiReportsQueryParams } from "@/types/ai-report.type"

export const getPatientAiReports = async (
  patientId: string,
  params?: GetAiReportsQueryParams
): Promise<PaginatedResponse<AiHealthReport[]>> => {
  return api.get<PaginatedResponse<AiHealthReport[]>>(
    URLs.aiReport["get-patient-reports"](patientId),
    { params }
  )
}

export const getAiReportById = async (
  reportId: string
): Promise<GeneralResponse<AiHealthReport>> => {
  return api.get<GeneralResponse<AiHealthReport>>(
    URLs.aiReport["get-report-by-id"](reportId)
  )
}

export const downloadAiReport = async (reportId: string): Promise<Blob> => {
  const response = await httpService.get(URLs.aiReport["download-report"](reportId), {
    responseType: "blob",
  })
  return response.data
}
