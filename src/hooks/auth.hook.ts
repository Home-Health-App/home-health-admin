import { useMutation } from "@tanstack/react-query"
import {
  loginAdmin,
  verifyOtpAdmin,
  registerUser,
  LoginPayload,
  VerifyOtpPayload,
  RegisterPayload,
} from "@/services/auth.service"
import { GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"
import { AuthType } from "@/types/auth.type"

export const useLoginAdmin = () => {
  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse<any>>,
    LoginPayload
  >({
    mutationFn: loginAdmin,
    mutationKey: ["admin_login"],
  })

  return {
    isPending,
    mutate,
    mutateAsync,
    error,
    data,
  }
}

export const useVerifyOtpAdmin = () => {
  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse<AuthType>>,
    VerifyOtpPayload
  >({
    mutationFn: verifyOtpAdmin,
    mutationKey: ["admin_verify_otp"],
  })

  return {
    isPending,
    mutate,
    mutateAsync,
    error,
    data,
  }
}

export const useRegisterUser = () => {
  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    GeneralResponse<any>,
    AxiosError<GeneralResponse<any>>,
    RegisterPayload
  >({
    mutationFn: registerUser,
    mutationKey: ["user_register"],
  })

  return {
    isPending,
    mutate,
    mutateAsync,
    error,
    data,
  }
}
