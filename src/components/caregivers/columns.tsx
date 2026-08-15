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
        badgeClass = "bg-active-btn text-active-border border-active-border"
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
            <PopoverContent className="w-fit min-w-44 bg-white border border-zinc-200 rounded-[8px] shadow-xs flex flex-col gap-0.5 z-50">
              <Link
                href={`/dashboard/caregivers/${caregiver.id}`}
                className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block"
              >
                View Profile
              </Link>
              <Button variant="ghost" className="w-full text-left text-base font-normal rounded-md px-2 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block">
                Resend Invitation
              </Button>
              <div className="h-px bg-secondary-light my-1" />
              <Button variant="ghost" className="w-full text-left text-sm font-normal px-2 py-1 hover:bg-warning-btn hover:text-[#C43A3A] rounded-md text-error cursor-pointer outline-hidden font-dm-san-regular block">
                Suspend Account
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
