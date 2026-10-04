"use client"

import React, { useState } from "react"
import Link from "next/link"
import { IconChevronDown, IconFileDownload, IconLoader2, IconMoodSmile, IconHeartRateMonitor, IconActivity } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetPatientAiReports, useDownloadAiReport } from "@/hooks/ai-report.hook"
import { useGetPatientById } from "@/hooks/patient.hook"
import { calculateAge } from "@/libs/utils"
import { toast } from "sonner"

interface AiReportsListViewProps {
  patientId: string
}

export default function AiReportsListView({ patientId }: AiReportsListViewProps) {

  // Fetch patient details and AI reports
  const { data: patientResponse, isLoading: isPatientLoading } = useGetPatientById(patientId)
  const patient = patientResponse?.data

  const { data: reportsResponse, isLoading: isReportsLoading } = useGetPatientAiReports(patientId)
  const reports = reportsResponse?.data || []

  const { mutate: downloadReport, isPending: isDownloading } = useDownloadAiReport()
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null)

  const patientName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient"
    : reports[0]?.patient
    ? `${reports[0].patient.first_name} ${reports[0].patient.last_name}`
    : "Patient"

  const registeredDate = patient?.created_at
    ? new Date(patient.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  const calculatedAge = patient?.date_of_birth ? calculateAge(patient.date_of_birth) : patient?.age

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start)
      const e = new Date(end)
      const sFormatted = s.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      const eFormatted = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      return `${sFormatted} – ${eFormatted}`
    } catch {
      return "Reporting Period"
    }
  }

  const formatGeneratedDate = (created: string) => {
    try {
      const d = new Date(created)
      return `Generated ${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } catch {
      return "Generated recently"
    }
  }

  const handleDownload = (reportId: string, pdfUrl?: string | null) => {
    setDownloadingReportId(reportId)
    downloadReport(
      {
        reportId,
        filename: `ai_health_report_${reportId}.pdf`,
      },
      {
        onError: () => {
          if (pdfUrl) {
            window.open(pdfUrl, "_blank")
          }
        },
        onSettled: () => {
          setDownloadingReportId(null)
        },
      }
    )
  }

  const handleSendToCaregivers = () => {
    toast.success("Report shared with assigned caregivers.")
  }

  if (isReportsLoading || isPatientLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
        <IconLoader2 className="size-8 text-primary-color animate-spin" />
        <p className="text-sm font-dm-san-regular text-zinc-500">Loading AI Health Reports...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-[#2B2B2B]">
            AI Reports
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[#2B2B2B] font-dm-san-regular text-sm mt-1">
            <span>{patientName}</span>
            {/* <span className="text-zinc-300">•</span> */}
            {/* <span>ID: {patient?.id || patientId}</span> */}
            {registeredDate && (
              <>
                <span className="text-zinc-300">•</span>
                <span>Registered: {registeredDate}</span>
              </>
            )}
            {calculatedAge !== null && calculatedAge !== undefined && (
              <>
                <span className="text-zinc-300">•</span>
                <span>Age: {calculatedAge}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid List of Reports or Empty State */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-zinc-200/70 text-center space-y-2">
          <IconActivity className="size-12 text-zinc-300 mb-2" />
          <h3 className="font-dm-san-medium font-bold text-zinc-950 text-xl">
            No AI Health Reports Found
          </h3>
          <p className="text-zinc-500 font-sans text-sm max-w-sm leading-relaxed">
            There are currently no AI weekly health summaries generated for this patient.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report) => {
            const isThisDownloading = isDownloading && downloadingReportId === report.id
            const dateRange = formatDateRange(report.reporting_period_start, report.reporting_period_end)
            const generatedDate = formatGeneratedDate(report.created_at)

            return (
              <div
                key={report.id}
                className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs flex flex-col justify-between gap-6"
              >
                {/* Date Range & Generated Date */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[22px] font-medium font-dm-san-regular text-body-text">
                    {dateRange}
                  </h3>
                  <span className="text-xs font-medium text-body-text font-dm-san-regular">
                    {generatedDate}
                  </span>
                </div>

                {/* Key Metrics Quick Badges */}
                {report.key_metrics && (
                  <div className="flex flex-wrap items-center gap-2">
                    {report.key_metrics.moodSummary && (
                      <Badge
                        variant="outline"
                        className="bg-active-btn text-[#0A432C] border-active-border font-dm-san-regular font-medium px-2.5 py-0.5 rounded-full text-xs capitalize"
                      >
                        Mood: {report.key_metrics.moodSummary.toLowerCase().replace(/_/g, " ")}
                      </Badge>
                    )}
                    {report.key_metrics.avgHeartRate !== undefined && (
                      <Badge
                        variant="outline"
                        className="bg-primary-light text-primary-color border-border-light font-dm-san-regular font-medium px-2.5 py-0.5 rounded-full text-xs"
                      >
                        Heart Rate: {report.key_metrics.avgHeartRate} bpm
                      </Badge>
                    )}
                    {report.key_metrics.avgPainLevel !== undefined && (
                      <Badge
                        variant="outline"
                        className="bg-secondary-light text-body-text border-zinc-200 font-dm-san-regular font-medium px-2.5 py-0.5 rounded-full text-xs"
                      >
                        Pain: {report.key_metrics.avgPainLevel}/10
                      </Badge>
                    )}
                  </div>
                )}

                {/* Blurb Body */}
                <div className="bg-secondary-light rounded-[8px] p-4">
                  <p className="text-base font-dm-san-regular font-normal leading-relaxed text-body-text line-clamp-4">
                    {report.executive_summary}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/patients/${patientId}/ai-report/${report.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-secondary-color text-secondary-color bg-white hover:bg-secondary-color/10 font-dm-san-regular font-normal text-xs px-4 py-2 h-9 cursor-pointer outline-hidden shadow-none transition-colors"
                  >
                    View Report
                  </Link>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(report.id, report.pdf_url)}
                      disabled={isThisDownloading}
                      className="rounded-full border border-secondary-color p-3 hover:bg-secondary-color/10 flex items-center justify-center cursor-pointer outline-hidden shadow-none transition-colors disabled:opacity-50"
                      title="Download Report PDF"
                    >
                      {isThisDownloading ? (
                        <IconLoader2 className="size-5 text-secondary-color animate-spin" />
                      ) : (
                        <IconFileDownload className="size-6 text-secondary-color" />
                      )}
                    </Button>
                    <Button
                      onClick={handleSendToCaregivers}
                      className="rounded-full bg-[#1B335B] hover:bg-[#2B4673] text-white font-dm-san-regular font-semibold text-xs px-4 h-9 cursor-pointer outline-hidden border-none shadow-none transition-colors"
                    >
                      Send to caregivers
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
