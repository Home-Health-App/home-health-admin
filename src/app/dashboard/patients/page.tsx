"use client"

import React, { Suspense } from "react"
import PatientsView from "@/components/patients/patients-list/patients-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"
import { useSuspenseGetAdminPatients } from "@/hooks/patient.hook"

function PatientsDataContainer() {
  const { data: patientsData } = useSuspenseGetAdminPatients({
    limit: 100,
  })

  return <PatientsView patientsData={patientsData} />
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<PatientLoader />}>
      <PatientsDataContainer />
    </Suspense>
  )
}