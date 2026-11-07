"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { useGetPatientById, useGetPatientDailyLogs } from "@/hooks/patient.hook"
import { DailyLogType } from "@/types/daily-log.type"
import { formatDate } from "@/libs/helper"
import DailyLogsListSkeleton from "./daily-logs-list-skeleton"

interface DailyLogsListViewProps {
  patientId: string
}

export interface DailyLogTableRow {
  id: string
  dateString: string
  caregiver: string
  rawLog: DailyLogType
}

export default function DailyLogsListView({ patientId }: DailyLogsListViewProps) {
  const router = useRouter()

  const { data: patientResponse, isLoading: isPatientLoading } = useGetPatientById(patientId)
  const patient = patientResponse?.data

  const { data: dailyLogsResponse, isLoading: isLogsLoading } = useGetPatientDailyLogs(patientId)
  const logs = dailyLogsResponse?.data || []

  const caregiverName = patient?.caregiver
    ? `${patient.caregiver.first_name || ""} ${patient.caregiver.last_name || ""}`.trim()
    : "Unassigned"

  const patientFullName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
    : "Patient"

  const registrationDate = patient?.created_at
    ? formatDate(patient.created_at, "MMM. d yyyy")
    : "N/A"

  const tableData: DailyLogTableRow[] = useMemo(() => {
    return logs.map((log) => ({
      id: log.id,
      dateString: formatDate(log.date || log.created_at, "MMM. dd yyyy") || "N/A",
      caregiver: caregiverName,
      rawLog: log,
    }))
  }, [logs, caregiverName])

  const handleRowClick = (row: DailyLogTableRow) => {
    router.push(`/dashboard/patients/${patientId}/daily-logs/${row.id}`)
  }

  const columns: ColumnDef<DailyLogTableRow>[] = [
    {
      accessorKey: "dateString",
      header: "Date",
      meta: { align: "left" },
      cell: ({ getValue }) => (
        <span className="text-base font-dm-san-regular font-normal text-body-text">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "caregiver",
      header: "Caregiver",
      meta: { align: "left" },
      cell: ({ getValue }) => (
        <span className="text-base font-dm-san-regular font-normal text-body-text">
          {getValue() as string}
        </span>
      ),
    },
  ]

  if (isPatientLoading && isLogsLoading) {
    return <DailyLogsListSkeleton />
  }

  return (
    <div className="w-full space-y-6 pb-8 flex flex-col">
      {/* Top Header Section */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          Daily Logs
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-body-text font-dm-san-regular text-sm mt-1">
          <span>{patientFullName}</span>
          {/* <span className="text-zinc-300">•</span>
          <span>ID: {patient?.id || patientId}</span> */}
          <span className="text-zinc-300">•</span>
          <span>Registered: {registrationDate}</span>
          <span className="text-zinc-300">•</span>
          <span>Age: {patient?.age ?? "N/A"}</span>
        </div>
      </div>

      {/* Reusable Data Table Component */}
      <DataTable
        columns={columns}
        data={tableData}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
