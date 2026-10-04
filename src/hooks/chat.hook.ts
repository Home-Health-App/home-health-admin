import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAdminChat } from "@/services/chat.service"
import { CreateAdminChatPayload, AdminChatData } from "@/types/chat.type"
import { GeneralResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const chatKeys = {
  all: ["chat"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
}

export const useCreateAdminChat = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<AdminChatData>,
    AxiosError<GeneralResponse>,
    CreateAdminChatPayload
  >({
    mutationFn: createAdminChat,
    mutationKey: ["create_admin_chat"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
    },
  })
}
