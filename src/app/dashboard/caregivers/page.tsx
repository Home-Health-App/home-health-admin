import React, { Suspense } from "react"
import CaregiversListView from "@/components/caregivers/caregivers-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

export default function CaregiversPage() {


  return (
    <Suspense fallback={<PatientLoader />}>
      <CaregiversListView />
    </Suspense>
  )
}