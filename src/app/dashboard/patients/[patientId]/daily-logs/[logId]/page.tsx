import React, { Suspense } from "react"
import DailyLogTabsView from "@/components/patients/daily-logs/daily-log-tabs-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string; logId: string }>
}

export default async function DailyLogDetailsPage({ params }: PageProps) {
  const { patientId, logId } = await params

  // Awrapper component with 1.5s artificial delay for testing loading skeleton
  async function DelayedTabsView() {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return <DailyLogTabsView patientId={patientId} logId={logId} />
  }

  return (
    <Suspense fallback={<PatientLoader />}>
      <DelayedTabsView />
    </Suspense>
  )
}
