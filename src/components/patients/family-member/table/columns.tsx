"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export interface LinkedPatient {
  id: string
  name: string
  relationship: string
  caregiver: string
  subscription: "Active" | "Grace Period" | "Expired"
}

export const columns: ColumnDef<LinkedPatient>[] = [
  {
    accessorKey: "name",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="font-dm-san-medium font-normal text-body-text text-base">
        {getValue() as string}
      </span>
    ),
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
