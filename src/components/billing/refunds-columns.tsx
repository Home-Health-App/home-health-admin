import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import React from "react"
import { RefundItem } from "./refunds-list-view"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

interface ColumnsProps {
  onSelectRefund: (patientName: string) => void
}

export const getRefundsColumns = ({
  onSelectRefund,
}: ColumnsProps): ColumnDef<RefundItem>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const name = getValue() as string
      return (
        <button
          onClick={() => onSelectRefund(name)}
          className="text-sm font-dm-san-regular font-normal hover:underline text-left cursor-pointer outline-hidden text-body-text"
        >
          {name}
        </button>
      )
    },
  },
  {
    accessorKey: "refundType",
    header: "Refund Type",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text truncate max-w-[200px] block">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const status = getValue() as string
      let classes = "border-active-border bg-active-btn text-active-border"
      if (status === "Pending") {
        classes = "border-pending-border bg-pending-btn text-pending-border"
      } else if (status === "Denied") {
        classes = "border-warning-border bg-warning-btn text-warning-border"
      }
      return (
        <span className={`inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full font-dm-san-regular ${classes} select-none`}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "left" },
    cell: ({ row }) => {
      const refund = row.original
      return (
        <Popover>
          <PopoverTrigger className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors flex items-center justify-center">
            <IconDots className="size-5 text-zinc-400" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={4}
            className="w-[170px] bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2.5 z-50 flex flex-col font-dm-san-regular text-sm font-normal select-none gap-0"
          >
            <button
              onClick={() => onSelectRefund(refund.patient)}
              className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
            >
              View Details
            </button>
          </PopoverContent>
        </Popover>
      )
    },
  },
]
