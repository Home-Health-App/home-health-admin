import React, { Suspense } from "react"
import DailyLogTabsView from "@/components/patients/daily-logs/daily-log-tabs-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string; logId: string }>
}

export default async function DailyLogDetailsPage({ params }: PageProps) {
  const { patientId, logId } = await params
  return <DailyLogTabsView patientId={patientId} logId={logId} />
}
