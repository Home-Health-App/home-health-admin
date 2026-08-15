import React, { Suspense } from "react"
import CaregiversListView from "@/components/caregivers/caregivers-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

export default function CaregiversPage() {
  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedListView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <CaregiversListView />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedListView />
    </Suspense>
  )
}