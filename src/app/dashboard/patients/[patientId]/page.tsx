"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import PatientDetailsView from "@/components/patients/patient-details/patient-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

export default function PatientDetailsPage() {
  const params = useParams()
  const patientId = params.patientId as string

  return (
    <Suspense fallback={<PatientLoader />}>
      <PatientDetailsView patientId={patientId} />
    </Suspense>
  )
}