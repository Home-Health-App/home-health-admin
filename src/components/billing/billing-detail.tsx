"use client"

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconDots, IconFileDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"

interface PaymentItem {
  id: string
  reference: string
  amount: string
  date: string
  method: string
  status: "Success" | "Failed" | "Refunded"
}

interface BillingDetailProps {
  patientName: string
  onBack: () => void
}

const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: "1",
    reference: "PM-26-89A1",
    amount: "$200",
    date: "Aug. 5 2026",
    method: "Card Payment",
    status: "Success",
  },
  {
    id: "2",
    reference: "PM-26-89A1",
    amount: "$200",
    date: "Aug. 5 2026",
    method: "ACH Transfer",
    status: "Failed",
  },
  {
    id: "3",
    reference: "PM-26-89A1",
    amount: "$200",
    date: "Aug. 5 2026",
    method: "Wire Transfer",
    status: "Refunded",
  },
]

export default function BillingDetail({
  patientName,
  onBack,
}: BillingDetailProps) {
  
  const router = useRouter()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleToggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const handleOverrideSubscription = () => {
    alert(`Override Subscription clicked for ${patientName}`)
  }

  const handleMessageMember = (memberName: string) => {
    alert(`Message initiated with ${memberName}`)
    setActiveDropdown(null)
  }

  const handleExportCSV = () => {
    alert("Export CSV clicked")
  }

  const handleRefundTransaction = (payment: PaymentItem) => {
    router.push("/dashboard/billing/refunds")
    setActiveDropdown(null)
  }

  const columns = useMemo<ColumnDef<PaymentItem>[]>(() => [
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
        let classes = "border-[#22C55E] bg-[#DCFCE7] text-[#15803D]"
        if (status === "Failed") {
          classes = "border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C]"
        } else if (status === "Refunded") {
          classes = "border-[#EAB308] bg-[#FEF9C3] text-[#A16207]"
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
        const isDropdownOpen = activeDropdown === payment.id
        return (
          <div className="relative">
            <button
              onClick={() => handleToggleDropdown(payment.id)}
              className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors"
            >
              <IconDots className="size-5 text-zinc-400" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setActiveDropdown(null)}
                />
                <div className="absolute right-6 top-10 w-[170px] bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2.5 z-50 flex flex-col font-dm-san-regular text-sm font-normal select-none">
                  {payment.status === "Refunded" ? (
                    <button
                      onClick={() => {
                        router.push(`/dashboard/billing/refunds/refund-details?name=${encodeURIComponent(patientName)}`)
                        setActiveDropdown(null)
                      }}
                      className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                    >
                      View Details
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRefundTransaction(payment)}
                        className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                      >
                        Refund Transaction
                      </button>
                      <div className="h-px bg-zinc-100 my-1.5 w-full" />
                      <button
                        onClick={() => handleMessageMember("Sam Winchester")}
                        className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                      >
                        Message Family Member
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )
      },
    },
  ], [activeDropdown])

  return (
    <div className="w-full space-y-8 pb-12 select-none">
      
      {/* Back Header Nav */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#648FCC] hover:text-[#5277a8] transition-colors cursor-pointer outline-hidden border-none bg-transparent"
          >
            <IconArrowLeft className="size-4" />
            Back to Overview
          </button>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              {patientName}
            </h1>
            <p className="text-xs font-normal font-dm-san-regular text-zinc-400 mt-1">
              ID: 12345678 | Registered: Aug. 5 2026 | Age: 66
            </p>
          </div>
        </div>

        <Button
          onClick={handleOverrideSubscription}
          className="rounded-full bg-[#C93B3B] hover:bg-[#b03030] text-white font-dm-san-regular font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors self-start sm:self-end"
        >
          Override Subscription
        </Button>
      </div>

      {/* Subscription info and Family columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Col 1: Subscription Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-dm-san-regular text-body-text">
            Subscription Info
          </h3>

          <div className="space-y-3.5 font-dm-san-regular text-sm text-body-text">
            <div className="flex items-center justify-between py-0.5">
              <span className="font-semibold text-body-text">Status</span>
              <span className="inline-block border border-[#22C55E] bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 text-2xs font-normal rounded-full select-none">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-semibold text-body-text">Plan Amount</span>
              <span className="font-normal text-body-text">$200/month</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-semibold text-body-text">Care Category</span>
              <span className="font-normal text-body-text">Elderly Care</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-semibold text-body-text">Tier</span>
              <span className="font-normal text-body-text">Bronze</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-semibold text-body-text">Paid Date</span>
              <span className="font-normal text-body-text">Aug. 06, 2026</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-100 pb-3">
              <span className="font-semibold text-body-text">Next Renewal</span>
              <span className="font-normal text-body-text">Sept. 06, 2026</span>
            </div>
          </div>
        </div>

        {/* Col 2: Family Members */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-dm-san-regular text-body-text">
            Family Members
          </h3>

          <div className="space-y-4">
            {/* Contact 1 */}
            <div className="flex items-center justify-between font-dm-san-regular">
              <div>
                <span className="font-semibold text-sm text-body-text block">
                  Sam Winchester
                </span>
                <span className="text-xs text-zinc-400 font-normal mt-0.5 block">
                  Primary Contact
                </span>
              </div>
              <Button
                onClick={() => handleMessageMember("Sam Winchester")}
                variant="outline"
                className="rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 px-6.5 h-8.5 cursor-pointer shadow-none transition-colors"
              >
                Message
              </Button>
            </div>

            {/* Contact 2 */}
            <div className="flex items-center justify-between font-dm-san-regular border-t border-zinc-100 pt-4">
              <div>
                <span className="font-semibold text-sm text-body-text block">
                  Mary Winchester
                </span>
                <span className="text-xs text-zinc-400 font-normal mt-0.5 block">
                  Secondary Contact
                </span>
              </div>
              <Button
                onClick={() => handleMessageMember("Mary Winchester")}
                variant="outline"
                className="rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 px-6.5 h-8.5 cursor-pointer shadow-none transition-colors"
              >
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-dm-san-regular text-body-text">
            Payment History
          </h3>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="rounded-lg border border-zinc-300 bg-white font-dm-san-regular font-normal text-xs text-body-text hover:bg-zinc-50 px-4 h-9 cursor-pointer shadow-none transition-colors gap-1.5"
          >
            <IconFileDownload className="size-4 text-zinc-500" />
            Export CSV
          </Button>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={MOCK_PAYMENTS}
          isPaginated={false}
        />
      </div>

    </div>
  )
}
