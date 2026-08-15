"use client"

import React, { useState, useMemo } from "react"
import { DataTable } from "@/components/shared/data-table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getRefundsColumns } from "./refunds-columns"

export interface RefundItem {
  id: string
  patient: string
  refundType: string
  reason: string
  status: "Approved" | "Pending" | "Denied"
}

interface RefundsListViewProps {
  onSelectRefund: (patientName: string) => void
}

const MOCK_REFUNDS: RefundItem[] = [
  {
    id: "1",
    patient: "Dean Winchester",
    refundType: "User Request",
    reason: "Duplicate charge for...",
    status: "Approved",
  },
  {
    id: "2",
    patient: "John Winchester",
    refundType: "User Request",
    reason: "Duplicate charge for...",
    status: "Pending",
  },
  {
    id: "3",
    patient: "Mary Winchester",
    refundType: "Admin Granted",
    reason: "Duplicate charge for...",
    status: "Approved",
  },
  {
    id: "4",
    patient: "Jody Mills",
    refundType: "User Request",
    reason: "Duplicate charge for...",
    status: "Pending",
  },
  {
    id: "5",
    patient: "Bubby Mane",
    refundType: "User Request",
    reason: "Duplicate charge for...",
    status: "Denied",
  },
]

export default function RefundsListView({
  onSelectRefund,
}: RefundsListViewProps) {
  const [timeframe, setTimeframe] = useState("30 Days")
  const [status, setStatus] = useState("All Statuses")
  const [refundType, setRefundType] = useState("All Refund Types")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const filteredRefunds = useMemo(() => {
    return MOCK_REFUNDS.filter((item) => {
      const matchesStatus = status === "All Statuses" || item.status === status
      const matchesType = refundType === "All Refund Types" || item.refundType === refundType
      return matchesStatus && matchesType
    })
  }, [status, refundType])

  const columns = useMemo(() => {
    return getRefundsColumns({
      onSelectRefund,
      activeDropdown,
      setActiveDropdown,
    })
  }, [onSelectRefund, activeDropdown])

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          Refunds
        </h1>
        <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
          Manage and process patient payment reversals.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <div className="flex items-center gap-3">
          {/* Timeframe */}
          <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
            <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[110px] shadow-none">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="30 Days">30 Days</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={status} onValueChange={(val) => setStatus(val!)}>
            <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[120px] shadow-none">
              <SelectValue placeholder="Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Statuses">All Statuses</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="Approved">Approved</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="Pending">Pending</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="Denied">Denied</SelectItem>
            </SelectContent>
          </Select>

          {/* Refund Type */}
          <Select value={refundType} onValueChange={(val) => setRefundType(val!)}>
            <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[160px] shadow-none">
              <SelectValue placeholder="Refund Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Refund Types">All Refund Types</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="User Request">User Request</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-xs" value="Admin Granted">Admin Granted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredRefunds}
        pageSize={5}
        isPaginated={true}
        onRowClick={(row) => onSelectRefund(row.patient)}
      />
    </div>
  )
}
