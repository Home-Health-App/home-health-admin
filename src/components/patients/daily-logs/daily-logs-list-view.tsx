"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/shared/data-table"
import { MOCK_PATIENTS } from "../mock-data"

interface DailyLogsListViewProps {
  patientId: string
}

export interface DailyLogEntry {
  id: string // alphanumeric e.g. "22u26guqwwtq"
  dateString: string // e.g. "Aug 05, 2026"
  recordedBy: string
  vitals: string
  medications: string
  symptoms: string
  mood: string
}

const MOCK_LOGS: DailyLogEntry[] = [
  {
    id: "22u26guqwwtq",
    dateString: "Aug 05, 2026",
    recordedBy: "Bobby Singer",
    vitals: "Recorded",
    medications: "Metformin, Lisinopril",
    symptoms: "Shortness of Breath, Nausea",
    mood: "Sad",
  },
  {
    id: "19p83xyzabcq",
    dateString: "Aug 04, 2026",
    recordedBy: "Bobby Singer",
    vitals: "Recorded",
    medications: "Metformin, Lisinopril",
    symptoms: "None",
    mood: "Positive",
  },
  {
    id: "12a90klmnoqr",
    dateString: "Aug 03, 2026",
    recordedBy: "Bobby Singer",
    vitals: "Recorded",
    medications: "Metformin",
    symptoms: "Fatigue",
    mood: "Neutral",
  },
]

export default function DailyLogsListView({ patientId }: DailyLogsListViewProps) {
  const router = useRouter()
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  const columns: ColumnDef<DailyLogEntry>[] = [
    {
      accessorKey: "dateString",
      header: "Date",
      meta: { align: "left" },
      cell: ({ getValue }) => (
        <span className="font-dm-san-medium font-semibold text-body-text text-sm">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "recordedBy",
      header: "Recorded By",
      meta: { align: "left" },
      cell: ({ getValue }) => (
        <span className="text-body-text text-sm font-sans">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "vitals",
      header: "Vitals Status",
      meta: { align: "left" },
      cell: ({ getValue }) => {
        const val = getValue() as string
        return (
          <Badge
            variant="outline"
            className="bg-active-btn text-active-border border-active-border/20 font-sans font-medium px-4 py-0.5 rounded-full shadow-none text-xs"
          >
            {val}
          </Badge>
        )
      },
    },
    {
      accessorKey: "medications",
      header: "Medications",
      meta: { align: "left" },
      cell: ({ getValue }) => (
        <span className="text-body-text text-sm font-sans max-w-[200px] truncate block">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "symptoms",
      header: "Symptoms",
      meta: { align: "left" },
      cell: ({ getValue }) => {
        const val = getValue() as string
        if (val === "None") {
          return (
            <span className="text-zinc-400 text-sm font-sans italic">
              None
            </span>
          )
        }
        return (
          <span className="text-zinc-900 font-semibold text-sm font-sans max-w-[220px] truncate block">
            {val}
          </span>
        )
      },
    },
    {
      accessorKey: "mood",
      header: "Mood",
      meta: { align: "center" },
      cell: ({ getValue }) => {
        const val = getValue() as string
        let emoji = "😊"
        let badgeClass = "bg-active-btn text-active-border border-active-border/20"
        if (val === "Sad") {
          emoji = "😞"
          badgeClass = "bg-warning-btn text-warning-border border-warning-border/20"
        } else if (val === "Neutral") {
          emoji = "😐"
          badgeClass = "bg-[#FDF6E2] text-pending-border border-pending-border/20"
        }
        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`${badgeClass} font-sans font-medium px-3.5 py-0.5 rounded-full shadow-none text-xs flex items-center gap-1`}
            >
              <span>{emoji}</span>
              <span>{val}</span>
            </Badge>
          </div>
        )
      },
    },
  ]

  const handleRowClick = (row: DailyLogEntry) => {
    router.push(`/dashboard/patients/${patientId}/daily-logs/${row.id}`)
  }

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Top Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-900">
          Daily Logs
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 font-sans text-sm mt-1">
          <span>{patient.name}</span>
          <span className="text-zinc-300">•</span>
          <span>ID: {10000000 + Number(patient.id)}</span>
          <span className="text-zinc-300">•</span>
          <span>Registered: Aug. 5 2026</span>
          <span className="text-zinc-300">•</span>
          <span>Age: 66</span>
        </div>
      </div>

      {/* Directory Table component */}
      <DataTable
        columns={columns}
        data={MOCK_LOGS}
        onRowClick={handleRowClick}
        pageSize={6}
      />
    </div>
  )
}
