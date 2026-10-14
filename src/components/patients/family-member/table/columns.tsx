"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export interface LinkedPatient {
  id: string
  name: string
  profile_picture?: string | null
  relationship: string
  caregiver: string
  caregiver_profile_picture?: string | null
  subscription: "Active" | "Grace Period" | "Expired"
}

const isSafeImageUrl = (url?: string | null) => {
  if (!url) return false
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/") ||
    url.startsWith("data:")
  )
}

export const columns: ColumnDef<LinkedPatient>[] = [
  {
    accessorKey: "name",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ row }) => {
      const patient = row.original
      const name = patient.name || "Patient"
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "P"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-zinc-200 shrink-0">
            {isSafeImageUrl(patient.profile_picture) ? (
              <AvatarImage
                src={patient.profile_picture!}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-dm-san-medium font-normal text-body-text text-base truncate">
            {name}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "relationship",
    header: "Relationship",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="font-dm-san-medium font-normal text-body-text text-base">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "caregiver",
    header: "Caregiver",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="font-dm-san-medium font-normal text-body-text text-base">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "subscription",
    header: "Subscription",
    meta: { align: "center" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let badgeClass = ""
      if (val === "Active") {
        badgeClass = "bg-active-btn text-active-border border-active-border"
      } else if (val === "Grace Period") {
        badgeClass = "bg-pending-btn text-pending-border border-pending-border"
      } else {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border"
      }
      return (
        <Badge
          variant="outline"
          className={`${badgeClass} font-dm-san-regular font-normal px-2 py-1 rounded-full shadow-none text-xs`}
        >
          {val}
        </Badge>
      )
    },
  },
]
