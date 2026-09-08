import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { PaginatedResponse, GeneralResponse } from "@/types/response.type"
import {
  PatientType,
  GetPatientsQueryParams,
  UpdatePatientPayload,
  SuspendPatientPayload,
  AssignPatientPayload,
  UnassignPatientPayload,
} from "@/types/patient.type"

export const getAdminPatients = async (
  params?: GetPatientsQueryParams
): Promise<PaginatedResponse<PatientType[]>> => {
  return api.get<PaginatedResponse<PatientType[]>>(
    URLs.patient["get-patients-admin"],
    { params }
  )
}

export const getPatientById = async (
  id: string
): Promise<GeneralResponse<PatientType>> => {
  return api.get<GeneralResponse<PatientType>>(
    URLs.patient["get-patient-by-id"](id)
  )
}

export const updatePatient = async (
  id: string,
  payload: UpdatePatientPayload
): Promise<GeneralResponse<PatientType>> => {
  return api.put<GeneralResponse<PatientType>>(
    URLs.patient["update-patient"](id),
    payload
  )
}

export const suspendPatient = async (
  id: string,
  payload: SuspendPatientPayload
): Promise<GeneralResponse<any>> => {
  return api.patch<GeneralResponse<any>>(
    URLs.patient["suspend-patient"](id),
    payload
  )
}

export const assignPatient = async (
  payload: AssignPatientPayload
): Promise<GeneralResponse<any>> => {
  return api.post<GeneralResponse<any>>(
    URLs.patient["assign-patient"],
    payload
  )
}

export const unassignPatient = async (
  payload: UnassignPatientPayload
): Promise<GeneralResponse<any>> => {
  return api.post<GeneralResponse<any>>(
    URLs.patient["unassign-patient"],
    payload
  )
}
