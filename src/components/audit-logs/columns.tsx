import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { AuditLog } from "./audit-logs-view"

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "eventType",
    header: "Event Type",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const type = getValue() as AuditLog["eventType"]
      let classes = "border-[#EAB308] bg-[#FEF9C3] text-[#A16207]"
      if (type === "Payment" || type === "Family Added") {
        classes = "border-[#22C55E] bg-[#DCFCE7] text-[#15803D]"
      } else if (type === "Caregiver Suspended") {
        classes = "border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C]"
      } else if (type === "AI Report") {
        classes = "border-[#3B82F6] bg-[#DBEAFE] text-[#1D4ED8]"
      }

      return (
        <span className={`inline-block border px-3 py-1 text-2xs font-normal rounded-full font-dm-san-regular ${classes} select-none`}>
          {type}
        </span>
      )
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "actor",
    header: "Actor",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
]
