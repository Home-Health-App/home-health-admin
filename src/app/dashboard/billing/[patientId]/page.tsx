"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import BillingDetail from "@/components/billing/billing-detail"

export default function PatientBillingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params?.patientId as string

  const handleBack = () => {
    router.push("/dashboard/billing")
  }

  return (
    <div className="w-full">
      <BillingDetail
        patientId={patientId}
        onBack={handleBack}
      />
    </div>
  )
}

