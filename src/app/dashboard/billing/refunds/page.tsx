"use client"

import React from "react"
import { useRouter } from "next/navigation"
import RefundsListView from "@/components/billing/refunds-list-view"

export default function RefundsDashboardPage() {
  const router = useRouter()

  const handleSelectRefund = (patientName: string) => {
    router.push(`/dashboard/billing/refunds/refund-details?name=${encodeURIComponent(patientName)}`)
  }

  return (
    <div className="w-full">
      <RefundsListView onSelectRefund={handleSelectRefund} />
    </div>
  )
}
