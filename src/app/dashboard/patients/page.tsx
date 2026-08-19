import React, { Suspense } from "react"
import PatientsView from "@/components/patients/patients-list/patients-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

// Simulates a 3-second data fetch delay to trigger Suspense fallback
async function DelayedPatientsView() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return <PatientsView />
}

export default function Patients() {
  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedPatientsView />
    </Suspense>
  )
}