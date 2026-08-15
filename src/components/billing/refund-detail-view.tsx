"use client"

import React, { useMemo } from "react"
import { IconArrowLeft, IconDots, IconFileText, IconFileDownload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"

interface PaymentReferenceItem {
  reference: string
  amount: string
  date: string
  method: string
}

interface RefundDetailViewProps {
  patientName: string
  onBack: () => void
}

const MOCK_REFERENCE: PaymentReferenceItem[] = [
  {
    reference: "PM-26-89A1",
    amount: "$200",
    date: "Aug. 5 2026",
    method: "Card Payment",
  },
]

export default function RefundDetailView({
  patientName,
  onBack,
}: RefundDetailViewProps) {
  
  const handleApprove = () => {
    alert("Refund approved successfully")
  }

  const handleDeny = () => {
    alert("Refund request denied")
  }

  const handleDownloadAttachment = () => {
    alert("Downloading attachment: receiptscan.pdf")
  }

  const columns = useMemo<ColumnDef<PaymentReferenceItem>[]>(() => [
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
  ], [])

  return (
    <div className="w-full space-y-8 pb-12 select-none">
      
      {/* Back button and page title header */}
      <div className="space-y-2.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#648FCC] hover:text-[#5277a8] transition-colors cursor-pointer outline-hidden border-none bg-transparent"
        >
          <IconArrowLeft className="size-4" />
          Back to Refunds
        </button>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Refund Request Details
          </h1>
          <p className="text-xs font-normal font-dm-san-regular text-zinc-400 mt-1">
            {patientName} | ID: 12345678 | Registered: Aug. 5 2026 | Age: 66
          </p>
        </div>
      </div>

      {/* Detail request and Decision columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 items-start">
        
        {/* Left columns: Refund Request details */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-baseline justify-between border-b border-zinc-100 pb-2">
            <h3 className="text-lg font-bold font-dm-san-regular text-body-text">
              Refund Request
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 font-normal">Amount Requested</span>
              <span className="text-2xl font-bold text-body-text font-dm-san-regular">$300</span>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/50 rounded-[8px] p-5 space-y-2.5 font-dm-san-regular text-sm text-body-text">
            <span className="font-semibold block text-body-text">Reason</span>
            <p className="font-normal leading-relaxed text-zinc-600">
              I am requesting a refund because I was mistakenly charged twice for the same payment. This app is crucial for managing the care of my elderly mother, who relies on the caregivers coordinated through your platform. The duplicate charge has caused unnecessary financial strain, and I need this issue resolved promptly to continue trusting your service with my family's care needs.
            </p>
          </div>
        </div>

        {/* Right column: Decision Actions */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-3xs space-y-4 font-dm-san-regular">
          <div>
            <h3 className="text-base font-bold text-body-text">Decision</h3>
            <p className="text-xs font-normal text-zinc-400 mt-1 leading-relaxed">
              Review the request and supporting documents before making a decision.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Button
              onClick={handleApprove}
              className="rounded-[8px] bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs py-2.5 w-full border-none shadow-none cursor-pointer outline-hidden transition-colors"
            >
              Approve Refund
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="rounded-[8px] border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 py-2.5 w-full cursor-pointer shadow-none transition-colors"
            >
              Deny Request
            </Button>
          </div>
        </div>

      </div>

      {/* Payment Reference Table Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-lg font-bold font-dm-san-regular text-body-text">
          Payment Reference
        </h3>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={MOCK_REFERENCE}
          isPaginated={false}
        />
      </div>

      {/* Supporting Document Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100 font-dm-san-regular">
        <h3 className="text-lg font-bold text-body-text">
          Supporting Document
        </h3>

        {/* Attachment Card Box */}
        <div className="flex items-center justify-between border border-zinc-200/60 rounded-[8px] p-4.5 bg-white shadow-3xs max-w-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-50 rounded-lg">
              <IconFileText className="size-6 text-zinc-500" />
            </div>
            <div>
              <span className="font-semibold text-sm text-body-text block">
                receiptscan.pdf
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadAttachment}
            className="p-2 hover:bg-zinc-50 rounded-full cursor-pointer outline-hidden transition-colors border-none bg-transparent"
          >
            <IconFileDownload className="size-5 text-zinc-500 hover:text-zinc-600" />
          </button>
        </div>
      </div>

    </div>
  )
}
