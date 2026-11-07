import React, { Suspense } from "react"
import DailyLogsListView from "@/components/patients/daily-logs/daily-logs-list-view"
import DailyLogsListSkeleton from "@/components/patients/daily-logs/daily-logs-list-skeleton"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function DailyLogsPage({ params }: PageProps) {
  const { patientId } = await params

  return <DailyLogsListView patientId={patientId} />
}