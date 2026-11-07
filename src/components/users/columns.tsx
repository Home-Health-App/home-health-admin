"use client"

import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface UserItem {
  id: string
  name: string
  email: string
  profile_picture?: string | null
  status: "Active" | "Inactive" | "Suspended"
  invitation: "Accepted" | "Pending"
  assignment: "Unassigned" | "Assigned" | "Pending onboard..." | "Unassigned (Sus)"
}

const isSafeImageUrl = (url?: string | null) => {
  if (!url) return false
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") || url.startsWith("data:")
}

export const columns: ColumnDef<UserItem>[] = [
  {
    accessorKey: "name",
    header: "User",
    meta: { align: "left" },
    cell: ({ row }) => {
      const user = row.original
      const name = user.name && user.name !== "-" ? user.name : "User"
      const initials = user.name && user.name !== "-"
        ? user.name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "U"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-zinc-200 shrink-0">
            {isSafeImageUrl(user.profile_picture) ? (
              <AvatarImage
                src={user.profile_picture!}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-dm-san-medium font-semibold text-body-text text-sm truncate">
            {user.name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-body-text text-sm font-sans">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let badgeClass = ""
      if (val === "Active") {
        badgeClass = "bg-active-btn text-active-border border-active-border"
      } else if (val === "Suspended") {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border"
      } else {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border"
      }
      return (
        <Badge
          variant="outline"
          className={`${badgeClass} font-sans font-medium px-4 py-0.5 rounded-full shadow-none text-xs`}
        >
          {val}
        </Badge>
      )
    },
  },
  {
    accessorKey: "invitation",
    header: "Invitation",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-body-text text-sm font-sans">
        {getValue() as string}
      </span>
    ),
  },
  // {
  //   accessorKey: "assignment",
  //   header: "Assignment",
  //   meta: { align: "left" },
  //   cell: ({ getValue }) => {
  //     const val = getValue() as string
  //     let textClass = "text-body-text"
  //     if (val.startsWith("Unassigned")) {
  //       textClass = "text-zinc-400 italic"
  //     }
  //     return (
  //       <span className={`${textClass} text-sm font-sans`}>
  //         {val}
  //       </span>
  //     )
  //   },
  // },
  {
    id: "actions",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row, table }) => {
      const user = row.original
      const meta = table.options.meta as {
        onViewProfile?: (user: UserItem) => void
        onResendInvitation?: (email: string) => void
      } | undefined

      return (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger
              render={
                <button className="p-1 hover:bg-zinc-100 rounded-md outline-hidden cursor-pointer">
                  <IconDots className="size-5 text-body-text opacity-70" />
                </button>
              }
            />
            <PopoverContent className="w-fit min-w-44 bg-white border border-zinc-200 rounded-[8px] shadow-xs flex flex-col gap-0.5 z-50">
              <Button
                variant="ghost"
                onClick={() => meta?.onViewProfile?.(user)}
                className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"
              >
                View Profile
              </Button>
              {user.invitation === "Pending" && (
                <Button
                  variant="ghost"
                  onClick={() => meta?.onResendInvitation?.(user.email)}
                  className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"
                >
                  Resend Invitation
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
