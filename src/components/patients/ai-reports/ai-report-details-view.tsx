"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  IconChevronDown,
  IconChevronLeft,
  IconFileDownload,
  IconLoader2,
  IconMoodSmile,
  IconActivity,
  IconCheck,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, Cell, XAxis, PieChart, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  useGetPatientAiReports,
  useGetAiReportById,
  useDownloadAiReport,
} from "@/hooks/ai-report.hook"
import { useGetPatientById } from "@/hooks/patient.hook"
import { toast } from "sonner"

interface AiReportDetailsViewProps {
  patientId: string
  reportId: string
}

const heartRateConfig = {
  stable: { label: "Stable", color: "#648FCC" },
  unstable: { label: "Unstable", color: "#0B1F41" },
}

const painLevelConfig = {
  stable: { label: "Stable", color: "#648FCC" },
  unstable: { label: "Unstable", color: "#0B1F41" },
}

const pieConfig = {
  adhered: { label: "Adhered", color: "#3AC485" },
  temp: { label: "Temp", color: "#648FCC" },
  fixed: { label: "Fixed", color: "#EEF2F6" },
}

// Fallback weekly chart bars
const heartRateData = [
  { day: "Mon", value: 70, status: "stable" },
  { day: "Tue", value: 74, status: "stable" },
  { day: "Wed", value: 71, status: "stable" },
  { day: "Thu", value: 89, status: "unstable" },
  { day: "Fri", value: 72, status: "stable" },
  { day: "Sat", value: 71, status: "stable" },
  { day: "Sun", value: 73, status: "stable" },
]

const painLevelData = [
  { day: "Mon", value: 2, status: "stable" },
  { day: "Tue", value: 3, status: "stable" },
  { day: "Wed", value: 2, status: "stable" },
  { day: "Thu", value: 6, status: "unstable" },
  { day: "Fri", value: 3, status: "stable" },
  { day: "Sat", value: 2, status: "stable" },
  { day: "Sun", value: 2, status: "stable" },
]

export default function AiReportDetailsView({ patientId, reportId }: AiReportDetailsViewProps) {
  const [filterPeriod, setFilterPeriod] = useState("30 Days")

  // Fetch report details by ID
  const {
    data: singleReportResponse,
    isLoading: isSingleReportLoading,
  } = useGetAiReportById(reportId)

  // Fallback to patient reports list if single report not returned
  const {
    data: reportsResponse,
    isLoading: isReportsListLoading,
  } = useGetPatientAiReports(patientId)

  // Fetch patient details
  const { data: patientResponse, isLoading: isPatientLoading } = useGetPatientById(patientId)

  const report =
    singleReportResponse?.data ||
    reportsResponse?.data?.find((r) => r.id === reportId) ||
    reportsResponse?.data?.[0]

  const patient = report?.patient || patientResponse?.data

  const isLoading = !report && (isSingleReportLoading || isReportsListLoading || isPatientLoading)

  // Download mutation
  const { mutate: downloadReport, isPending: isDownloading } = useDownloadAiReport()

  const patientName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient"
    : report?.patient
    ? `${report.patient.first_name} ${report.patient.last_name}`
    : "Patient"

  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return "Reporting Period"
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

  const formatMood = (moodSummary?: string) => {
    if (!moodSummary) return { label: "Positive", emoji: "😊" }
    const upper = moodSummary.toUpperCase().trim()
    if (upper === "HAPPY" || upper === "VERY_HAPPY" || upper === "POSITIVE") {
      return {
        label: moodSummary.charAt(0).toUpperCase() + moodSummary.slice(1).toLowerCase(),
        emoji: "😊",
      }
    }
    if (upper === "NEUTRAL") {
      return { label: "Neutral", emoji: "😐" }
    }
    if (upper === "SAD" || upper === "NEGATIVE") {
      return { label: "Low", emoji: "😔" }
    }
    if (upper === "ANXIOUS") {
      return { label: "Anxious", emoji: "😟" }
    }
    return {
      label: moodSummary.charAt(0).toUpperCase() + moodSummary.slice(1).toLowerCase(),
      emoji: "😊",
    }
  }

  const handleDownload = () => {
    if (!report?.id) return
    downloadReport(
      {
        reportId: report.id,
        filename: `ai_health_report_${patientName.replace(/\s+/g, "_")}_${report.id}.pdf`,
      },
      {
        onError: () => {
          if (report.pdf_url) {
            window.open(report.pdf_url, "_blank")
          }
        },
      }
    )
  }

  const handleSendToCaregivers = () => {
    toast.success("Report shared with assigned caregivers.")
  }

  if (isLoading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
        <IconLoader2 className="size-8 text-primary-color animate-spin" />
        <p className="text-sm font-dm-san-regular text-body-text/70">Loading AI Health Report...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-zinc-200/70 text-center">
        <IconActivity className="size-12 text-zinc-300" />
        <div>
          <h3 className="text-xl font-bold font-dm-san-regular text-heading-text">Report Not Found</h3>
          <p className="text-sm text-zinc-500 font-dm-san-regular mt-1">
            Could not locate the requested AI health report for this patient.
          </p>
        </div>
        <Link
          href={`/dashboard/patients/${patientId}/ai-report`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-dm-san-regular text-primary-color bg-primary-light px-4 py-2 rounded-lg hover:bg-primary-light/80 transition-colors"
        >
          <IconChevronLeft className="size-4" />
          Back to AI Reports
        </Link>
      </div>
    )
  }

  const moodInfo = formatMood(report.key_metrics?.moodSummary)


  const adherencePercentage = report.medication_adherence?.overallPercentage ?? 100
  const adherenceRemainder = Math.max(0, 100 - adherencePercentage)
  const medicationPieData = [
    { name: "adhered", value: adherencePercentage, fill: "var(--color-adhered)" },
    { name: "fixed", value: adherenceRemainder, fill: "var(--color-fixed)" },
  ]

  const symptoms = report.symptom_analysis || []
  const recommendations = report.ai_recommendations || []
  const medicationItems = report.medication_adherence?.items || []

  // Format executive summary paragraphs
  const summaryParagraphs = report.executive_summary
    ? report.executive_summary.split("\n\n").filter(Boolean)
    : ["No executive summary available for this reporting period."]

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Navigation & Breadcrumb */}
      <div>
        <Link
          href={`/dashboard/patients/${patientId}/ai-report`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-heading-text mb-3 transition-colors"
        >
          <IconChevronLeft className="size-4" />
          <span>Back to AI Reports</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              AI Health Report
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-body-text font-dm-san-regular text-sm mt-1">
              <span className="font-semibold">{patientName}</span>
              <span className="text-zinc-300">•</span>
              <span>
                Reporting Period: {formatDateRange(report.reporting_period_start, report.reporting_period_end)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
              className="rounded-lg border border-zinc-200 shadow-none font-dm-san-regular font-semibold text-xs text-body-text flex items-center gap-2 px-4 h-9.5 hover:bg-zinc-50 cursor-pointer outline-hidden bg-white select-none disabled:opacity-50"
            >
              {isDownloading ? (
                <IconLoader2 className="size-4 animate-spin text-zinc-600" />
              ) : (
                <IconFileDownload className="size-4 text-zinc-600" />
              )}
              <span>Download PDF</span>
            </Button>

            {/* <Button
              onClick={handleSendToCaregivers}
              className="rounded-lg bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs px-4 h-9.5 cursor-pointer outline-hidden border-none shadow-none transition-colors"
            >
              Send to caregivers
            </Button>

            <Button
              variant="outline"
              className="rounded-lg border border-zinc-200 shadow-none font-dm-san-regular font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 hover:bg-zinc-50 cursor-pointer outline-hidden bg-white select-none"
            >
              <span>{filterPeriod}</span>
              <IconChevronDown className="size-4 opacity-75 text-body-text" />
            </Button> */}
          </div>
        </div>
      </div>

      {/* Main Grid: Executive Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Executive Summary (Grid span 2) */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs space-y-4">
          <h2 className="text-[22px] font-dm-san-regular text-heading-text border-b border-zinc-100 pb-2">
            Executive Summary
          </h2>
          <div className="text-sm font-dm-san-regular leading-relaxed text-body-text space-y-4">
            {summaryParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* AI Recommendations (Grid span 1) */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs space-y-4">
          <h2 className="text-[22px] font-dm-san-regular text-heading-text border-b border-zinc-100 pb-2">
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <p className="text-sm text-zinc-500 font-dm-san-regular italic">
                No active recommendations recorded for this period.
              </p>
            ) : (
              recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-secondary-light border border-l-2 border-l-secondary-color rounded-[8px] text-base font-dm-san-regular font-normal leading-relaxed text-body-text"
                >
                  {rec}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Section: Key Metrics */}
      <div className="space-y-6 bg-white p-6 rounded-[8px]">
        <h2 className="text-[22px] font-dm-san-regular text-body-text pb-2">
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Heart Rate Card */}
          <div className="bg-secondary-light rounded-[8px] p-6 shadow-2xs space-y-4">
            <div>
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Average Heart Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-dm-san-regular text-heading-text">
                  {report.key_metrics?.avgHeartRate ?? 72}
                </span>
                <span className="text-2xs text-zinc-500 font-dm-san-regular font-semibold">bpm</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-dm-san-regular text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-secondary-color/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary-color" />
                <span>Unstable</span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <ChartContainer config={heartRateConfig} className="h-[116px] w-full">
              <BarChart data={heartRateData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  className="font-dm-san-regular text-[10px] fill-zinc-400 font-bold"
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {heartRateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === "unstable" ? "#0B1F41" : "#648FCC"}
                      fillOpacity={entry.status === "unstable" ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Pain Level Card */}
          <div className="bg-secondary-light rounded-[8px] p-6 shadow-2xs space-y-4">
            <div>
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Average Pain Level
              </span>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-2xl font-bold font-dm-san-regular text-heading-text">
                  {report.key_metrics?.avgPainLevel ?? 2}
                </span>
                <span className="text-2xs text-zinc-400 font-dm-san-regular font-semibold">/10</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-dm-san-regular text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-secondary-color/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary-color" />
                <span>Unstable</span>
              </div>
            </div>

            {/* Recharts Bar Chart */}
            <ChartContainer config={painLevelConfig} className="h-[116px] w-full">
              <BarChart data={painLevelData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  className="font-dm-san-regular text-[10px] fill-zinc-400 font-bold"
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {painLevelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.status === "unstable" ? "#0B1F41" : "#648FCC"}
                      fillOpacity={entry.status === "unstable" ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Mood Card */}
          <div className="bg-active-btn rounded-[8px] p-6 shadow-2xs flex flex-col justify-between h-full gap-4">
            <div className="space-y-2">
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Mood
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold font-dm-san-regular text-heading-text flex items-center gap-1.5">
                  {moodInfo.emoji} {moodInfo.label}
                </span>
              </div>
              {report.key_metrics?.moodChange && (
                <span className="text-2xs text-active-border font-bold font-dm-san-regular block">
                  {report.key_metrics.moodChange.includes("vs")
                    ? report.key_metrics.moodChange
                    : `${report.key_metrics.moodChange} vs last week`}
                </span>
              )}
            </div>

            <p className="text-sm font-dm-san-regular text-body-text leading-relaxed">
              Based on vocal tone analysis and activity participation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Section: Symptom Analysis */}
      <div className="space-y-6 bg-white p-6 rounded-[8px]">
        <h2 className="text-[22px] font-dm-san-regular text-body-text pb-2">
          Symptom Analysis
        </h2>

        {symptoms.length === 0 ? (
          <div className="p-6 bg-secondary-light/40 border border-dashed border-zinc-200 rounded-[8px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-active-btn flex items-center justify-center">
                <IconCheck className="size-4 text-active-border" />
              </div>
              <div>
                <p className="text-sm font-medium font-dm-san-regular text-body-text">
                  No Acute Symptoms Detected
                </p>
                <p className="text-xs font-dm-san-regular text-zinc-500">
                  No acute distress patterns or symptoms flagged by caregivers during this period.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-inherit text-active-border border-active-border font-dm-san-regular font-normal px-3 py-1 rounded-full text-xs"
            >
              Normal
            </Badge>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {symptoms.map((item, index) => {
              const severity = item.severity || "Mild"
              const isSerious = severity.toLowerCase() === "serious"
              const isModerate = severity.toLowerCase() === "moderate"

              const bgClass = isSerious
                ? "bg-warning-btn border-warning-border"
                : isModerate
                ? "bg-pending-btn border-pending-border"
                : "bg-active-btn border-active-border"

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between border rounded-[8px] p-6 shadow-2xs ${bgClass}`}
                >
                  <div className="space-y-4 w-full">
                    <span className="text-base font-normal text-body-text font-dm-san-regular block">
                      {item.name || `Symptom ${index + 1}`}
                    </span>
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xl font-semibold text-body-text font-dm-san-regular">
                        {item.count !== undefined ? `${item.count} Events` : "Logged"}
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-inherit text-pending-border border-zinc-300 font-dm-san-regular font-normal px-3 py-1 rounded-full shadow-none text-xs tracking-wider"
                      >
                        {severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Section: Medication Adherence */}
      <div className="space-y-4 bg-white p-6 rounded-[8px]">
        <h2 className="text-[22px] font-dm-san-regular text-body-text pb-2">
          Medication Adherence
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8 p-6 rounded-[8px] shadow-2xs">
          {/* Pie Donut Chart */}
          <div className="relative size-[206px] flex items-center justify-center shrink-0">
            <ChartContainer config={pieConfig} className="size-full">
              <PieChart>
                <Pie
                  data={medicationPieData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                />
              </PieChart>
            </ChartContainer>
            <span className="absolute text-3xl font-bold font-dm-san-regular text-heading-text">
              {adherencePercentage}%
            </span>
          </div>

          {/* List items */}
          <div className="flex-1 space-y-3 w-full">
            {medicationItems.length === 0 ? (
              <div className="p-4 bg-white border border-primary-light rounded-[8px] flex items-center justify-between text-sm">
                <span className="font-normal font-dm-san-regular text-body-text">
                  Scheduled Medication Plan
                </span>
                <span className="font-bold font-dm-san-regular text-active-border">
                  {adherencePercentage}% Overall Adherence
                </span>
              </div>
            ) : (
              medicationItems.map((med, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-primary-light rounded-[8px] flex gap-3 items-center justify-between text-sm"
                >
                  <span className="font-normal font-dm-san-regular text-body-text">
                    {med.name} {med.dosage ? `(${med.dosage})` : ""}
                  </span>
                  <span className="font-bold font-dm-san-regular text-active-border">
                    {med.adherencePercentage ?? 100}% Adherence
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

