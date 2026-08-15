import React, { Suspense } from "react"
import CaregiverDetailsView from "@/components/caregivers/caregiver-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ caregiverId: string }>
}

export default async function CaregiverDetailsPage({ params }: PageProps) {
  const { caregiverId } = await params

  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedDetailsView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <CaregiverDetailsView caregiverId={caregiverId} />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedDetailsView />
    </Suspense>
  )
}
