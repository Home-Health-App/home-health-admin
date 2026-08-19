import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

export interface PaymentItem {
  id: string
  reference: string
  amount: string
  date: string
  method: string
  status: "Success" | "Failed" | "Refunded"
}

interface BillingDetailColumnsProps {
  onRefund: (payment: PaymentItem) => void
  onMessage: (memberName: string) => void
}

export const getBillingDetailColumns = ({
  onRefund,
  onMessage,
}: BillingDetailColumnsProps): ColumnDef<PaymentItem>[] => [
  {
    accessorKey: "reference",
    header: "Reference",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
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
      let classes = "border-[#3AC485] bg-[#EEF7F3] text-[#0A432C]"
      if (status === "Failed") {
        classes = "border-[#C43A3A] bg-[#F7EEEE] text-[#430D0A]"
      } else if (status === "Refunded") {
        classes = "border-[#F0C630] bg-[#FBF7EA] text-[#4D4000]"
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
      const payment = row.original
      if (payment.status === "Refunded") {
        return null
      }
      return (
        <Popover>
          <PopoverTrigger className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors flex items-center justify-center">
            <IconDots className="size-5 text-zinc-400" />
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={4}
            className="w-fit bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2.5 px-0 z-50 flex flex-col font-dm-san-regular text-sm font-normal select-none gap-0"
          >
            <button
              onClick={() => onRefund(payment)}
              className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
            >
              Refund Transaction
            </button>
            <button
              onClick={() => onMessage("Sam Winchester")}
              className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
            >
              Message Family Member
            </button>
          </PopoverContent>
        </Popover>
      )
    },
  },
]
