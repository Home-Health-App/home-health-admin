import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAdminChats,
  getChatMessages,
  sendAdminMessage,
  createAdminChat,
  markAdminChatAsRead,
} from "@/services/chat.service"
import {
  CreateAdminChatPayload,
  AdminChatData,
  ChatMessageData,
  SendAdminMessagePayload,
  GetAdminChatsQueryParams,
  GetChatMessagesQueryParams,
} from "@/types/chat.type"
import { GeneralResponse, PaginatedResponse } from "@/types/response.type"
import { AxiosError } from "axios"

export const chatKeys = {
  all: ["chat"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: (params?: GetAdminChatsQueryParams) =>
    [...chatKeys.lists(), params || {}] as const,
  messagesAll: () => [...chatKeys.all, "messages"] as const,
  messages: (chatId: string, params?: GetChatMessagesQueryParams) =>
    [...chatKeys.messagesAll(), chatId, params || {}] as const,
}

export const useGetAdminChats = (
  params?: GetAdminChatsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery<PaginatedResponse<AdminChatData[]>, AxiosError<GeneralResponse>>({
    queryKey: chatKeys.list(params),
    queryFn: () => getAdminChats(params),
    enabled: options?.enabled ?? true,
  })
}

export const useGetChatMessages = (
  chatId?: string,
  params?: GetChatMessagesQueryParams,
  options?: { enabled?: boolean; refetchInterval?: number | false }
) => {
  return useQuery<PaginatedResponse<ChatMessageData[]>, AxiosError<GeneralResponse>>({
    queryKey: chatKeys.messages(chatId || "", params),
    queryFn: () => getChatMessages(chatId || "", params),
    enabled: (options?.enabled ?? true) && !!chatId,
    refetchInterval: options?.refetchInterval,
  })
}

export const useSendAdminMessage = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<ChatMessageData>,
    AxiosError<GeneralResponse>,
    SendAdminMessagePayload
  >({
    mutationFn: sendAdminMessage,
    mutationKey: ["send_admin_message"],
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chat_id),
      })
      queryClient.invalidateQueries({
        queryKey: chatKeys.lists(),
      })
    },
  })
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

export const useMarkAdminChatAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation<
    GeneralResponse<{ chat_id: string; updated_count: number; read_at: string }>,
    AxiosError<GeneralResponse>,
    string
  >({
    mutationFn: markAdminChatAsRead,
    mutationKey: ["mark_admin_chat_read"],
    onSuccess: (_data, chatId) => {
      queryClient.setQueriesData<PaginatedResponse<AdminChatData[]>>(
        { queryKey: chatKeys.lists() },
        (old) => {
          if (!old?.data) return old
          return {
            ...old,
            data: old.data.map((chat) =>
              chat.id === chatId ? { ...chat, unread_count: 0 } : chat
            ),
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() })
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatId) })
    },
  })
}
