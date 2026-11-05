"use client"

import React, { Suspense } from "react"
import PatientsView from "@/components/patients/patients-list/patients-list-view"
import PatientsListSkeleton from "@/components/patients/patients-list/patients-list-skeleton"
import { useSuspenseGetAdminPatients } from "@/hooks/patient.hook"

function PatientsDataContainer() {
  const { data: patientsData } = useSuspenseGetAdminPatients({
    limit: 100,
  })

  return <PatientsView patientsData={patientsData} />
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<PatientsListSkeleton />}>
      <PatientsDataContainer />
    </Suspense>
  )
}