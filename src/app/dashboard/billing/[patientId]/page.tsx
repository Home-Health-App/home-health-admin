"use client"

import React, { use } from "react"
import { useRouter } from "next/navigation"
import BillingDetail from "@/components/billing/billing-detail"

interface PatientBillingDetailPageProps {
  params: Promise<{ patientId: string }>
}

const PATIENT_LOOKUP: Record<string, string> = {
  "12345678": "Dean Winchester",
  "87654321": "John Winchester",
  "11223344": "Mary Winchester",
  "55667788": "Jody Mills",
  "99001122": "Bubby Mane",
}

export default function PatientBillingDetailPage({ params }: PatientBillingDetailPageProps) {
  const router = useRouter()
  const { patientId } = use(params)

  const patientName = PATIENT_LOOKUP[patientId] || "Dean Winchester"

  const handleBack = () => {
    router.push("/dashboard/billing")
  }

  return (
    <div className="w-full">
      <BillingDetail
        patientName={patientName}
        onBack={handleBack}
      />
    </div>
  )
}
