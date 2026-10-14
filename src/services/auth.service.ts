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

export interface RegisterPayload {
  invitation_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  state: string
  address: string
  gender: "MALE" | "FEMALE" | string
  date_of_birth: string
  certification?: string | string[]
  profile_picture?: string
}

export const registerUser = async (payload: RegisterPayload): Promise<GeneralResponse<any>> => {
  return api.post<GeneralResponse<any>>(URLs.auth.register, payload)
}
