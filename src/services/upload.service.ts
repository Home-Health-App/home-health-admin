import { api } from "./httpservice"
import { GeneralResponse } from "@/types/response.type"

export interface UploadData {
  url: string
  filename: string
  mimetype: string
  size: number
}

export type UploadResponse = GeneralResponse<UploadData>

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  return api.post<UploadResponse>("upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
