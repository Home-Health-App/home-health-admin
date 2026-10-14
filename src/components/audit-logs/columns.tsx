"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ActivityLogItem } from "@/types/activity-log.type"

export const columns: ColumnDef<ActivityLogItem>[] = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const rawDate = getValue() as string
      if (!rawDate) {
        return (
          <span className="text-sm font-dm-san-regular text-body-text whitespace-nowrap">
            -
          </span>
        )
      }

      try {
        const d = new Date(rawDate)
        if (isNaN(d.getTime())) {
          return (
            <span className="text-sm font-dm-san-regular text-body-text whitespace-nowrap">
              {rawDate}
            </span>
          )
        }

        const formattedDate = d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })

        const formattedTime = d.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })

        return (
          <div className="flex items-center gap-1.5 whitespace-nowrap text-sm font-dm-san-regular text-body-text">
            <span>{formattedDate}</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500 font-sans text-xs">{formattedTime}</span>
          </div>
        )
      } catch {
        return (
          <span className="text-sm font-dm-san-regular text-body-text whitespace-nowrap">
            {rawDate}
          </span>
        )
      }
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const action = (getValue() as string) || "Activity"
      const lower = action.toLowerCase()

      let classes = "border-[#EAB308] bg-[#FEF9C3] text-[#A16207]"
      if (
        lower.includes("reactivated") ||
        lower.includes("added") ||
        lower.includes("created") ||
        lower.includes("payment") ||
        lower.includes("assigned")
      ) {
        classes = "border-[#22C55E] bg-[#DCFCE7] text-[#15803D]"
      } else if (
        lower.includes("suspended") ||
        lower.includes("deleted") ||
        lower.includes("removed") ||
        lower.includes("deactivated")
      ) {
        classes = "border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C]"
      } else if (lower.includes("report") || lower.includes("override")) {
        classes = "border-[#3B82F6] bg-[#DBEAFE] text-[#1D4ED8]"
      }

      return (
        <span
          className={`inline-block border px-3 py-1 text-2xs font-medium rounded-full font-dm-san-regular ${classes} select-none whitespace-nowrap`}
        >
          {action}
        </span>
      )
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text line-clamp-2">
        {(getValue() as string) || "-"}
      </span>
    ),
  },
  {
    accessorKey: "actor_type",
    header: "Actor",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text whitespace-nowrap">
        {(getValue() as string) || "Admin"}
      </span>
    ),
  },
  {
    accessorKey: "log_type",
    header: "Log Type",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-zinc-600 whitespace-nowrap">
        {(getValue() as string) || "-"}
      </span>
    ),
  },
]
