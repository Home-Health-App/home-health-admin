import { api } from "./httpservice"
import { URLs } from "@/libs/urls"
import { GeneralResponse } from "@/types/response.type"
import { AuthType } from "@/types/auth.type"

export interface LoginPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  code: string
}

export interface LoginResponse {
  message: string
}

export type VerifyOtpResponse = AuthType

export const loginAdmin = async (payload: LoginPayload): Promise<GeneralResponse<LoginResponse>> => {
  return api.post<GeneralResponse<LoginResponse>>(URLs.auth["admin-auth-login"], payload)
}

export const verifyOtpAdmin = async (payload: VerifyOtpPayload): Promise<GeneralResponse<VerifyOtpResponse>> => {
  return api.post<GeneralResponse<VerifyOtpResponse>>(URLs.auth["admin-auth-verify-otp"], payload)
}
