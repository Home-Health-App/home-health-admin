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
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Refund Request Details
          </h1>
          <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1">
            {patientName} | ID: 12345678 | Registered: Aug. 5 2026 | Age: 66
          </p>
        </div>
      </div>

      {/* Detail request and Decision columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 items-start">
        
        {/* Left columns: Refund Request details */}
        <div className="md:col-span-2 bg-white rounded-[8px] p-6 shadow-3xs space-y-4">
          <div className="flex items-baseline justify-between pb-3">
            <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
              Refund Request
            </h3>
            <div className="flex items-center gap-1.5 font-dm-san-regular">
              <span className="text-sm text-body-text font-normal">Amount Requested</span>
              <span className="text-4xl font-bold text-body-text">$300</span>
            </div>
          </div>

          <div className="bg-secondary-light rounded-[8px] p-5 space-y-2.5 font-dm-san-regular text-sm text-body-text">
            <span className="font-bold block text-body-text text-base">Reason</span>
            <p className="font-normal text-base leading-relaxed text-body-text">
              I am requesting a refund because I was mistakenly charged twice for the same payment. This app is crucial for managing the care of my elderly mother, who relies on the caregivers coordinated through your platform. The duplicate charge has caused unnecessary financial strain, and I need this issue resolved promptly to continue trusting your service with my family's care needs.
            </p>
          </div>
        </div>

        {/* Right column: Decision Actions */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-3xs space-y-4 font-dm-san-regular">
          <div>
            <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">Decision</h3>
            <p className="text-base font-normal text-body-text mt-1 leading-relaxed">
              Review the request and supporting documents before making a decision.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Button
              onClick={handleApprove}
              className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold h-13 text-sm p-4 w-full border-none shadow-none cursor-pointer outline-hidden transition-colors"
            >
              Approve Refund
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-sm hover:bg-transparent text-secondary-color hover:text-secondary-color h-13 w-full cursor-pointer shadow-none transition-colors"
            >
              Deny Request
            </Button>
          </div>
        </div>

      </div>

      {/* Payment Reference Table Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
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
        <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
          Supporting Document
        </h3>

        {/* Attachment Card Box */}
        <div className="flex items-center justify-between border border-zinc-200/60 rounded-[8px] p-4.5 bg-white shadow-3xs max-w-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-light rounded-[8px]">
              <IconFileText className="size-7.5 text-body-text" />
            </div>
            <div>
              <span className="font-normal text-sm text-body-text block">
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
