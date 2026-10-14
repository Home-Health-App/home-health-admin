import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { AdminPaymentItem } from "@/types/billing.type"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/libs/utils"

interface ColumnsProps {
  onSelectPatient?: (patientId: string) => void
}

const TIER_STYLES: Record<string, string> = {
  Bronze: "border-[#F0C630] bg-[#FDF9ED] text-[#A16207]",
  Silver: "border-[#9CA3AF] bg-[#F3F4F6] text-[#4B5563]",
  Gold: "border-[#648FCC] bg-primary-light text-primary-color font-semibold",
  Diamond: "border-[#3AC485] bg-emerald-50 text-emerald-700 font-semibold",
}

const isSafeImageUrl = (url?: string | null) => {
  if (!url) return false
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")
}

export const getBillingColumns = (
  _props?: ColumnsProps
): ColumnDef<AdminPaymentItem>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ row }) => {
      const patient = row.original.patient
      const fullName = patient
        ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
        : "Patient"
      const initials =
        `${patient?.first_name?.[0] || ""}${patient?.last_name?.[0] || ""}`.toUpperCase() ||
        "P"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-zinc-200 shrink-0">
            {isSafeImageUrl(patient?.profile_picture) ? (
              <AvatarImage
                src={patient!.profile_picture!}
                alt={fullName}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <span className="font-dm-san-medium font-semibold text-body-text text-sm block truncate">
              {fullName}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "user",
    header: "Family Member",
    meta: { align: "left" },
    cell: ({ row }) => {
      const user = row.original.user
      const familyName = user
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : "-"
      const initials = user
        ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "FM"
        : "FM"

      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border border-zinc-200 shrink-0">
            {isSafeImageUrl(user?.profile_picture) ? (
              <AvatarImage
                src={user!.profile_picture!}
                alt={familyName}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-dm-san-regular font-medium text-body-text truncate block">
            {familyName}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "plan",
    header: "Care Plan",
    meta: { align: "left" },
    cell: ({ row }) => {
      const plan = row.original.plan
      const categoryLabel = plan?.category
        ? plan.category.replace(/_/g, " ")
        : "General Care"

      return (
        <div className="space-y-0.5">
          <span className="text-sm font-dm-san-regular font-medium text-body-text block truncate">
            {plan?.name || "Care Plan"}
          </span>
          <span className="text-2xs text-zinc-500 font-dm-san-regular block">
            {categoryLabel}
          </span>
        </div>
      )
    },
  },
  {
    id: "tier",
    header: "Tier",
    meta: { align: "left" },
    cell: ({ row }) => {
      const tier = row.original.plan?.tier || "Bronze"
      const style =
        TIER_STYLES[tier] || "border-zinc-200 bg-zinc-50 text-zinc-700"

      return (
        <span
          className={cn(
            "inline-block border px-2.5 py-0.5 text-xs font-normal rounded-full font-dm-san-regular select-none",
            style
          )}
        >
          {tier}
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
    accessorKey: "status",
    header: "Status",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const status = (getValue() as string) || "PENDING"
      const normalized = status.toUpperCase()

      let badgeClasses = "border-[#F0C630] bg-[#FBF7EA] text-[#4D4000]" // default pending
      let label = status

      if (
        normalized === "PAID" ||
        normalized === "SUCCESS" ||
        normalized === "ACTIVE"
      ) {
        badgeClasses = "border-[#3AC485] bg-[#EEF7F3] text-[#0A432C]"
        label = "Paid"
      } else if (
        normalized === "EXPIRED" ||
        normalized === "FAILED" ||
        normalized === "CANCELLED"
      ) {
        badgeClasses = "border-[#C43A3A] bg-[#F7EEEE] text-[#430D0A]"
        label = normalized === "EXPIRED" ? "Expired" : "Failed"
      } else if (normalized === "PENDING") {
        label = "Pending"
      }

      return (
        <span
          className={cn(
            "inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full font-dm-san-regular select-none capitalize",
            badgeClasses
          )}
        >
          {label}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Billing Date",
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
        <span className="text-sm font-dm-san-regular font-normal text-body-text whitespace-nowrap">
          {formatted}
        </span>
      )
    },
  },
]
