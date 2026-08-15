"use client"

import { useMemo, useState } from "react"

import {
  IconDots,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
} from "@tabler/icons-react"

import { Input } from "@/components/ui/input"

type Message = {
  id: number
  sender: "patient" | "admin"
  text: string
  time: string
}

type Conversation = {
  id: number
  name: string
  type: "Family" | "Caregiver"
  time: string
  preview: string
  unread: boolean
  messages: Message[]
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sam Winchester",
    type: "Family",
    time: "02:00 PM",
    preview: "This is a snippet of the message",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "patient",
        text: "Hi, Dean had a restless night. Her vitals this morning are stable, but I wanted to report that she seems slightly confused regarding her medication schedule.",
        time: "10:42 AM",
      },
      {
        id: 2,
        sender: "admin",
        text: "Thank you for the update, Sarah. I will review her chart and schedule a brief telehealth check-in for this afternoon. Please ensure she takes the morning dose as prescribed.",
        time: "10:45 AM",
      },
    ],
  },

  {
    id: 2,
    name: "Bobby Singer",
    type: "Caregiver",
    time: "02:00 PM",
    preview: "This is a snippet of the message",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "patient",
        text: "I have completed today's visit and everything looks good.",
        time: "02:00 PM",
      },
    ],
  },
]

export default function MessagesPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<number | null>(null)

  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"read" | "unread">("read")
  const [message, setMessage] = useState("")

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch = conversation.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesTab =
        activeTab === "read"
          ? !conversation.unread
          : conversation.unread

      return matchesSearch && matchesTab
    })
  }, [search, activeTab])

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId
  )

  const unreadCount = conversations.filter(
    (conversation) => conversation.unread
  ).length

  const sendMessage = () => {
    if (!message.trim()) return

    console.log("Send message:", message)

    setMessage("")
  }

  return (
    <main className="flex min-h-full w-full flex-1 bg-[#F7F9FC] p-0">

      <div className="flex min-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl bg-white">

        {/* =========================================================
            TOP HEADER
        ========================================================= */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-5">

          <div>
            <h1 className="font-dm-san-medium text-2xl font-bold text-[#1D2939]">
              Inbox
            </h1>

            <p className="mt-0.5 text-sm font-sans text-[#667085]">
              Manage conversations with families and caregivers.
            </p>
          </div>

          <button
            type="button"
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-full
              bg-[#1B335B]
              px-5
              text-sm
              font-medium
              font-sans
              text-white
              transition-colors
              hover:bg-[#142846]
            "
          >
            <IconPlus className="size-4.5" />
            New Message
          </button>
        </div>

        {/* =========================================================
            MAIN MESSAGES LAYOUT
        ========================================================= */}
        <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)]">

          {/* =======================================================
              LEFT — INBOX
          ======================================================== */}
          <aside className="
            flex
            min-h-0
            flex-col
            border-r
            border-zinc-200
            bg-white
          ">

            {/* Search */}
            <div className="px-5 pt-5">

              <div className="relative">

                <IconSearch
                  className="
                    absolute
                    left-3.5
                    top-1/2
                    size-4.5
                    -translate-y-1/2
                    text-[#98A2B3]
                  "
                />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Patients"
                  className="
                    h-11
                    w-full
                    rounded-full
                    border-[#D0D5DD]
                    bg-white
                    pl-10
                    pr-4
                    font-sans
                    text-sm
                    text-[#344054]
                    shadow-none
                    placeholder:text-[#98A2B3]
                    focus-visible:border-[#648FCC]
                    focus-visible:ring-1
                    focus-visible:ring-[#648FCC]
                  "
                />

              </div>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-4 pb-3">

              <div className="inline-flex rounded-lg bg-[#F2F4F7] p-1">

                <button
                  type="button"
                  onClick={() => setActiveTab("read")}
                  className={`
                    rounded-md
                    px-4
                    py-1.5
                    text-xs
                    font-medium
                    font-sans
                    transition-colors
                    ${
                      activeTab === "read"
                        ? "bg-[#648FCC] text-white shadow-sm"
                        : "text-[#475467] hover:text-[#1D2939]"
                    }
                  `}
                >
                  Read
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("unread")}
                  className={`
                    rounded-md
                    px-4
                    py-1.5
                    text-xs
                    font-medium
                    font-sans
                    transition-colors
                    ${
                      activeTab === "unread"
                        ? "bg-[#648FCC] text-white shadow-sm"
                        : "text-[#475467] hover:text-[#1D2939]"
                    }
                  `}
                >
                  Unread ({unreadCount})
                </button>

              </div>
            </div>

            {/* Conversation list */}
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">

              {filteredConversations.length > 0 ? (
                <div className="space-y-2">

                  {filteredConversations.map((conversation) => {
                    const selected =
                      selectedConversationId === conversation.id

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() =>
                          setSelectedConversationId(conversation.id)
                        }
                        className={`
                          w-full
                          rounded-xl
                          border
                          p-4
                          text-left
                          transition-all
                          ${
                            selected
                              ? "border-[#648FCC] bg-[#F5F8FC]"
                              : "border-zinc-200 bg-white hover:border-[#B7C8DF] hover:bg-[#FAFBFC]"
                          }
                        `}
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center gap-2">

                              <span className="
                                truncate
                                font-dm-san-medium
                                text-sm
                                font-semibold
                                text-[#344054]
                              ">
                                {conversation.name}
                              </span>

                              <span className="
                                shrink-0
                                rounded-full
                                border
                                border-[#648FCC]
                                bg-[#F4F7FC]
                                px-2
                                py-0.5
                                text-[10px]
                                font-medium
                                font-sans
                                text-[#1B335B]
                              ">
                                {conversation.type}
                              </span>

                            </div>

                            <p className="
                              mt-3
                              truncate
                              text-xs
                              font-sans
                              text-[#667085]
                            ">
                              {conversation.preview}
                            </p>

                          </div>

                          <div className="flex shrink-0 items-center gap-2">

                            {conversation.unread && (
                              <span className="
                                flex
                                size-5
                                items-center
                                justify-center
                                rounded-full
                                bg-[#648FCC]
                                text-[10px]
                                font-semibold
                                text-white
                              ">
                                1
                              </span>
                            )}

                            <span className="
                              text-[10px]
                              font-sans
                              text-[#667085]
                            ">
                              {conversation.time}
                            </span>

                          </div>

                        </div>

                      </button>
                    )
                  })}

                </div>
              ) : (
                <div className="flex h-full items-start justify-center pt-10">

                  <div className="px-6 text-center">

                    <p className="text-sm font-semibold text-[#344054]">
                      No conversations
                    </p>

                    <p className="mt-1 text-xs text-[#98A2B3]">
                      Your conversations will appear here.
                    </p>

                  </div>

                </div>
              )}

            </div>
          </aside>

          {/* =======================================================
              RIGHT — CHAT
          ======================================================== */}
          <section className="flex min-w-0 min-h-0 flex-col bg-white">

            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <header className="
                  flex
                  h-[72px]
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-zinc-200
                  px-7
                ">

                  <div className="flex items-center gap-2.5">

                    <h2 className="
                      font-dm-san-medium
                      text-lg
                      font-semibold
                      text-[#344054]
                    ">
                      {selectedConversation.name}
                    </h2>

                    <span className="
                      rounded-full
                      border
                      border-[#648FCC]
                      bg-[#F4F7FC]
                      px-2.5
                      py-1
                      text-[11px]
                      font-medium
                      font-sans
                      text-[#1B335B]
                    ">
                      {selectedConversation.type}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-full
                      text-[#475467]
                      hover:bg-zinc-100
                    "
                  >
                    <IconDots className="size-5" />
                  </button>

                </header>

                {/* Messages */}
                <div className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  bg-white
                  px-7
                  py-6
                ">

                  <div className="mx-auto max-w-4xl">

                    {/* Date */}
                    <div className="mb-6 flex items-center gap-4">

                      <div className="h-px flex-1 bg-zinc-200" />

                      <span className="
                        shrink-0
                        text-[11px]
                        font-sans
                        text-[#667085]
                      ">
                        Today, August 10
                      </span>

                      <div className="h-px flex-1 bg-zinc-200" />

                    </div>

                    <div className="space-y-5">

                      {selectedConversation.messages.map((item) => {
                        const isAdmin = item.sender === "admin"

                        return (
                          <div
                            key={item.id}
                            className={`
                              flex
                              flex-col
                              ${
                                isAdmin
                                  ? "items-end"
                                  : "items-start"
                              }
                            `}
                          >

                            <div
                              className={`
                                max-w-[72%]
                                rounded-2xl
                                px-4
                                py-3.5
                                text-sm
                                leading-6
                                font-sans
                                ${
                                  isAdmin
                                    ? "rounded-br-md bg-[#1B335B] text-white"
                                    : "rounded-bl-md bg-[#D9E7F5] text-[#344054]"
                                }
                              `}
                            >
                              {item.text}
                            </div>

                            <span className="
                              mt-1.5
                              text-[10px]
                              font-sans
                              text-[#667085]
                            ">
                              {item.time}
                            </span>

                          </div>
                        )
                      })}

                      {/* Typing indicator */}
                      <div className="flex justify-start">

                        <div className="
                          flex
                          items-center
                          gap-1
                          rounded-lg
                          bg-[#D9E7F5]
                          px-4
                          py-3
                        ">
                          <span className="size-1.5 rounded-full bg-[#667085]" />
                          <span className="size-1.5 rounded-full bg-[#667085]" />
                          <span className="size-1.5 rounded-full bg-[#667085]" />
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

                {/* Composer */}
                <div className="
                  shrink-0
                  border-t
                  border-zinc-200
                  bg-white
                  px-7
                  py-4
                ">

                  <div className="
                    flex
                    h-14
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#648FCC]
                    bg-white
                    px-3
                    shadow-sm
                    focus-within:ring-2
                    focus-within:ring-[#648FCC]/10
                  ">

                    <button
                      type="button"
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[#475467]
                        hover:bg-zinc-100
                      "
                    >
                      <IconPaperclip className="size-5" />
                    </button>

                    <input
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          sendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="
                        min-w-0
                        flex-1
                        bg-transparent
                        text-sm
                        font-sans
                        text-[#344054]
                        outline-none
                        placeholder:text-[#98A2B3]
                      "
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FBC51B]
                        text-[#1B335B]
                        transition-colors
                        hover:bg-[#EFB90F]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <IconSend className="size-5" />
                    </button>

                  </div>
                </div>
              </>
            ) : (

              /* =====================================================
                 EMPTY CHAT STATE
              ====================================================== */
              <div className="
                flex
                min-h-0
                flex-1
                items-center
                justify-center
                bg-[#FAFBFC]
                p-8
              ">

                <div className="
                  w-full
                  max-w-md
                  text-center
                ">

                  <div className="
                    mx-auto
                    flex
                    size-16
                    items-center
                    justify-center
                    rounded-full
                    bg-[#E8EEF7]
                    text-[#4F73B8]
                  ">
                    <IconSend className="size-7" />
                  </div>

                  <h2 className="
                    mt-5
                    font-dm-san-medium
                    text-lg
                    font-bold
                    text-[#344054]
                  ">
                    No conversation selected
                  </h2>

                  <p className="
                    mx-auto
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    font-sans
                    text-[#667085]
                  ">
                    Select a conversation from your inbox or start
                    a new conversation with a family member or
                    caregiver.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-5
                      inline-flex
                      h-10
                      items-center
                      gap-2
                      rounded-full
                      bg-[#1B335B]
                      px-5
                      text-sm
                      font-medium
                      font-sans
                      text-white
                      hover:bg-[#142846]
                    "
                  >
                    <IconPlus className="size-4" />
                    Start a New Conversation
                  </button>

                </div>

              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  )
}