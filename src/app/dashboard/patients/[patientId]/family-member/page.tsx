import React, { Suspense } from "react"
import FamilyMemberView from "@/components/patients/family-member/family-member-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function FamilyMemberDetailPage({ params }: PageProps) {
  const { patientId } = await params

  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedFamilyView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <FamilyMemberView patientId={patientId} />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedFamilyView />
    </Suspense>
  )
}