"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useGetUsers } from "@/hooks/user.hook"
import { useCreateAdminChat } from "@/hooks/chat.hook"
import { IconSearch, IconUser, IconUsers } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { cn } from "@/libs/utils"

interface StartChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StartChatModal({
  open,
  onOpenChange,
}: StartChatModalProps) {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"ALL" | "USER" | "CARE_GIVER">("ALL")
  const router = useRouter()

  const { data: usersData, isLoading } = useGetUsers({
    limit: 100,
  })

  const { mutate: createChat, isPending } = useCreateAdminChat()

  const allUsers = usersData?.data || []

  const filteredUsers = allUsers.filter((u) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase()
    const email = (u.email || "").toLowerCase()
    const matchesSearch =
      fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    const matchesType = filterType === "ALL" ? true : u.type === filterType
    return matchesSearch && matchesType
  })

  const handleSelectUser = (user: typeof allUsers[0]) => {
    createChat(
      {
        type: "USER",
        reciever_id: user.id,
        is_for_admin: true,
      },
      {
        onSuccess: (res) => {
          const chatId = res?.data?.id
          onOpenChange(false)
          if (chatId) {
            router.push(`/dashboard/messages?chatId=${chatId}`)
          }
        },
        onError: () => {
          toast.error("Failed to start chat with user.")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold font-dm-san-regular text-body-text">
            Start a New Conversation
          </DialogTitle>
          <p className="text-sm text-zinc-500 font-dm-san-regular">
            Select a family member or caregiver to message
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <IconSearch className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="h-10.5 w-full rounded-full border border-zinc-200 bg-white pl-10 pr-4 font-dm-san-regular text-sm text-body-text shadow-none placeholder:text-zinc-400 focus-visible:border-primary-color focus-visible:ring-0"
            />
          </div>

          {/* Type Filter Pills */}
          <div className="flex gap-2 font-dm-san-regular text-xs">
            <button
              type="button"
              onClick={() => setFilterType("ALL")}
              className={cn(
                "px-3 py-1 rounded-full transition-colors cursor-pointer",
                filterType === "ALL"
                  ? "bg-secondary-color text-white"
                  : "bg-zinc-100 text-body-text hover:bg-zinc-200"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType("USER")}
              className={cn(
                "px-3 py-1 rounded-full transition-colors cursor-pointer",
                filterType === "USER"
                  ? "bg-secondary-color text-white"
                  : "bg-zinc-100 text-body-text hover:bg-zinc-200"
              )}
            >
              Family
            </button>
            <button
              type="button"
              onClick={() => setFilterType("CARE_GIVER")}
              className={cn(
                "px-3 py-1 rounded-full transition-colors cursor-pointer",
                filterType === "CARE_GIVER"
                  ? "bg-secondary-color text-white"
                  : "bg-zinc-100 text-body-text hover:bg-zinc-200"
              )}
            >
              Caregivers
            </button>
          </div>

          {/* Users List */}
          <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1">
            {isLoading ? (
              <div className="space-y-2 py-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-14 bg-zinc-100 rounded-[8px] animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email
                const roleBadge = u.type === "CARE_GIVER" ? "Caregiver" : null
                return (
                  <button
                    key={u.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleSelectUser(u)}
                    className="w-full text-left p-3 rounded-[8px] border border-zinc-100 hover:border-secondary-color/40 hover:bg-secondary-light/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-9 rounded-full bg-secondary-light text-secondary-color flex items-center justify-center font-bold text-xs uppercase shrink-0">
                        {u.first_name?.[0] || u.email?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-dm-san-regular text-sm font-semibold text-body-text truncate group-hover:text-primary-color transition-colors">
                          {fullName}
                        </div>
                        <div className="font-dm-san-regular text-xs text-zinc-400 truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>
                    {roleBadge && (
                      <span className="shrink-0 rounded-full border border-secondary-color bg-[#F4F7FC] px-2 py-0.5 text-3xs font-medium font-dm-san-regular text-[#1B335B]">
                        {roleBadge}
                      </span>
                    )}
                  </button>
                )
              })
            ) : (
              <div className="text-center py-8 text-sm text-zinc-500 font-dm-san-regular">
                No users found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
