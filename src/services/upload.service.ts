import { api } from "./httpservice"
import { GeneralResponse } from "@/types/response.type"
import { URLs } from "@/libs/urls"

export interface UploadFileData {
  url: string
  filename: string
  mimetype: string
  size: number
}

// Single file upload response
export type SingleUploadResponse = GeneralResponse<UploadFileData>
export type UploadResponse = SingleUploadResponse

// Multiple files upload response
export type MultipleUploadResponse = GeneralResponse<UploadFileData[]>
export type UploadMultipleResponse = MultipleUploadResponse

// Alias for backwards compatibility
export type UploadData = UploadFileData

export const uploadFile = async (file: File): Promise<SingleUploadResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  return api.post<SingleUploadResponse>(URLs.upload.single, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const uploadMultipleFiles = async (
  files: File[] | FileList
): Promise<MultipleUploadResponse> => {
  const formData = new FormData()
  const fileArray = Array.from(files)
  fileArray.forEach((file) => {
    formData.append("files", file)
  })

  return api.post<MultipleUploadResponse>(URLs.upload.multiple, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

