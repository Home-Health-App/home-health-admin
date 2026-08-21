import { useMutation } from "@tanstack/react-query"
import { uploadFile, UploadResponse } from "@/services/upload.service"
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
