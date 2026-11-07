import React, { Suspense } from "react"
import FamilyMemberView from "@/components/patients/family-member/family-member-view"
import FamilyMemberSkeleton from "@/components/patients/family-member/family-member-skeleton"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function FamilyMemberDetailPage({ params }: PageProps) {
  const { patientId } = await params

  return <FamilyMemberView patientId={patientId} />
}