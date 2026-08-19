import React, { Suspense } from "react"
import AiReportsListView from "@/components/patients/ai-reports/ai-reports-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function AiReportsPage({ params }: PageProps) {
  const { patientId } = await params

  return <AiReportsListView patientId={patientId} />
}