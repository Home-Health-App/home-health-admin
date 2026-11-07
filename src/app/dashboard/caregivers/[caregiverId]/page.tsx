"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import CaregiverDetailsView from "@/components/caregivers/caregiver-details-view"
import CaregiverDetailsSkeleton from "@/components/caregivers/caregiver-details-skeleton"

export default function CaregiverDetailsPage() {
  const params = useParams()
  const caregiverId = params.caregiverId as string

  return (
    <Suspense fallback={<CaregiverDetailsSkeleton />}>
      <CaregiverDetailsView caregiverId={caregiverId} />
    </Suspense>
  )
}

