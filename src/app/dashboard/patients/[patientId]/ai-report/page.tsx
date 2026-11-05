import React from "react"
import AiReportsListView from "@/components/patients/ai-reports/ai-reports-list-view"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function AiReportsPage({ params }: PageProps) {
  const { patientId } = await params

  return <AiReportsListView patientId={patientId} />
}
