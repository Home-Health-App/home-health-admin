"use client"

import React from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_PATIENTS } from "../mock-data"
import { BarChart, Bar, Cell, XAxis, PieChart, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AiReportDetailsViewProps {
  patientId: string
  reportId: string
}

const heartRateConfig = {
  stable: { label: "Stable", color: "#648FCC" },
  unstable: { label: "Unstable", color: "#0B1E3F" },
}

const painLevelConfig = {
  stable: { label: "Stable", color: "#648FCC" },
  unstable: { label: "Unstable", color: "#0B1E3F" },
}

const pieConfig = {
  adhered: { label: "Adhered", color: "#2A7E5C" },
  temp: { label: "Temp", color: "#648FCC" },
  fixed: { label: "Fixed", color: "#EEF2F6" },
}

const heartRateData = [
  { day: "Mon", value: 10, status: "stable" },
  { day: "Tue", value: 14, status: "stable" },
  { day: "Wed", value: 11, status: "stable" },
  { day: "Thu", value: 9, status: "unstable" },
  { day: "Fri", value: 12, status: "stable" },
  { day: "Sat", value: 11, status: "stable" },
  { day: "Sun", value: 13, status: "stable" },
]

const painLevelData = [
  { day: "Mon", value: 4, status: "stable" },
  { day: "Tue", value: 5, status: "stable" },
  { day: "Wed", value: 7, status: "stable" },
  { day: "Thu", value: 15, status: "unstable" },
  { day: "Fri", value: 6, status: "stable" },
  { day: "Sat", value: 8, status: "stable" },
  { day: "Sun", value: 4, status: "stable" },
]

export default function AiReportDetailsView({ patientId, reportId }: AiReportDetailsViewProps) {
  // Find current patient or fallback
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            AI Health Report
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[#2B2B2B] font-dm-san-regular text-sm mt-1">
            <span>{patient.name}</span>
            <span className="text-zinc-300">•</span>
            <span>Reporting Period: June 15 – June 21, 2026</span>
          </div>
        </div>

        {/* Dropdown filter block */}
        <Button
          variant="outline"
          className="rounded-lg border border-zinc-200 shadow-none font-dm-san-regular font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 hover:bg-zinc-50 cursor-pointer outline-hidden bg-white select-none self-start sm:self-auto"
        >
          <span>30 Days</span>
          <IconChevronDown className="size-4 opacity-75 text-body-text" />
        </Button>
      </div>

      {/* Main Grid: Executive Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Executive Summary (Grid span 2) - Card Styled */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs space-y-4">
          <h2 className="text-[22px] font-dm-san-regular text-zinc-900 border-b border-zinc-100 pb-2">
            Executive Summary
          </h2>
          <div className="text-sm font-dm-san-regular leading-relaxed text-body-text space-y-4">
            <p>
              Patient Eleanor Vance demonstrated overall stability during the reporting period of Oct 16 – 22. Vitals remained largely within baseline parameters, with minor fluctuations in resting heart rate early in the week that resolved without intervention.
            </p>
            <p>
              Cognitive engagement scores improved by 12% compared to the previous week, correlating with increased participation in scheduled afternoon activities. Sleep quality indicators show consistent 7–8 hour restorative periods.
            </p>
            <p>
              No acute distress patterns detected in the voice analysis logs. Nutrition intake meets targets, though hydration levels required caregiver prompting on Tuesday.
            </p>
          </div>
        </div>

        {/* AI Recommendations (Grid span 1) - Card Styled */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs space-y-4">
          <h2 className="text-[22px] font-dm-san-regular text-zinc-900 border-b border-zinc-100 pb-2">
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {/* Rec 1 */}
            <div className="p-4 bg-secondary-light border border-l-2 border-l-secondary-color rounded-[8px] text-base font-dm-san-regular font-normal leading-relaxed text-body-text">
              Increase scheduled water offerings to 4x daily to prevent recurrence of Tuesday's dip.
            </div>
            {/* Rec 2 */}
            <div className="p-4 bg-secondary-light border border-l-2 border-l-secondary-color rounded-[8px] text-base font-dm-san-regular font-normal leading-relaxed text-body-text">
              Maintain current physical therapy routine; patient responding well to increased resistance.
            </div>
            {/* Rec 3 */}
            <div className="p-4 bg-secondary-light border border-l-2 border-l-secondary-color rounded-[8px] text-base font-dm-san-regular font-normal leading-relaxed text-body-text">
              Keep ambient temperature slightly cooler at night (68°F) to maintain optimal sleep architecture.
            </div>
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
                <span className="text-2xl font-bold font-dm-san-regular text-zinc-950">69</span>
                <span className="text-2xs text-zinc-500 font-dm-san-regular font-semibold">bpm</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-dm-san-regular text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#648FCC]/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0B1E3F]" />
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
                      fill={entry.status === "unstable" ? "#0B1E3F" : "#648FCC"}
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
                <span className="text-2xl font-bold font-dm-san-regular text-zinc-950">3</span>
                <span className="text-2xs text-zinc-400 font-dm-san-regular font-semibold">/10</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-dm-san-regular text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#648FCC]/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0B1E3F]" />
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
                      fill={entry.status === "unstable" ? "#0B1E3F" : "#648FCC"}
                      fillOpacity={entry.status === "unstable" ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>

          {/* Mood Card - Keep bg-[#EBF3EF] border border-[#D5E6DE] */}
          <div className="bg-active-btn rounded-[8px] p-6 shadow-2xs flex flex-col justify-between h-full gap-4">
            <div className="space-y-2">
              <span className="">
                Mood
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold font-dm-san-regular text-zinc-950 flex items-center gap-1.5">
                  😊 Positive
                </span>
              </div>
              <span className="text-2xs text-[#2A7E5C] font-bold font-dm-san-regular block">
                +12% vs last week
              </span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Card Styled */}
          <div className="flex items-center justify-between bg-pending-btn border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs">
            <div className="space-y-4 w-full">
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Shortness of breath
              </span>
              <div className="w-full flex items-center justify-between">
                <span className="text-xl font-semibold text-body-text font-dm-san-regular">
                  2 Events
                </span>
                <Badge
                  variant="outline"
                  className="bg-inherit text-[#4D4000] border-pending-border font-dm-san-regular font-normal px-3 py-1 rounded-full shadow-none text-xs tracking-wider"
                >
                  Moderate
                </Badge>
              </div>
            </div>
          </div>

          {/* Card 2 - Card Styled */}
          <div className="flex items-center justify-between bg-warning-btn border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs">
            <div className="w-full space-y-4">
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Joint Pain
              </span>
              <div className="w-full flex items-center justify-between">
                <span className="text-xl font-semibold text-body-text font-dm-san-regular">
                  8 Events
                </span>
                <Badge
                  variant="outline"
                  className="bg-inherit text-[#4D4000] border-warning-border font-dm-san-regular font-normal px-3 py-1 rounded-full shadow-none text-xs tracking-wider"
                >
                  Serious
                </Badge>
              </div>
            </div>
          </div>

          {/* Card 3 - Card Styled */}
          <div className="flex items-center justify-between bg-active-btn border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs">
            <div className="w-full space-y-4">
              <span className="text-base font-normal text-body-text font-dm-san-regular block">
                Fatigue
              </span>
              <div className="w-full flex items-center justify-between">
                <span className="text-xl font-semibold text-body-text font-dm-san-regular">
                  1 Events
                </span>
                <Badge
                  variant="outline"
                  className="bg-inherit text-[#4D4000] border-active-border font-dm-san-regular font-normal px-3 py-1 rounded-full shadow-none text-xs tracking-wider"
                >
                  Mild
                </Badge>
              </div>
            </div>
          </div>
        </div>
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
                  data={[
                    { name: "adhered", value: 70, fill: "var(--color-adhered)" },
                    { name: "temp", value: 20, fill: "var(--color-temp)" },
                    { name: "fixed", value: 10, fill: "var(--color-fixed)" },
                  ]}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                />
              </PieChart>
            </ChartContainer>
            <span className="absolute text-3xl font-bold font-dm-san-regular text-zinc-950">
              100%
            </span>
          </div>

          {/* List items */}
          <div className="flex-1 space-y-3 w-full">
            <div className="p-4 bg-white border border-primary-light rounded-[8px] flex gap-3 items-center text-sm">
              <span className="font-normal font-dm-san-regular text-body-text">
                Metformin (500mg)
              </span>
              <span className="font-bold font-dm-san-regular text-[#2A7E5C]">
                100% Adherence
              </span>
            </div>
            <div className="p-4 bg-white border border-primary-light rounded-[8px] flex gap-3 items-center text-sm">
              <span className="font-normal font-dm-san-regular text-body-text">
                Lisinopril (10mg)
              </span>
              <span className="font-bold font-dm-san-regular text-[#2A7E5C]">
                100% Adherence
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
