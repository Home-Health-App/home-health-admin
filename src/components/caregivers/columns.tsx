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

export interface CaregiverItem {
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

export const columns: ColumnDef<CaregiverItem>[] = [
  {
    accessorKey: "name",
    header: "Caregiver",
    meta: { align: "left" },
    cell: ({ row }) => {
      const caregiver = row.original
      const name = caregiver.name && caregiver.name !== "-" ? caregiver.name : "Caregiver"
      const initials = caregiver.name && caregiver.name !== "-"
        ? caregiver.name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "CG"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-zinc-200 shrink-0">
            {isSafeImageUrl(caregiver.profile_picture) ? (
              <AvatarImage
                src={caregiver.profile_picture!}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-dm-san-medium font-semibold text-body-text text-sm truncate">
            {caregiver.name}
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
  {
    accessorKey: "assignment",
    header: "Assignment",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let textClass = "text-body-text"
      if (val.startsWith("Unassigned")) {
        textClass = "text-zinc-400 italic"
      }
      return (
        <span className={`${textClass} text-sm font-sans`}>
          {val}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row, table }) => {
      const caregiver = row.original
      const isSuspended = caregiver.status === "Suspended"
      const meta = table.options.meta as {
        onResendInvitation?: (email: string) => void
        onUnassignPatient?: (caregiverId: string) => void
        onToggleSuspend?: (caregiverId: string, currentStatus: boolean) => void
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
              <Link
                href={`/dashboard/caregivers/${caregiver.id}`}
                className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block"
              >
                View Profile
              </Link>
              {caregiver.invitation === "Accepted" && (
                <Link
                  href={`/dashboard/messages?userId=${caregiver.id}`}
                  className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block"
                >
                  Message Caregiver
                </Link>
              )}
              {caregiver.invitation === "Accepted" && caregiver.assignment === "Assigned" && (
                <Button
                  variant="ghost"
                  onClick={() => meta?.onUnassignPatient?.(caregiver.id)}
                  className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none text-body-text"
                >
                  Unassign Patient
                </Button>
              )}
              {caregiver.invitation === "Pending" && (
                <Button
                  variant="ghost"
                  onClick={() => meta?.onResendInvitation?.(caregiver.email)}
                  className="w-full text-left text-base font-normal rounded-md px-2 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"
                >
                  Resend Invitation
                </Button>
              )}
              {caregiver.invitation === "Accepted" && (
                <>
                  <div className="h-px bg-secondary-light my-1" />
                  <Button
                    variant="ghost"
                    onClick={() => meta?.onToggleSuspend?.(caregiver.id, isSuspended)}
                    className={isSuspended 
                      ? "w-full text-left text-sm font-normal px-2 py-1 hover:bg-active-btn hover:text-active-border rounded-md text-active-border cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none" 
                      : "w-full text-left text-sm font-normal px-2 py-1 hover:bg-warning-btn hover:text-error rounded-md text-error cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"}
                  >
                    {isSuspended ? "Unsuspend Account" : "Suspend Account"}
                  </Button>
                </>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
