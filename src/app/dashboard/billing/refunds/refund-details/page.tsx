"use client"

import React, { useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
// import RefundDetailView from "@/components/billing/refund-detail-view"

function RefundDetailsContent() {
  const router = useRouter()
  // const searchParams = useSearchParams()
  // const patientName = searchParams.get("name") || "Dean Winchester"

  useEffect(() => {
    router.replace("/dashboard/billing")
  }, [router])

  /*
  const handleBack = () => {
    router.push("/dashboard/billing/refunds")
  }
  */

  return (
    /* Refund details page temporarily hidden
    <div className="w-full">
      <RefundDetailView
        patientName={patientName}
        onBack={handleBack}
      />
    </div>
    */
    null
  )
}

export default function RefundDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefundDetailsContent />
    </Suspense>
  )
}
