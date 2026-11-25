"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Socket from "@/libs/socket"
import { ChatMessageData, SocketSendMessagePayload, SocketMessageAck } from "@/types/chat.type"
import { useQueryClient } from "@tanstack/react-query"
import { chatKeys } from "@/hooks/chat.hook"

interface UseChatSocketOptions {
  chatId?: string | null
  senderId?: string | null
  isAdmin?: boolean
  onNewMessage?: (message: ChatMessageData) => void
}

export function useChatSocket({
  chatId,
  senderId,
  isAdmin = true,
  onNewMessage,
}: UseChatSocketOptions) {
  const [isConnected, setIsConnected] = useState(Socket.connected)
  const queryClient = useQueryClient()
  const onNewMessageRef = useRef(onNewMessage)
  onNewMessageRef.current = onNewMessage

  // Keep track of active chatId to handle room events cleanly
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true)
      if (chatId) {
        Socket.emit("join_chat", { chat_id: chatId })
      }
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    Socket.on("connect", handleConnect)
    Socket.on("disconnect", handleDisconnect)

    // Sync initial state
    setIsConnected(Socket.connected)

    if (chatId && Socket.connected) {
      Socket.emit("join_chat", { chat_id: chatId })
    }

    return () => {
      Socket.off("connect", handleConnect)
      Socket.off("disconnect", handleDisconnect)
      if (chatId) {
        Socket.emit("leave_chat", { chat_id: chatId })
      }
    }
  }, [chatId])

  // Listen for new incoming messages across the socket
  useEffect(() => {
    const handleNewMessage = (newMessage: ChatMessageData) => {
      // Invalidate conversation list so last message / timestamp updates live
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() })

      // If message is for the active room
      if (chatId && newMessage.chat_id === chatId) {
        // Also update message cache
        queryClient.setQueryData(
          chatKeys.messages(chatId, { limit: 100 }),
          (old: any) => {
            if (!old || !old.data) return old
            const exists = old.data.some((m: ChatMessageData) => m.id === newMessage.id)
            if (exists) return old
            return {
              ...old,
              data: [...old.data, newMessage],
            }
          }
        )

        onNewMessageRef.current?.(newMessage)
      }
    }

    const handleMessagesRead = (payload: { chat_id?: string }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() })
      if (payload?.chat_id) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.messages(payload.chat_id),
        })
      }
    }

    Socket.on("new_message", handleNewMessage)
    Socket.on("messages_read", handleMessagesRead)

    return () => {
      Socket.off("new_message", handleNewMessage)
      Socket.off("messages_read", handleMessagesRead)
    }
  }, [chatId, queryClient])

  const markAsRead = useCallback(
    (targetChatId?: string | null) => {
      const id = targetChatId || chatId
      if (!id) return
      if (!Socket.connected) {
        Socket.connect()
      }
      Socket.emit("mark_as_read", {
        chat_id: id,
        is_admin: isAdmin,
        reader_id: senderId || undefined,
      })
    },
    [chatId, isAdmin, senderId]
  )

  // Send message via WebSocket
  const sendSocketMessage = useCallback(
    async (
      text?: string,
      files: string[] = []
    ): Promise<SocketMessageAck> => {
      if (!chatId) {
        return { success: false, message: "No active conversation selected" }
      }

      if (!senderId) {
        return { success: false, message: "Sender ID is missing" }
      }

      const payload: SocketSendMessagePayload = {
        chat_id: chatId,
        message: text || "",
        files,
        sender_id: senderId,
        is_admin: isAdmin,
      }

      return new Promise((resolve) => {
        if (!Socket.connected) {
          Socket.connect()
        }

        Socket.emit("send_message", payload, (response: any) => {
          if (response?.success && response.data) {
            // Also ensure active room receives the message in cache
            queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatId) })
            queryClient.invalidateQueries({ queryKey: chatKeys.lists() })
            resolve({
              success: true,
              data: response.data,
            })
          } else {
            resolve({
              success: response?.success ?? false,
              message: response?.message || "Failed to send message",
            })
          }
        })
      })
    },
    [chatId, senderId, isAdmin, queryClient]
  )

  return {
    isConnected,
    sendMessage: sendSocketMessage,
    markAsRead,
    socket: Socket,
  }
}
export default useChatSocket
