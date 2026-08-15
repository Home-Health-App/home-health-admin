"use client"

import React, { useMemo, useState } from "react"
import {
  IconDots,
  IconPaperclip,
  IconPlus,
  IconSearch,
  IconSend,
  IconMessageOff,
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const INITIAL_CONVERSATIONS: Conversation[] = [
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
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(1)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"read" | "unread">("read")
  const [newMessageText, setNewMessageText] = useState("")

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
      const matchesTab = activeTab === "read" ? !c.unread : c.unread
      return matchesSearch && matchesTab
    })
  }, [conversations, search, activeTab])

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId)
  }, [conversations, selectedConversationId])

  const unreadCount = useMemo(() => {
    return conversations.filter((c) => c.unread).length
  }, [conversations])

  const handleSendMessage = () => {
    if (!newMessageText.trim() || selectedConversationId === null) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversationId) {
          const newMsg: Message = {
            id: c.messages.length + 1,
            sender: "admin",
            text: newMessageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
          return {
            ...c,
            preview: newMessageText,
            messages: [...c.messages, newMsg],
          }
        }
        return c
      })
    )
    setNewMessageText("")
  }

  const handleStartNewConversation = () => {
    alert("Start a New Conversation clicked")
  }

  return (
    <main className="flex min-h-full w-full flex-1 p-0 pb-10 select-none">
      <div className="flex min-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-[8px]">
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
                onClick={handleStartNewConversation}
                className="flex h-9.5 items-center gap-1.5 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden"
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
                    Unread ({unreadCount})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Scrollable List */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {filteredConversations.map((c) => {
                const isSelected = selectedConversationId === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConversationId(c.id)}
                    className={`w-full text-left p-4 rounded-[8px] border transition-all cursor-pointer relative ${isSelected
                        ? "border-l-2 border-l-secondary-color border-border-light bg-white shadow-2xs"
                        : "border-zinc-200 bg-white"
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-dm-san-regular text-sm font-semibold text-body-text">
                            {c.name}
                          </span>
                          <span className="shrink-0 rounded-full border border-secondary-color bg-[#F4F7FC] px-2 py-0.5 text-3xs font-medium font-dm-san-regular text-[#1B335B] select-none">
                            {c.type}
                          </span>
                        </div>
                        <p className="mt-2.5 truncate font-dm-san-regular text-xs font-normal text-body-text">
                          {c.preview}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 self-start pt-0.5">
                        {c.unread && (
                          <span className="flex size-4.5 items-center justify-center rounded-full bg-[#648FCC] text-[10px] font-semibold text-white font-dm-san-regular select-none">
                            1
                          </span>
                        )}
                        <span className="text-[10px] font-dm-san-regular text-zinc-400 font-normal">
                          {c.time}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              })}

              {filteredConversations.length === 0 && (
                <div className="text-center py-10 font-dm-san-regular">
                  <p className="text-sm font-normal text-body-text">No conversations</p>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT PANEL — Active Chat Window */}
          <section className="flex min-w-0 min-h-0 flex-col bg-white rounded-[8px]">
            {selectedConversation ? (
              <>
                {/* Chat Panel Header */}
                <header className="flex h-18 shrink-0 items-center justify-between border-b border-zinc-100 px-7">
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-dm-san-regular text-lg font-semibold text-body-text">
                      {selectedConversation.name}
                    </h2>
                    <span className="rounded-full border border-secondary-color bg-[#F4F7FC] px-2.5 py-0.5 text-3xs font-medium font-dm-san-regular text-[#1B335B] select-none">
                      {selectedConversation.type}
                    </span>
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
                  {/* Date Separator */}
                  <div className="flex items-center justify-center">
                    <span className="text-2xs font-normal font-dm-san-regular text-body-text bg-white px-3 select-none">
                      Today, August 10
                    </span>
                  </div>

                  {/* Messages Bubble Items */}
                  <div className="space-y-6">
                    {selectedConversation.messages.map((m) => {
                      const isAdmin = m.sender === "admin"
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdmin ? "items-end" : "items-start"
                            }`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed font-dm-san-regular font-normal rounded-[8px] ${isAdmin
                                ? "bg-[#0B1E3F] text-white"
                                : "bg-[#D4E1F1] text-body-text"
                              }`}
                          >
                            {m.text}
                          </div>
                          <span className="mt-1 text-[10px] font-dm-san-regular font-normal text-zinc-400 block px-1 select-none">
                            {m.time}
                          </span>
                        </div>
                      )
                    })}

                    {/* Typing Indicator Bubble */}
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-[8px] bg-[#EEF2F6] px-4 py-3.5 select-none">
                        <span className="size-1.5 rounded-full bg-[#667085] animate-pulse" />
                        <span className="size-1.5 rounded-full bg-[#667085] animate-pulse delay-75" />
                        <span className="size-1.5 rounded-full bg-[#667085] animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Input Composer */}
                <div className="shrink-0 border-t border-zinc-100 bg-white px-7 py-4">
                  <div className="flex h-14 items-center gap-3.5 rounded-[8px] border border-zinc-300 bg-white px-4">
                    <button
                      type="button"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 cursor-pointer outline-hidden transition-colors"
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
                      placeholder="Placeholder"
                      className="min-w-0 flex-1 bg-transparent text-sm font-dm-san-regular font-normal text-body-text outline-none placeholder:text-zinc-400"
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessageText.trim()}
                      className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-pending-border hover:bg-#F0C630 text-body-text transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 border-none shadow-none outline-hidden"
                    >
                      <IconSend className="size-4.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Right Empty State Pane (Image 1 style) */
              <div className="flex min-h-0 flex-1 items-center justify-center bg-[#FAFBFC] p-8">
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
                    onClick={handleStartNewConversation}
                    className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
                  >
                    Start a New Conversation
                  </Button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  )
}