import React, { Suspense } from "react"
import AiReportsListView from "@/components/patients/ai-reports/ai-reports-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function AiReportsPage({ params }: PageProps) {
  const { patientId } = await params

  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedListView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <AiReportsListView patientId={patientId} />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedListView />
    </Suspense>
  )
}