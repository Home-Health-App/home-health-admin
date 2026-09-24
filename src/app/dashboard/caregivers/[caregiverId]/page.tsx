"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import CaregiverDetailsView from "@/components/caregivers/caregiver-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

export default function CaregiverDetailsPage() {
  const params = useParams()
  const caregiverId = params.caregiverId as string

  return (
    <Suspense fallback={<PatientLoader />}>
      <CaregiverDetailsView caregiverId={caregiverId} />
    </Suspense>
  )
}

