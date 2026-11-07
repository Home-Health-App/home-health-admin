"use client"

import React, { useMemo, useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  IconDots,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconMessageOff,
  IconFileText,
  IconDownload,
  IconX,
  IconLoader2,
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StartChatModal from "@/components/modal/start-chat-modal"
import {
  useGetAdminChats,
  useGetChatMessages,
  useSendAdminMessage,
} from "@/hooks/chat.hook"
import { formatNotificationTime } from "@/libs/helper"
import { format } from "date-fns"
import { toast } from "sonner"
import { useAtomValue } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { useChatSocket } from "@/hooks/use-chat-socket"
import {
  uploadMultipleFiles,
  uploadFile,
  extractUploadedUrls,
} from "@/services/upload.service"
import { cn } from "@/libs/utils"

interface StagedAttachment {
  id: string
  file: File
  previewUrl?: string
  isImage: boolean
}

const getMessageFiles = (files: any): string[] => {
  if (!files) return []
  if (Array.isArray(files)) {
    return files
      .map((f) => (typeof f === "string" ? f : f?.url || f?.location))
      .filter((url): url is string => typeof url === "string" && url.length > 0)
  }
  if (typeof files === "string") {
    try {
      const parsed = JSON.parse(files)
      if (Array.isArray(parsed)) {
        return parsed
          .map((f) => (typeof f === "string" ? f : f?.url || f?.location))
          .filter((url): url is string => typeof url === "string" && url.length > 0)
      }
    } catch {
      return [files]
    }
  }
  return []
}

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get("chatId")

  const auth = useAtomValue(authAtom)
  const admin = (auth as any)?.admin || (auth as any)?.user || auth
  const adminId = admin?.id

  const [isStartChatOpen, setIsStartChatOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"read" | "unread">("read")
  const [newMessageText, setNewMessageText] = useState("")
  const [stagedAttachments, setStagedAttachments] = useState<StagedAttachment[]>([])
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)

  const stagedAttachmentsRef = useRef<StagedAttachment[]>([])
  stagedAttachmentsRef.current = stagedAttachments

  // Revoke preview URLs on unmount
  useEffect(() => {
    return () => {
      stagedAttachmentsRef.current.forEach((att) => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl)
      })
    }
  }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch all chats for admin
  const { data: chatsResponse } = useGetAdminChats({
    limit: 50,
  })
  const chats = chatsResponse?.data || []

  // Determine selected chat
  const selectedChatId = useMemo(() => {
    if (currentChatId) return currentChatId
    if (chats.length > 0) return chats[0].id
    return null
  }, [currentChatId, chats])

  const selectedChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId) || null
  }, [chats, selectedChatId])

  // Real-time Socket.IO connection
  const { isConnected, sendMessage: sendSocketMessage } = useChatSocket({
    chatId: selectedChatId,
    senderId: adminId,
    isAdmin: true,
  })

  // Fetch messages for selected chat (Socket updates live, polling reduced/disabled when live)
  const { data: messagesResponse } = useGetChatMessages(
    selectedChatId || "",
    { limit: 100 },
    { enabled: !!selectedChatId, refetchInterval: isConnected ? false : 8000 }
  )
  const messages = messagesResponse?.data || []

  // Sort messages chronologically
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }, [messages])

  // Filter conversations
  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      const rec = c.receiver || c.reciever
      const fullName = `${rec?.first_name || ""} ${rec?.last_name || ""}`.toLowerCase()
      const email = (rec?.email || "").toLowerCase()
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase())
      return matchesSearch
    })
  }, [chats, search])

  // REST fallback mutation
  const { mutate: sendRestMessage, isPending: isRestSending } = useSendAdminMessage()
  const isSending = isRestSending || isUploadingFiles

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, selectedChatId])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incomingFiles = Array.from(e.target.files)
      if (stagedAttachments.length + incomingFiles.length > 10) {
        toast.error("You can attach up to 10 files per message.")
        e.target.value = ""
        return
      }

      const newAttachments: StagedAttachment[] = []
      for (const file of incomingFiles) {
        if (file.size > 15 * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds the 15MB file size limit.`)
          continue
        }
        const isImage = file.type.startsWith("image/")
        const previewUrl = isImage ? URL.createObjectURL(file) : undefined
        newAttachments.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl,
          isImage,
        })
      }

      setStagedAttachments((prev) => [...prev, ...newAttachments])
      e.target.value = ""
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setStagedAttachments((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const handleSendMessage = async () => {
    if (
      (!newMessageText.trim() && stagedAttachments.length === 0) ||
      !selectedChatId ||
      isSending
    ) {
      return
    }

    const textToSend = newMessageText.trim()
    const attachmentsToSend = [...stagedAttachments]

    setNewMessageText("")
    setStagedAttachments([])

    let uploadedUrls: string[] = []

    if (attachmentsToSend.length > 0) {
      setIsUploadingFiles(true)
      try {
        const filesOnly = attachmentsToSend.map((a) => a.file)
        if (filesOnly.length === 1) {
          const res = await uploadFile(filesOnly[0])
          uploadedUrls = extractUploadedUrls(res)
        } else {
          const res = await uploadMultipleFiles(filesOnly)
          uploadedUrls = extractUploadedUrls(res)
        }

        if (uploadedUrls.length === 0) {
          toast.error("Failed to upload attachments. Please try again.")
          setStagedAttachments(attachmentsToSend)
          setNewMessageText(textToSend)
          setIsUploadingFiles(false)
          return
        }
      } catch (err: any) {
        console.error("File upload failed:", err)
        toast.error("Failed to upload attachments.")
        setStagedAttachments(attachmentsToSend)
        setNewMessageText(textToSend)
        setIsUploadingFiles(false)
        return
      } finally {
        setIsUploadingFiles(false)
      }

      // Cleanup preview object URLs on successful upload
      attachmentsToSend.forEach((att) => {
        if (att.previewUrl) URL.revokeObjectURL(att.previewUrl)
      })
    }

    // Attempt sending via real-time WebSocket first
    const socketRes = await sendSocketMessage(textToSend, uploadedUrls)

    // If WebSocket send fails or was not acknowledged, fallback to REST API
    if (!socketRes.success) {
      sendRestMessage(
        {
          chat_id: selectedChatId,
          message: textToSend || undefined,
          files: uploadedUrls,
        },
        {
          onError: () => {
            toast.error("Failed to send message")
            setNewMessageText(textToSend)
          },
        }
      )
    }
  }

  const handleSelectChat = (chatId: string) => {
    router.push(`/dashboard/messages?chatId=${chatId}`)
  }

  // Active receiver info
  const activeReceiver = selectedChat?.receiver || selectedChat?.reciever
  const isCaregiver =
    activeReceiver?.type === "CARE_GIVER" || selectedChat?.type === "CARE_GIVER"
  const activeReceiverName = activeReceiver
    ? `${activeReceiver.first_name || ""} ${activeReceiver.last_name || ""}`.trim() ||
      activeReceiver.email
    : selectedChat?.admin_creator
    ? `${selectedChat.admin_creator.first_name || ""} ${selectedChat.admin_creator.last_name || ""}`.trim()
    : "Conversation"

  const activeReceiverType = isCaregiver ? "Caregiver" : null

  const formatMessageDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      const now = new Date()
      if (d.toDateString() === now.toDateString()) {
        return `Today, ${format(d, "MMMM d")}`
      }
      return format(d, "EEEE, MMMM d")
    } catch {
      return dateStr
    }
  }

  const formatMessageTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "hh:mm a")
    } catch {
      return ""
    }
  }

  return (
    <main className="flex h-[calc(100vh-9.5rem)] w-full flex-1 p-0 pb-10 select-none">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[8px]">
        {/* Workspace Columns */}
        <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)]">

          {/* LEFT PANEL — Conversations Sidebar */}
          <aside className="flex min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between px-6 py-6">
              <div>
                <h1 className="font-dm-san-regular text-4xl font-semibold text-body-text">
                  Inbox
                </h1>
              </div>

              <Button
                onClick={() => setIsStartChatOpen(true)}
                className="flex h-9.5 items-center gap-1.5 rounded-full bg-primary-color hover:bg-primary-color/90 px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden"
              >
                <IconPlus className="size-4" />
                New Message
              </Button>
            </div>
            {/* Search Input bar */}
            <div className="px-5">
              <div className="relative">
                <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Patients"
                  className="h-10.5 w-full rounded-full border border-zinc-200 bg-white pl-10 pr-4 font-dm-san-regular text-sm font-normal text-body-text shadow-none placeholder:text-zinc-400 focus-visible:border-zinc-300 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Read / Unread Tabs */}
            <div className="px-5 pt-4 pb-3">
              <Tabs
                defaultValue="read"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as "read" | "unread")}
                className="w-auto font-dm-san-regular text-sm font-normal"
              >
                <TabsList className="bg-white p-1 h-9 rounded-lg border-none flex w-fit gap-1">
                  <TabsTrigger
                    value="read"
                    className="rounded-md px-4 py-1.5 text-xs font-normal font-dm-san-regular transition-all data-active:bg-secondary-color data-active:text-white text-body-text data-active:hover:text-body-text shadow-none bg-transparent cursor-pointer"
                  >
                    Read
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="rounded-md px-4 py-1.5 text-xs font-normal font-dm-san-regular transition-all data-active:bg-secondary-color data-active:text-white text-body-text data-active:hover:text-body-text shadow-none bg-transparent cursor-pointer"
                  >
                    Unread (0)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable List */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {filteredChats.map((c) => {
                const isSelected = selectedChatId === c.id
                const rec = c.receiver || c.reciever
                const name =
                  `${rec?.first_name || ""} ${rec?.last_name || ""}`.trim() ||
                  rec?.email
                const isCaregiverItem =
                  rec?.type === "CARE_GIVER" || c.type === "CARE_GIVER"
                // const typeLabel = isCaregiverItem ? "Caregiver" : null
                const timeDisplay = formatNotificationTime(
                  c.updated_at || c.created_at
                )

                // Compute last message snippet
                let snippet = rec?.email || "No messages yet"
                const lastMsg = c.last_message || (c.messages && c.messages[c.messages.length - 1])
                if (lastMsg) {
                  if (lastMsg.message && lastMsg.message.trim().length > 0) {
                    snippet = lastMsg.message
                  } else {
                    const lmFiles = getMessageFiles(lastMsg.files)
                    if (lmFiles.length > 0) {
                      const hasImage = lmFiles.some((f) => /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(f))
                      snippet = hasImage ? "📷 Photo" : "📎 Attachment"
                    }
                  }
                }

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectChat(c.id)}
                    className={`w-full text-left p-4 rounded-[8px] border transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-l-2 border-l-secondary-color border-border-light bg-white shadow-2xs"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-dm-san-regular text-sm font-semibold text-body-text">
                            {name}
                          </span>
                          {/* {typeLabel && (
                            <span className="shrink-0 rounded-full border border-secondary-color bg-secondary-light px-2 py-0.5 text-3xs font-medium font-dm-san-regular text-primary-color select-none">
                              {typeLabel}
                            </span>
                          )} */}
                        </div>
                        <p className="mt-2.5 truncate font-dm-san-regular text-xs font-normal text-body-text">
                          {snippet}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 self-start pt-0.5">
                        <span className="text-[10px] font-dm-san-regular text-zinc-400 font-normal">
                          {timeDisplay}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {filteredChats.length === 0 && (
                <div className="text-center py-10 font-dm-san-regular">
                  <p className="text-sm font-normal text-body-text">No conversations</p>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL — Active Chat Window */}
          <section className="flex min-w-0 min-h-0 flex-col bg-white rounded-[8px]">
            {selectedChat ? (
              <>
                {/* Chat Panel Header */}
                <header className="flex h-18 shrink-0 items-center justify-between border-b border-zinc-100 px-7">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-dm-san-regular text-lg font-semibold text-body-text">
                      {activeReceiverName}
                    </h2>
                    {activeReceiverType && (
                      <span className="rounded-full border border-secondary-color bg-secondary-light px-2.5 py-0.5 text-3xs font-medium font-dm-san-regular text-primary-color select-none">
                        {activeReceiverType}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 cursor-pointer outline-hidden transition-colors"
                  >
                    <IconDots className="size-6 text-body-text" />
                  </button>
                </header>

                {/* Messages Stream */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-white px-7 py-6 space-y-6">
                  {/* Messages Bubble Items */}
                  <div className="space-y-6">
                    {sortedMessages.map((m, idx) => {
                      const isAdmin = m.is_admin || !!m.admin_sender_id
                      const prevMsg = idx > 0 ? sortedMessages[idx - 1] : null
                      const showDateSep =
                        !prevMsg ||
                        new Date(m.created_at).toDateString() !==
                          new Date(prevMsg.created_at).toDateString()

                      return (
                        <React.Fragment key={m.id}>
                          {showDateSep && (
                            <div className="flex items-center justify-center">
                              <span className="text-2xs font-normal font-dm-san-regular text-body-text bg-white px-3 select-none">
                                {formatMessageDate(m.created_at)}
                              </span>
                            </div>
                          )}

                          <div
                            className={`flex flex-col ${
                              isAdmin ? "items-end" : "items-start"
                            }`}
                          >
                            {(() => {
                              const messageFiles = getMessageFiles(m.files)
                              const imageFiles = messageFiles.filter((f) =>
                                /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(f)
                              )
                              const docFiles = messageFiles.filter(
                                (f) => !/\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(f)
                              )
                              const hasText = Boolean(m.message && m.message.trim().length > 0)

                              return (
                                <div
                                  className={cn(
                                    "max-w-[75%] flex flex-col gap-1.5",
                                    isAdmin ? "items-end" : "items-start"
                                  )}
                                >
                                  {/* Image Attachments in their own padded, shadowed container (no #0B1F41 background) */}
                                  {imageFiles.length > 0 && (
                                    <div className="p-2 rounded-[8px] bg-white shadow-sm border border-zinc-200/70 w-fit max-w-full overflow-hidden">
                                      {imageFiles.length === 1 ? (
                                        <a
                                          href={imageFiles[0]}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group flex w-fit h-fit max-w-full overflow-hidden rounded-[6px] border border-zinc-200/70 bg-zinc-50/50 hover:opacity-95 transition-opacity"
                                        >
                                          <img
                                            src={imageFiles[0]}
                                            alt="Attachment 1"
                                            className="block w-auto h-auto max-w-[260px] max-h-[240px] object-contain rounded-[6px] transition-transform duration-200 group-hover:scale-[1.01]"
                                            loading="lazy"
                                          />
                                        </a>
                                      ) : (
                                        <div className="flex flex-col gap-2 w-fit max-w-full">
                                          {Array.from(
                                            { length: Math.ceil(imageFiles.length / 2) },
                                            (_, rowIdx) =>
                                              imageFiles.slice(rowIdx * 2, rowIdx * 2 + 2)
                                          ).map((rowImages, rowIdx) => (
                                            <div
                                              key={rowIdx}
                                              className="flex items-center gap-2 w-fit max-w-full"
                                            >
                                              {rowImages.map((fileUrl, fIdx) => (
                                                <a
                                                  key={fIdx}
                                                  href={fileUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="group flex min-w-0 w-fit h-fit max-w-full overflow-hidden rounded-[6px] border border-zinc-200/80 bg-zinc-50/50 shadow-2xs hover:opacity-95 transition-opacity"
                                                >
                                                  <img
                                                    src={fileUrl}
                                                    alt={`Attachment ${rowIdx * 2 + fIdx + 1}`}
                                                    className="block w-auto h-auto max-w-[260px] max-h-[240px] object-contain rounded-[6px] transition-transform duration-200 group-hover:scale-[1.01]"
                                                    loading="lazy"
                                                  />
                                                </a>
                                              ))}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Document / File Attachments in their own padded, shadowed container (no #0B1F41 background, max 2 per row) */}
                                  {docFiles.length > 0 && (
                                    <div className="p-2 rounded-[8px] bg-white shadow-sm border border-zinc-200/70 w-fit max-w-full">
                                      <div
                                        className={cn(
                                          "grid gap-1.5",
                                          docFiles.length === 1
                                            ? "grid-cols-1"
                                            : "grid-cols-1 sm:grid-cols-2"
                                        )}
                                      >
                                        {docFiles.map((fileUrl, fIdx) => {
                                          const fileName = decodeURIComponent(
                                            fileUrl.split("/").pop()?.split("?")[0] ||
                                              `Attachment ${fIdx + 1}`
                                          )
                                          const ext = fileName.includes(".")
                                            ? fileName.split(".").pop()?.toUpperCase()
                                            : "FILE"

                                          return (
                                            <a
                                              key={fIdx}
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download
                                              className="flex items-center gap-3 p-2.5 rounded-[6px] border border-zinc-200/80 bg-secondary-light/60 hover:bg-secondary-light text-body-text transition-colors text-xs font-dm-san-regular min-w-[200px] max-w-[250px]"
                                            >
                                              <div className="size-8 rounded-md bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 text-secondary-color">
                                                <IconFileText className="size-4.5" />
                                              </div>
                                              <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-heading-text">
                                                  {fileName}
                                                </p>
                                                <p className="text-[10px] text-zinc-400 uppercase mt-0.5">
                                                  {ext} Document
                                                </p>
                                              </div>
                                              <div className="size-7 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 text-body-text hover:text-primary-color transition-colors">
                                                <IconDownload className="size-3.5" />
                                              </div>
                                            </a>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Text Message Bubble (only rendered when text is present) */}
                                  {hasText && (
                                    <div
                                      className={cn(
                                        "px-4 py-3 text-sm leading-relaxed font-dm-san-regular font-normal rounded-[8px]",
                                        isAdmin
                                          ? "bg-primary-color text-white"
                                          : "bg-primary-light text-body-text"
                                      )}
                                    >
                                      {m.message}
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                            <span className="mt-1 text-[10px] font-dm-san-regular font-normal text-zinc-400 block px-1 select-none">
                              {formatMessageTime(m.created_at)}
                            </span>
                          </div>
                        </React.Fragment>
                      )
                    })}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Bottom Input Composer */}
                <div className="shrink-0 border-t border-zinc-100 bg-white px-7 py-4">
                  {/* Staged attachments preview tray */}
                  {stagedAttachments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5 mb-2.5 p-2.5 bg-zinc-50 rounded-[8px] border border-zinc-200 max-h-48 overflow-y-auto">
                      {stagedAttachments.map((att) =>
                        att.isImage && att.previewUrl ? (
                          <div
                            key={att.id}
                            className="relative group size-16 shrink-0 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 shadow-2xs"
                          >
                            <img
                              src={att.previewUrl}
                              alt={att.file.name}
                              className="size-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              disabled={isSending}
                              title="Remove image"
                              className="absolute top-1 right-1 size-5 rounded-full bg-black/70 hover:bg-error text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <IconX className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 bg-white border border-zinc-200 px-2.5 py-1.5 rounded-lg text-xs font-dm-san-regular text-body-text shadow-2xs"
                          >
                            <IconFileText className="size-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0 max-w-[140px]">
                              <p className="truncate font-medium">{att.file.name}</p>
                              <p className="text-[10px] text-zinc-400">
                                {(att.file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              disabled={isSending}
                              className="text-zinc-400 hover:text-error ml-1 cursor-pointer transition-colors"
                              title="Remove attachment"
                            >
                              <IconX className="size-3.5" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <div className="flex h-14 items-center gap-3.5 rounded-[8px] border border-zinc-300 bg-white px-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSending}
                      title="Attach files (images, PDF, documents)"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-body-text hover:bg-body-text/10 cursor-pointer outline-hidden transition-colors disabled:opacity-50"
                    >
                      <IconPaperclip className="size-5 rotate-45" />
                    </button>

                    <input
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                      placeholder={isUploadingFiles ? "Uploading attachments..." : "Send Message..."}
                      disabled={isSending}
                      className="min-w-0 flex-1 bg-transparent text-sm font-dm-san-regular font-normal text-body-text outline-none placeholder:text-zinc-400 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={(!newMessageText.trim() && stagedAttachments.length === 0) || isSending}
                      className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-pending-border hover:bg-pending-border/90 text-body-text transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 border-none shadow-none outline-hidden"
                    >
                      {isSending ? (
                        <IconLoader2 className="size-4.5 animate-spin" />
                      ) : (
                        <IconSend className="size-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Right Empty State Pane (Image 1 style) */
              <div className="flex min-h-0 flex-1 items-center justify-center bg-secondary-light p-8">
                <div className="w-full max-w-md text-center font-dm-san-regular">
                  <div className="mx-auto flex size-15 items-center justify-center rounded-full bg-secondary-light text-body-text mb-5">
                    <IconMessageOff className="size-7 stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg font-bold text-body-text mb-2">
                    No conversations yet
                  </h2>
                  <p className="text-sm font-normal text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
                    Your inbox is clear. New messages from caregivers and family members will appear here.
                  </p>
                  <Button
                    onClick={() => setIsStartChatOpen(true)}
                    className="rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
                  >
                    Start a New Conversation
                  </Button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>

      <StartChatModal
        open={isStartChatOpen}
        onOpenChange={setIsStartChatOpen}
      />
    </main>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  )
}
