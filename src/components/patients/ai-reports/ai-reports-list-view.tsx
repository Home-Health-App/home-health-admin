"use client"

import React from "react"
import Link from "next/link"
import { IconDownload, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { MOCK_PATIENTS } from "../mock-data"

interface AiReportsListViewProps {
  patientId: string
}

export default function AiReportsListView({ patientId }: AiReportsListViewProps) {
  // Find current patient or fallback
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  const mockReports = [
    {
      id: "1",
      dateRange: "Jun 15 – Jun 21",
      generatedDate: "Generated June 22",
      summary:
        "Slight increase in resting heart rate observed on Tuesday and Wednesday evenings. Sleep quality scores remained stable at an average of 82%. Medication adherence is at 100%.",
    },
    {
      id: "2",
      dateRange: "Jun 15 – Jun 21",
      generatedDate: "Generated June 22",
      summary:
        "Slight increase in resting heart rate observed on Tuesday and Wednesday evenings. Sleep quality scores remained stable at an average of 82%. Medication adherence is at 100%.",
    },
    {
      id: "3",
      dateRange: "Jun 15 – Jun 21",
      generatedDate: "Generated June 22",
      summary:
        "Slight increase in resting heart rate observed on Tuesday and Wednesday evenings. Sleep quality scores remained stable at an average of 82%. Medication adherence is at 100%.",
    },
    {
      id: "4",
      dateRange: "Jun 15 – Jun 21",
      generatedDate: "Generated June 22",
      summary:
        "Slight increase in resting heart rate observed on Tuesday and Wednesday evenings. Sleep quality scores remained stable at an average of 82%. Medication adherence is at 100%.",
    },
  ]

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-[#2B2B2B]">
            AI Reports
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

        {/* Dropdown filter block */}
        <Button
          variant="outline"
          className="rounded-lg border border-zinc-200 shadow-none font-sans font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 hover:bg-zinc-50 cursor-pointer outline-hidden bg-white select-none self-start sm:self-auto"
        >
          <span>30 Days</span>
          <IconChevronDown className="size-4 opacity-75 text-body-text" />
        </Button>
      </div>

      {/* Grid List of Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockReports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs flex flex-col justify-between gap-6"
          >
            {/* Date Range & Generated Date */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-sans text-zinc-950">
                {report.dateRange}
              </h3>
              <span className="text-xs font-medium text-zinc-400 font-sans">
                {report.generatedDate}
              </span>
            </div>

            {/* Blurb Body */}
            <div className="bg-[#EEF2F6]/50 border border-[#EEF2F6] rounded-xl p-5">
              <p className="text-sm font-sans leading-relaxed text-body-text">
                {report.summary}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                render={
                  <Link href={`/dashboard/patients/${patientId}/ai-report/${report.id}`} />
                }
                className="rounded-full border border-[#648FCC] text-[#648FCC] hover:bg-[#648FCC]/5 font-sans font-semibold text-xs px-5 py-1.5 h-8.5 cursor-pointer outline-hidden shadow-none"
              >
                View Report
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-full border border-[#648FCC] p-2 hover:bg-[#648FCC]/5 size-8.5 flex items-center justify-center cursor-pointer outline-hidden shadow-none"
                >
                  <IconDownload className="size-4.5 text-[#648FCC]" />
                </Button>
                <Button className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-xs px-5 py-1.5 h-8.5 cursor-pointer outline-hidden border-none shadow-none">
                  Send to caregivers
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
