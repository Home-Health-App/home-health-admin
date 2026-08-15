"use client"

import React from "react"
import { IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_PATIENTS } from "../mock-data"

interface AiReportDetailsViewProps {
  patientId: string
  reportId: string
}

export default function AiReportDetailsView({ patientId, reportId }: AiReportDetailsViewProps) {
  // Find current patient or fallback
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-900">
            AI Health Report
          </h1>
          <div className="flex items-center gap-2 text-zinc-500 font-sans text-sm mt-1">
            <span>{patient.name}</span>
            <span className="text-zinc-300">•</span>
            <span>Reporting Period: June 15 – June 21, 2026</span>
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

      {/* Main Grid: Executive Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Executive Summary (Grid span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
            Executive Summary
          </h2>
          <div className="text-sm font-sans leading-relaxed text-body-text space-y-4">
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

        {/* AI Recommendations (Grid span 1) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
            AI Recommendations
          </h2>
          <div className="space-y-3">
            {/* Rec 1 */}
            <div className="p-4 bg-[#EEF2F6]/50 border border-l-4 border-l-[#648FCC] border-zinc-200/50 rounded-r-2xl rounded-l-md text-xs font-sans font-medium leading-relaxed text-body-text">
              Increase scheduled water offerings to 4x daily to prevent recurrence of Tuesday's dip.
            </div>
            {/* Rec 2 */}
            <div className="p-4 bg-[#EEF2F6]/50 border border-l-4 border-l-[#648FCC] border-zinc-200/50 rounded-r-2xl rounded-l-md text-xs font-sans font-medium leading-relaxed text-body-text">
              Maintain current physical therapy routine; patient responding well to increased resistance.
            </div>
            {/* Rec 3 */}
            <div className="p-4 bg-[#EEF2F6]/50 border border-l-4 border-l-[#648FCC] border-zinc-200/50 rounded-r-2xl rounded-l-md text-xs font-sans font-medium leading-relaxed text-body-text">
              Keep ambient temperature slightly cooler at night (68°F) to maintain optimal sleep architecture.
            </div>
          </div>
        </div>
      </div>

      {/* Section: Key Metrics */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Heart Rate Card */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-2xs space-y-4">
            <div>
              <span className="text-xs font-semibold text-body-text opacity-60 font-sans block">
                Average Heart Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold font-sans text-zinc-950">69</span>
                <span className="text-2xs text-zinc-500 font-sans font-semibold">bpm</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-sans text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#648FCC]/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0B1E3F]" />
                <span>Unstable</span>
              </div>
            </div>

            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-20 px-2 pt-2">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-10 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Mon</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-14 bg-[#648FCC]/70 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Tue</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-11 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Wed</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-9 bg-[#0B1E3F] rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Thu</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-12 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Fri</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-11 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Sat</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-13 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Sun</span>
              </div>
            </div>
          </div>

          {/* Pain Level Card */}
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-5 shadow-2xs space-y-4">
            <div>
              <span className="text-xs font-semibold text-body-text opacity-60 font-sans block">
                Average Pain Level
              </span>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-2xl font-bold font-sans text-zinc-950">3</span>
                <span className="text-2xs text-zinc-400 font-sans font-semibold">/10</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-3xs font-bold font-sans text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#648FCC]/50" />
                <span>Stable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0B1E3F]" />
                <span>Unstable</span>
              </div>
            </div>

            {/* Custom CSS Bar Chart */}
            <div className="flex items-end justify-between h-20 px-2 pt-2">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-4 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Mon</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-5 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Tue</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-7 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Wed</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-15 bg-[#0B1E3F] rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Thu</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-6 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Fri</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-8 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Sat</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-6 h-4 bg-[#648FCC]/30 rounded-[4px]" />
                <span className="text-4xs font-bold text-zinc-400 font-sans">Sun</span>
              </div>
            </div>
          </div>

          {/* Mood Card */}
          <div className="bg-[#EBF3EF] border border-[#D5E6DE] rounded-2xl p-5 shadow-2xs flex flex-col justify-between h-full gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-body-text opacity-60 font-sans block">
                Mood
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold font-sans text-zinc-950 flex items-center gap-1.5">
                  😊 Positive
                </span>
              </div>
              <span className="text-2xs text-[#2A7E5C] font-bold font-sans block">
                +12% vs last week
              </span>
            </div>

            <p className="text-xs font-sans text-body-text opacity-85 leading-relaxed">
              Based on vocal tone analysis and activity participation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Section: Symptom Analysis */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
          Symptom Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex items-center justify-between p-5 bg-[#FDF7EC] border border-[#F6EAD2] rounded-2xl shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 font-sans block">
                Shortness of breath
              </span>
              <span className="text-lg font-bold text-zinc-900 font-sans">
                2 Events
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-[#FFF4E5] text-[#B76E00] border-[#FFE2B9] font-sans font-semibold px-3 py-1 rounded-full shadow-none text-2xs uppercase tracking-wider"
            >
              Moderate
            </Badge>
          </div>

          {/* Card 2 */}
          <div className="flex items-center justify-between p-5 bg-[#FAF0F0] border border-[#EED7D7] rounded-2xl shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 font-sans block">
                Joint Pain
              </span>
              <span className="text-lg font-bold text-zinc-900 font-sans">
                8 Events
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-[#FCE8E6] text-[#C53929] border-[#F7C6C1] font-sans font-semibold px-3 py-1 rounded-full shadow-none text-2xs uppercase tracking-wider"
            >
              Serious
            </Badge>
          </div>

          {/* Card 3 */}
          <div className="flex items-center justify-between p-5 bg-[#EBF3EF] border border-[#D5E6DE] rounded-2xl shadow-2xs">
            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-500 font-sans block">
                Fatigue
              </span>
              <span className="text-lg font-bold text-zinc-900 font-sans">
                1 Events
              </span>
            </div>
            <Badge
              variant="outline"
              className="bg-[#E2F0D9] text-[#2E7D32] border-[#C8E6C9] font-sans font-semibold px-3 py-1 rounded-full shadow-none text-2xs uppercase tracking-wider"
            >
              Mild
            </Badge>
          </div>
        </div>
      </div>

      {/* Section: Medication Adherence */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
          Medication Adherence
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-zinc-50 border border-zinc-200/50 rounded-2xl">
          {/* Radial Chart */}
          <div className="relative size-32 flex items-center justify-center">
            {/* SVG Ring background and value */}
            <svg className="size-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                className="stroke-zinc-200"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                className="stroke-[#2A7E5C]"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="326.7"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xl font-bold font-sans text-zinc-950">
              100%
            </span>
          </div>

          {/* List items */}
          <div className="flex-1 space-y-3 w-full">
            <div className="p-4 bg-white border border-zinc-200/50 rounded-xl flex items-center justify-between text-sm">
              <span className="font-medium font-sans text-zinc-500">
                Metformin (500mg)
              </span>
              <span className="font-bold font-sans text-[#2A7E5C]">
                100% Adherence
              </span>
            </div>
            <div className="p-4 bg-white border border-zinc-200/50 rounded-xl flex items-center justify-between text-sm">
              <span className="font-medium font-sans text-zinc-500">
                Lisinopril (10mg)
              </span>
              <span className="font-bold font-sans text-[#2A7E5C]">
                100% Adherence
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
