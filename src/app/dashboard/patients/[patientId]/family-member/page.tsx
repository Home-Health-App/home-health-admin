import React, { Suspense } from "react"
import FamilyMemberView from "@/components/patients/family-member/family-member-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function FamilyMemberDetailPage({ params }: PageProps) {
  const { patientId } = await params

  return <FamilyMemberView patientId={patientId} />
}