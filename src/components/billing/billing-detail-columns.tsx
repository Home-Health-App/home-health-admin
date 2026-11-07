import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import React from "react"
import { AdminPaymentItem } from "@/types/billing.type"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { cn } from "@/libs/utils"

interface BillingDetailColumnsProps {
  onRefund: (payment: AdminPaymentItem) => void
  onMessage: (userId: string) => void
}

export const getBillingDetailColumns = ({
  onRefund,
  onMessage,
}: BillingDetailColumnsProps): ColumnDef<AdminPaymentItem>[] => [
  {
    accessorKey: "id",
    header: "Payment ID / Ref",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-xs font-mono font-medium text-body-text">
        {(getValue() as string) || "-"}
      </span>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan & Tier",
    meta: { align: "left" },
    cell: ({ row }) => {
      const plan = row.original.plan
      return (
        <span className="text-sm font-dm-san-regular font-normal text-body-text">
          {plan?.name ? `${plan.name} (${plan.tier})` : "Care Plan"}
        </span>
      )
    },
  },
  {
    accessorKey: "currency",
    header: "Amount",
    meta: { align: "left" },
    cell: ({ row }) => {
      const plan = row.original.plan
      const price = Number(plan?.price || 0)
      const currency = row.original.currency || "NGN"
      return (
        <span className="text-sm font-dm-san-regular font-bold text-body-text">
          ₦{price.toLocaleString()} {currency}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const rawDate = getValue() as string
      if (!rawDate) return <span className="text-sm text-zinc-400">-</span>
      const formatted = new Date(rawDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      return (
        <span className="text-sm font-dm-san-regular font-normal text-body-text">
          {formatted}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const status = ((getValue() as string) || "PENDING").toUpperCase()
      let classes = "border-pending-border bg-pending-btn text-pending-border"
      let label = status

      if (status === "PAID" || status === "SUCCESS" || status === "ACTIVE") {
        classes = "border-active-border bg-active-btn text-active-border"
        label = "Paid"
      } else if (status === "FAILED" || status === "EXPIRED") {
        classes = "border-warning-border bg-warning-btn text-warning-border"
        label = status === "EXPIRED" ? "Expired" : "Failed"
      } else if (status === "REFUNDED") {
        classes = "border-[#9CA3AF] bg-secondary-light text-[#4B5563]"
        label = "Refunded"
      } else if (status === "PENDING") {
        label = "Pending"
      }

      return (
        <span
          className={cn(
            "inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full font-dm-san-regular select-none capitalize",
            classes
          )}
        >
          {label}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row }) => {
      const payment = row.original
      const userId = payment.user_id || payment.user?.id || ""

      return (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <Popover>
            <PopoverTrigger
              render={
                <button className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors flex items-center justify-center">
                  <IconDots className="size-5 text-zinc-400" />
                </button>
              }
            />
            <PopoverContent
              align="end"
              sideOffset={4}
              className="w-fit min-w-44 bg-white border border-zinc-200 rounded-[8px] shadow-lg py-1.5 px-0 z-50 flex flex-col font-dm-san-regular text-xs font-normal select-none gap-0"
            >
              {/* Temporarily hidden refund action
              <button
                onClick={() => onRefund(payment)}
                className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
              >
                Refund Transaction
              </button>
              */}
              {userId && (
                <button
                  onClick={() => onMessage(userId)}
                  className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                >
                  Message Family Member
                </button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
