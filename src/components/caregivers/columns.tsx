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

export interface CaregiverItem {
  id: string
  name: string
  email: string
  status: "Active" | "Inactive" | "Suspended"
  invitation: "Accepted" | "Pending"
  assignment: "Unassigned" | "Assigned" | "Pending onboard..." | "Unassigned (Sus)"
}

export const columns: ColumnDef<CaregiverItem>[] = [
  {
    accessorKey: "name",
    header: "Caregiver",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="font-dm-san-medium font-semibold text-body-text text-sm">
        {getValue() as string}
      </span>
    ),
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
        badgeClass = "bg-active-btn text-active-border border-active-border/20"
      } else {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border/20"
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
    cell: ({ row }) => {
      const caregiver = row.original
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
            <PopoverContent className="w-fit min-w-44 p-1.5 bg-white border border-zinc-200 rounded-xl shadow-md flex flex-col gap-0.5 z-50">
              <Link
                href={`/dashboard/caregivers/${caregiver.id}`}
                className="w-full text-left text-xs font-semibold px-3 py-2 hover:bg-zinc-100 rounded-md text-body-text cursor-pointer outline-hidden font-sans block"
              >
                View Profile
              </Link>
              <button className="w-full text-left text-xs font-semibold px-3 py-2 hover:bg-zinc-100 rounded-md text-body-text cursor-pointer outline-hidden font-sans">
                Resend Invitation
              </button>
              <div className="h-px bg-zinc-100 my-1" />
              <button className="w-full text-left text-xs font-semibold px-3 py-2 hover:bg-[#F7EEEE] hover:text-[#C43A3A] rounded-md text-error cursor-pointer outline-hidden font-sans">
                Suspend Account
              </button>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
