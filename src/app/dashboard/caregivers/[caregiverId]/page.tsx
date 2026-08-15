import React, { Suspense } from "react"
import CaregiverDetailsView from "@/components/caregivers/caregiver-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ caregiverId: string }>
}

export default async function CaregiverDetailsPage({ params }: PageProps) {
  const { caregiverId } = await params

  return <CaregiverDetailsView caregiverId={caregiverId} />
}
