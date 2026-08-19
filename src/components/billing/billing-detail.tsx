"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { IconArrowLeft, IconFileDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { getBillingDetailColumns, PaymentItem } from "./billing-detail-columns"
import { Badge } from "../ui/badge"

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
}: BillingDetailProps) {
  
  const router = useRouter()

  const handleOverrideSubscription = () => {
    alert(`Override Subscription clicked for ${patientName}`)
  }

  const handleMessageMember = (memberName: string) => {
    router.push("/dashboard/messages")
  }

  const handleExportCSV = () => {
    alert("Export CSV clicked")
  }

  const handleRefundTransaction = (payment: PaymentItem) => {
    router.push("/dashboard/billing/refunds")
  }

  const columns = useMemo<ColumnDef<PaymentItem>[]>(
    () =>
      getBillingDetailColumns({
        onRefund: handleRefundTransaction,
        onMessage: handleMessageMember,
      }),
    []
  )

  return (
    <div className="w-full space-y-8 pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2.5">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              {patientName}
            </h1>
            <p className="text-body-text font-dm-san-regular font-normal mt-1 text-sm">
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
        <div className="space-y-4 bg-white rounded-[8px] p-6">
          <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
            Subscription Info
          </h3>

          <div className="space-y-3.5 font-dm-san-regular text-sm text-body-text">
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Status</span>
              <Badge className="inline-block border border-active-border bg-active-btn text-[#0A432C] px-2.5 py-0.5 text-2xs font-normal rounded-full select-none">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Plan Amount</span>
              <span className="font-normal text-body-text text-base">$200/month</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Care Category</span>
              <span className="font-normal text-body-text text-base">Elderly Care</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Tier</span>
              <span className="font-normal text-body-text text-base">Bronze</span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Paid Date</span>
              <span className="font-normal text-body-text text-base">Aug. 06, 2026</span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-100 pb-3">
              <span className="font-bold text-body-text text-sm">Next Renewal</span>
              <span className="font-normal text-body-text text-base">Sept. 06, 2026</span>
            </div>
          </div>
        </div>

        {/* Col 2: Family Members */}
        <div className="space-y-4 bg-white rounded-[8px] p-6">
          <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
            Family Members
          </h3>

          <div className="space-y-4">
            {/* Contact 1 */}
            <div className="flex items-center justify-between font-dm-san-regular">
              <div>
                <span className="font-normal text-base text-body-text block">
                  Sam Winchester
                </span>
                <span className="text-xs text-body-text font-normal mt-0.5 block">
                  Primary Contact
                </span>
              </div>
              <Button
                onClick={() => handleMessageMember("Sam Winchester")}
                variant="outline"
                className="rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:text-secondary-color hover:bg-transparent p-3 cursor-pointer shadow-none transition-colors"
              >
                Message
              </Button>
            </div>

            {/* Contact 2 */}
            <div className="flex items-center justify-between font-dm-san-regular pt-4">
              <div>
                <span className="font-normal text-base text-body-text block">
                  Mary Winchester
                </span>
                <span className="text-xs text-body-text font-normal mt-0.5 block">
                  Secondary Contact
                </span>
              </div>
              <Button
                onClick={() => handleMessageMember("Mary Winchester")}
                variant="outline"
                className="rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:text-secondary-color hover:bg-transparent p-3 cursor-pointer shadow-none transition-colors"
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
            className="rounded-full border border-secondary-color bg-transparent hover:text-secondary-color font-dm-san-regular font-normal text-xs text-secondary-color hover:bg-transparent px-3 py-2 cursor-pointer shadow-none transition-colors gap-1.5"
          >
            <IconFileDownload className="size-6 text-secondary-color" />
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
