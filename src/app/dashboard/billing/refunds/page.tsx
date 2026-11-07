"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
// import RefundsListView from "@/components/billing/refunds-list-view"

export default function RefundsDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/billing")
  }, [router])

  /*
  const handleSelectRefund = (patientName: string) => {
    router.push(`/dashboard/billing/refunds/refund-details?name=${encodeURIComponent(patientName)}`)
  }
  */

  return (
    /* Refunds page temporarily hidden
    <div className="w-full">
      <RefundsListView onSelectRefund={handleSelectRefund} />
    </div>
    */
    null
  )
}
