"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import PatientLoader from "@/components/patients/patients-list/loader"
import CreatePatientView from "@/components/patients/create-patient/create-patient-view"

export default function CreatePatientPage() {
  const params = useParams()
  const userId = params.userId as string

  return (
    <Suspense fallback={<PatientLoader />}>
      <CreatePatientView userId={userId} />
    </Suspense>
  )
}
