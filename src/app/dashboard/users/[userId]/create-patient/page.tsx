"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import CreatePatientSkeleton from "@/components/patients/create-patient/create-patient-skeleton"
import CreatePatientView from "@/components/patients/create-patient/create-patient-view"

export default function CreatePatientPage() {
  const params = useParams()
  const userId = params.userId as string

  return (
    <Suspense fallback={<CreatePatientSkeleton />}>
      <CreatePatientView userId={userId} />
    </Suspense>
  )
}
