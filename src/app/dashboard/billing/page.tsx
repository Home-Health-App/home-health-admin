"use client"

import React from "react"
import { useRouter } from "next/navigation"
import BillingOverview from "@/components/billing/billing-overview"

export default function BillingDashboardPage() {
  const router = useRouter()

  const handleSelectPatient = (patientId: string) => {
    router.push(`/dashboard/billing/${patientId}`)
  }

  const handleManagePlans = () => {
    router.push("/dashboard/billing/manage-plans")
  }

  return (
    <div className="w-full">
      <BillingOverview
        onSelectPatient={handleSelectPatient}
        onManagePlans={handleManagePlans}
      />
    </div>
  )
}