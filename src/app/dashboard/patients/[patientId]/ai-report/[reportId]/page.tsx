import React from "react"
import AiReportDetailsView from "@/components/patients/ai-reports/ai-report-details-view"

interface PageProps {
  params: Promise<{ patientId: string; reportId: string }>
}

export default async function AiReportDetailsPage({ params }: PageProps) {
  const { patientId, reportId } = await params

  return <AiReportDetailsView patientId={patientId} reportId={reportId} />
}