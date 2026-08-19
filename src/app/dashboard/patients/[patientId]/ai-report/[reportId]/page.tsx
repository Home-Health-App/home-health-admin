import React, { Suspense } from "react"
import AiReportDetailsView from "@/components/patients/ai-reports/ai-report-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string; reportId: string }>
}

export default async function AiReportDetailsPage({ params }: PageProps) {
  const { patientId, reportId } = await params

  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedDetailsView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <AiReportDetailsView patientId={patientId} reportId={reportId} />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedDetailsView />
    </Suspense>
  )
}