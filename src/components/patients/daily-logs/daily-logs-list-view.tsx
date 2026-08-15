"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { MOCK_PATIENTS } from "../mock-data"

interface DailyLogsListViewProps {
  patientId: string
}

export interface DailyLogEntry {
  id: string
  dateString: string
  caregiver: string
  flag: "Incident" | "No Issues" | "High BP"
}

const INITIAL_LOGS: DailyLogEntry[] = [
  { id: "1", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "Incident" },
  { id: "2", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
  { id: "3", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
  { id: "4", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "High BP" },
  { id: "5", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
  { id: "6", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
  { id: "7", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
  { id: "8", dateString: "Aug. 04 2026", caregiver: "Bobby Singer", flag: "No Issues" },
]

export default function DailyLogsListView({ patientId }: DailyLogsListViewProps) {
  const router = useRouter()
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]
  const [logs, setLogs] = useState<DailyLogEntry[]>(INITIAL_LOGS)

  const handleRowClick = (row: DailyLogEntry) => {
    router.push(`/dashboard/patients/${patientId}/daily-logs/22u26guqwwtq`)
  }

  const handleLoadMore = () => {
    const moreLogs: DailyLogEntry[] = [
      { id: String(logs.length + 1), dateString: "Aug. 03 2026", caregiver: "Bobby Singer", flag: "No Issues" },
      { id: String(logs.length + 2), dateString: "Aug. 03 2026", caregiver: "Bobby Singer", flag: "No Issues" },
      { id: String(logs.length + 3), dateString: "Aug. 03 2026", caregiver: "Bobby Singer", flag: "No Issues" },
      { id: String(logs.length + 4), dateString: "Aug. 03 2026", caregiver: "Bobby Singer", flag: "No Issues" },
    ]
    setLogs((prev) => [...prev, ...moreLogs])
  }

  const columns: ColumnDef<DailyLogEntry>[] = [
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
    {
      accessorKey: "flag",
      header: "Flags",
      meta: { align: "left" },
      cell: ({ getValue }) => {
        const val = getValue() as string
        let badgeColor = "bg-[#FAF0F0] text-[#C53929] border-[#F7C6C1]"
        if (val === "No Issues") {
          badgeColor = "bg-[#EBF3EF] text-[#2E7D32] border-[#D5E6DE]"
        }

        return (
          <span className={`inline-block border px-3.5 py-0.5 rounded-full text-xs font-normal font-dm-san-regular ${badgeColor}`}>
            {val}
          </span>
        )
      },
    },
  ]

  return (
    <div className="w-full space-y-6 pb-8 flex flex-col">
      {/* Top Header Section */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          Daily Logs
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-[#2B2B2B] font-dm-san-regular text-sm mt-1">
          <span>{patient.name}</span>
          <span className="text-zinc-300">•</span>
          <span>ID: {10000000 + Number(patient.id)}</span>
          <span className="text-zinc-300">•</span>
          <span>Registered: Aug. 5 2026</span>
          <span className="text-zinc-300">•</span>
          <span>Age: 66</span>
        </div>
      </div>

      {/* Reusable Data Table Component */}
      <DataTable
        columns={columns}
        data={logs}
        onRowClick={handleRowClick}
        // isPaginated={false}
      />

      {/* Load More Action Button */}
      {/* <button
        onClick={handleLoadMore}
        className="bg-[#E9C43F] hover:bg-[#d8b535] transition-colors text-zinc-900 font-dm-san-regular font-semibold text-sm px-6 py-3 rounded-[24px] cursor-pointer shadow-xs self-end mt-4 select-none outline-hidden"
      >
        Load More
      </button> */}
    </div>
  )
}
