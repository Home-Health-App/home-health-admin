import React, { Suspense } from "react"
import DailyLogsListView from "@/components/patients/daily-logs/daily-logs-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function DailyLogsPage({ params }: PageProps) {
  const { patientId } = await params

  return <DailyLogsListView patientId={patientId} />
}