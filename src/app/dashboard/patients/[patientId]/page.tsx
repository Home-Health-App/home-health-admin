"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import PatientDetailsView from "@/components/patients/patient-details/patient-details-view"
import PatientDetailsSkeleton from "@/components/patients/patient-details/patient-details-skeleton"

export default function PatientDetailsPage() {
  const params = useParams()
  const patientId = params.patientId as string

  return (
    <Suspense fallback={<PatientDetailsSkeleton />}>
      <PatientDetailsView patientId={patientId} />
    </Suspense>
  )
}