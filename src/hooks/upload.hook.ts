import { useMutation } from "@tanstack/react-query"
import {
  uploadFile,
  uploadMultipleFiles,
  UploadResponse,
  MultipleUploadResponse,
} from "@/services/upload.service"
import { AxiosError } from "axios"
import { GeneralResponse } from "@/types/response.type"

export const useUploadFile = () => {
  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    UploadResponse,
    AxiosError<GeneralResponse<any>>,
    File
  >({
    mutationFn: uploadFile,
    mutationKey: ["file_upload"],
  })

  return {
    isPending,
    mutate,
    mutateAsync,
    error,
    data,
  }
}

export const useUploadMultipleFiles = () => {
  const { isPending, mutate, mutateAsync, error, data } = useMutation<
    MultipleUploadResponse,
    AxiosError<GeneralResponse<any>>,
    File[] | FileList
  >({
    mutationFn: uploadMultipleFiles,
    mutationKey: ["multiple_files_upload"],
  })

  return {
    isPending,
    mutate,
    mutateAsync,
    error,
    data,
  }
}

