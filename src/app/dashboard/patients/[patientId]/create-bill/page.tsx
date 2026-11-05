"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import CreateBillView from "@/components/patients/billing/create-bill-view"
import CreateBillSkeleton from "@/components/patients/billing/create-bill-skeleton"

export default function CreateBillPage() {
  const params = useParams()
  const patientId = params.patientId as string

  return (
    <Suspense fallback={<CreateBillSkeleton />}>
      <CreateBillView patientId={patientId} />
    </Suspense>
  )
}
