"use client"

import React, { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import RefundDetailView from "@/components/billing/refund-detail-view"

function RefundDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientName = searchParams.get("name") || "Dean Winchester"

  const handleBack = () => {
    router.push("/dashboard/billing/refunds")
  }

  return (
    <div className="w-full">
      <RefundDetailView
        patientName={patientName}
        onBack={handleBack}
      />
    </div>
  )
}

export default function RefundDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefundDetailsContent />
    </Suspense>
  )
}
