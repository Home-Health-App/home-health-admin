"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import CreateBillView from "@/components/patients/billing/create-bill-view"
import PatientLoader from "@/components/patients/patients-list/loader"

export default function CreateBillPage() {
  const params = useParams()
  const patientId = params.patientId as string

  return (
    <Suspense fallback={<PatientLoader />}>
      <CreateBillView patientId={patientId} />
    </Suspense>
  )
}
