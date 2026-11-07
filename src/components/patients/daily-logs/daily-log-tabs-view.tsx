"use client"

import React, { useState, useMemo } from "react"
import { IconCalendar, IconClock } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useGetDailyLogById, useGetPatientById } from "@/hooks/patient.hook"
import { formatDate, formatTime } from "@/libs/helper"
import { calculateAge } from "@/libs/utils"
import DailyLogTabsSkeleton from "./daily-log-tabs-skeleton"

// Import Tab Components
import VitalsTab, { VitalDisplayItem } from "./tabs/vitals-tab"
import MedicationTab, { MedicationDisplayItem } from "./tabs/medication-tab"
import SymptomsTab, { SymptomDisplayItem } from "./tabs/symptoms-tab"
import MoodTab, { MoodDisplayItem } from "./tabs/mood-tab"
import NotesTab, { NoteDisplayItem } from "./tabs/notes-tab"
import IncidentReportsTab, { IncidentReportDisplayItem } from "./tabs/incident-reports-tab"
import AdlsTab, { AdlDisplayItem } from "./tabs/adls-tab"
import PhysicalsTab, { PhysicalDisplayItem } from "./tabs/physicals-tab"

interface DailyLogTabsViewProps {
  patientId: string
  logId: string
}

export default function DailyLogTabsView({ patientId, logId }: DailyLogTabsViewProps) {
  const { data: patientResponse, isLoading: isPatientLoading } = useGetPatientById(patientId)
  const patient = patientResponse?.data

  const { data: logResponse, isLoading: isLogLoading, isError: isLogError } = useGetDailyLogById(logId)
  const log = logResponse?.data

  // Extract distinct times from all log sub-collections
  const times = useMemo(() => {
    if (!log) return []
    const timeSet = new Set<string>()
    const timeObjects: Array<{ label: string; timeMinutes: number }> = []

    const addTimestamp = (rawDate?: string | null) => {
      if (!rawDate) return
      const formatted = formatTime(rawDate, "hh:mm a")
      if (formatted && !timeSet.has(formatted)) {
        timeSet.add(formatted)

        // Compute minutes from midnight for exact chronological sorting
        let minutes = 0
        const match = formatted.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i)
        if (match) {
          let h = parseInt(match[1], 10)
          const m = parseInt(match[2], 10)
          const isPM = match[3].toUpperCase() === "PM"
          if (isPM && h !== 12) h += 12
          if (!isPM && h === 12) h = 0
          minutes = h * 60 + m
        }

        timeObjects.push({ label: formatted, timeMinutes: minutes })
      }
    }

    log.vitals?.forEach((v) => addTimestamp(v.time_taken || v.created_at))
    log.medicationRecords?.forEach((m) => addTimestamp(m.time_taken || m.created_at))
    log.symptoms?.forEach((s) => addTimestamp(s.time_taken || s.created_at))
    log.moods?.forEach((m) => addTimestamp(m.time_taken || m.created_at))
    log.careGiverNotes?.forEach((n) => addTimestamp(n.time_taken || n.created_at))
    log.incidentReports?.forEach((i) => addTimestamp(i.time_taken || i.created_at))

    // Sort chronologically by time of day
    timeObjects.sort((a, b) => a.timeMinutes - b.timeMinutes)

    const result = timeObjects.map((t) => t.label)
    if (result.length === 0) {
      const fallback = formatTime(log.date || log.created_at, "hh:mm a")
      return fallback ? [fallback] : ["08:00 AM"]
    }
    return result
  }, [log])

  const [selectedTime, setSelectedTime] = useState<string>("")
  const resolvedTime = times.includes(selectedTime) ? selectedTime : times[0] || "08:00 AM"

  // Controlled tab state
  const [activeTab, setActiveTab] = useState("vitals")

  const tabTriggerClass = (tab: string) =>
    `text-sm font-normal font-dm-san-regular px-3.5 py-2 rounded-[6px] border border-transparent transition-all cursor-pointer shadow-none ${
      activeTab === tab
        ? "bg-secondary-color text-white"
        : "bg-transparent text-body-text hover:bg-zinc-50/60"
    }`

  // Helper to match an item's timestamp against the resolvedTime slot
  const isTimeMatch = (rawDate?: string | null) => {
    if (!rawDate) return false
    return formatTime(rawDate, "hh:mm a") === resolvedTime
  }

  // 1. Vitals Tab Data
  const currentVitals: VitalDisplayItem[] = useMemo(() => {
    if (!log?.vitals || log.vitals.length === 0) return []
    let matched = log.vitals.filter((v) => isTimeMatch(v.time_taken || v.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.vitals
    }
    const currentVital = matched[0]
    if (!currentVital) return []

    const list: VitalDisplayItem[] = []
    if (currentVital.systolic_bp != null || currentVital.diastolic_bp != null) {
      const sys = currentVital.systolic_bp ?? "--"
      const dia = currentVital.diastolic_bp ?? "--"
      const isHigh = Number(sys) >= 140 || Number(dia) >= 90
      list.push({
        label: "Blood Pressure",
        value: `${sys}/${dia} mmHg`,
        status: isHigh ? "High" : "Normal",
      })
    }
    if (currentVital.heart_rate != null) {
      const hr = Number(currentVital.heart_rate)
      list.push({
        label: "Heart Rate",
        value: `${hr} bpm`,
        status: hr > 100 ? "High" : "Normal",
      })
    }
    if (currentVital.oxygen_saturation != null) {
      const o2 = Number(currentVital.oxygen_saturation)
      list.push({
        label: "Oxygen Saturation",
        value: `${o2} %`,
        status: o2 < 90 ? "Serious" : o2 < 95 ? "Mid" : "Normal",
      })
    }
    if (currentVital.temperature != null) {
      list.push({
        label: "Temperature",
        value: `${currentVital.temperature} °F`,
        status: "No change",
      })
    }
    if (currentVital.respiratory_rate != null) {
      const rr = Number(currentVital.respiratory_rate)
      list.push({
        label: "Respiratory Rate",
        value: `${rr} rpm`,
        status: rr > 20 || rr < 12 ? "Mid" : "Normal",
      })
    }
    if (currentVital.blood_glucose != null) {
      list.push({
        label: "Blood Glucose",
        value: `${currentVital.blood_glucose} mg/dL`,
        status: "No change",
      })
    }
    if (currentVital.weight != null) {
      list.push({
        label: "Weight",
        value: `${currentVital.weight} kg`,
        status: "No change",
      })
    }
    if (currentVital.pain_level != null) {
      const pain = Number(currentVital.pain_level)
      list.push({
        label: "Pain Level",
        value: `${pain} /10`,
        status: pain >= 7 ? "Serious" : pain >= 4 ? "Mid" : "Normal",
      })
    }
    return list
  }, [log, resolvedTime, times])

  // 2. Medication Tab Data
  const currentMeds: MedicationDisplayItem[] = useMemo(() => {
    if (!log?.medicationRecords || log.medicationRecords.length === 0) return []
    let matched = log.medicationRecords.filter((m) => isTimeMatch(m.time_taken || m.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.medicationRecords
    }
    return matched.map((m) => ({
      name: m.medication_name,
      dose: m.dose,
      time: formatTime(m.time_taken || m.created_at, "hh:mm a"),
      note: m.notes || "",
      status: "Active",
    }))
  }, [log, resolvedTime, times])

  // 3. Symptoms Tab Data
  const currentSymptoms: SymptomDisplayItem[] = useMemo(() => {
    if (!log?.symptoms || log.symptoms.length === 0) return []
    let matched = log.symptoms.filter((s) => isTimeMatch(s.time_taken || s.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.symptoms
    }
    return matched.map((s) => ({
      name: s.symptom,
      severity: s.severity
        ? s.severity.charAt(0).toUpperCase() + s.severity.slice(1).toLowerCase()
        : "Mild",
      note: s.notes || "",
    }))
  }, [log, resolvedTime, times])

  // 4. Mood Tab Data
  const currentMoods: MoodDisplayItem[] = useMemo(() => {
    if (!log?.moods || log.moods.length === 0) return []
    let matched = log.moods.filter((m) => isTimeMatch(m.time_taken || m.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.moods
    }
    return matched.map((m) => ({
      name: m.mode
        ? m.mode.charAt(0).toUpperCase() + m.mode.slice(1).toLowerCase()
        : "Neutral",
      note: m.notes || "",
    }))
  }, [log, resolvedTime, times])

  // 5. ADLs Tab Data
  const currentAdls: AdlDisplayItem[] = useMemo(() => {
    if (!log?.adls || log.adls.length === 0) return []
    return log.adls.map((adl) => {
      const categories = []
      if (adl.personal_hygiene_assistance || adl.personal_hygiene_assistance_note) {
        categories.push({
          title: "Personal Hygiene",
          status: adl.personal_hygiene_assistance,
          note: adl.personal_hygiene_assistance_note,
        })
      }
      if (adl.feeding_assistance || adl.feeding_assistance_note) {
        categories.push({
          title: "Feeding Assistance",
          status: adl.feeding_assistance,
          note: adl.feeding_assistance_note,
        })
      }
      if (adl.mobility_assistance || adl.mobility_assistance_note) {
        categories.push({
          title: "Mobility Assistance",
          status: adl.mobility_assistance,
          note: adl.mobility_assistance_note,
        })
      }
      if (adl.exercise_assistance) {
        categories.push({
          title: "Exercise Assistance",
          status: adl.exercise_assistance,
        })
      }
      if (adl.pressure_area_care) {
        categories.push({
          title: "Pressure Area Care",
          status: adl.pressure_area_care,
        })
      }
      return {
        id: adl.id,
        categories,
      }
    })
  }, [log])

  // 6. Physicals Tab Data
  const currentPhysicals: PhysicalDisplayItem[] = useMemo(() => {
    if (!log?.physicals || log.physicals.length === 0) return []
    return log.physicals.map((p) => {
      const fields = []
      if (p.sleep_last_night) {
        fields.push({ label: "Sleep Last Night", value: p.sleep_last_night })
      }
      if (p.hydration) {
        fields.push({ label: "Hydration", value: p.hydration })
      }
      if (p.fall_risk) {
        fields.push({ label: "Fall Risk", value: p.fall_risk, status: p.fall_risk })
      }
      if (p.skin_condition) {
        fields.push({ label: "Skin Condition", value: p.skin_condition })
      }
      if (p.bowel_function) {
        fields.push({ label: "Bowel Function", value: p.bowel_function })
      }
      if (p.bladder_function) {
        fields.push({ label: "Bladder Function", value: p.bladder_function })
      }
      return {
        id: p.id,
        fields,
      }
    })
  }, [log])

  // 7. Incident Reports Tab Data
  const currentIncidentReports: IncidentReportDisplayItem[] = useMemo(() => {
    if (!log?.incidentReports || log.incidentReports.length === 0) return []
    let matched = log.incidentReports.filter((i) => isTimeMatch(i.time_taken || i.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.incidentReports
    }
    return matched.map((i) => ({
      id: i.id,
      incident_type: i.incident_type,
      severity: i.severity,
      time: formatTime(i.time_taken || i.created_at, "hh:mm a"),
      description: i.description,
      notes: i.notes || undefined,
      action_taken: i.action_taken,
      location: i.location || undefined,
      reported_to_family: i.reported_to_family,
      reported_to_family_time: i.reported_to_family_time,
      reported_to_professional: i.reported_to_professional,
      reported_to_professional_time: i.reported_to_professional_time,
      next_follow_up_date: i.next_follow_up_date,
    }))
  }, [log, resolvedTime, times])

  // 8. Notes Tab Data (Caregiver Notes)
  const currentNotes: NoteDisplayItem[] = useMemo(() => {
    if (!log?.careGiverNotes || log.careGiverNotes.length === 0) return []
    let matched = log.careGiverNotes.filter((n) => isTimeMatch(n.time_taken || n.created_at))
    if (matched.length === 0 && times.length <= 1) {
      matched = log.careGiverNotes
    }
    return matched.map((n) => ({
      id: n.id,
      text: n.note,
      time: formatTime(n.time_taken || n.created_at, "hh:mm a"),
    }))
  }, [log, resolvedTime, times])

  if (isLogLoading || isPatientLoading) {
    return <DailyLogTabsSkeleton />
  }

  if (isLogError || !log) {
    return (
      <div className="w-full py-16 text-center space-y-4">
        <p className="text-zinc-500 font-dm-san-regular text-base">
          Daily log record not found or could not be loaded.
        </p>
      </div>
    )
  }

  const patientFullName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
    : "Patient"

  const displayAge = patient?.age ?? calculateAge(patient?.date_of_birth)

  const caregiverName = patient?.caregiver
    ? `${patient.caregiver.first_name || ""} ${patient.caregiver.last_name || ""}`.trim()
    : ""

  const recordedByText = caregiverName
    ? `Recorded by ${caregiverName}`
    : "Recorded by Caregiver"

  const displayDate = formatDate(log.date || log.created_at, "MMM dd, yyyy") || "N/A"
  const pickerDate = formatDate(log.date || log.created_at, "dd/MM/yyyy") || ""

  return (
    <div className="w-full space-y-6 pb-12">
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
          <span>
            Registered:{" "}
            {patient?.created_at
              ? formatDate(patient.created_at, "MMM. d yyyy")
              : "N/A"}
          </span>
          {displayAge !== null && (
            <>
              <span className="text-zinc-300">•</span>
              <span>Age: {displayAge}</span>
            </>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-3">
          {/* Tabs Triggers Bar */}
          <TabsList className="p-1.5 h-auto bg-white flex flex-wrap items-center gap-1.5 border-0 rounded-[8px] shadow-none ring-0">
            <div className="h-full flex flex-wrap gap-2 rounded-[8px]">
              <TabsTrigger
                value="vitals"
                className={`${tabTriggerClass("vitals")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Vitals
              </TabsTrigger>
              <TabsTrigger
                value="medication"
                className={`${tabTriggerClass("medication")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Medication
              </TabsTrigger>
              <TabsTrigger
                value="symptoms"
                className={`${tabTriggerClass("symptoms")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Symptoms
              </TabsTrigger>
              <TabsTrigger
                value="mood"
                className={`${tabTriggerClass("mood")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Mood
              </TabsTrigger>
              <TabsTrigger
                value="adls"
                className={`${tabTriggerClass("adls")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                ADLs
              </TabsTrigger>
              <TabsTrigger
                value="physicals"
                className={`${tabTriggerClass("physicals")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Physicals
              </TabsTrigger>
              <TabsTrigger
                value="incidents"
                className={`${tabTriggerClass("incidents")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Incident Reports
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className={`${tabTriggerClass("notes")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Notes
              </TabsTrigger>
            </div>
          </TabsList>

          {/* Date Selector input */}
          {/* <div className="flex items-center gap-3.5 shrink-0 select-none self-end lg:self-auto">
            <span className="text-sm font-normal text-body-text font-dm-san-regular whitespace-nowrap">
              Enter Date
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={pickerDate}
                className="border border-zinc-950 font-dm-san-regular font-normal text-sm text-body-text px-4 py-1.5 rounded-[12px] bg-white select-none outline-hidden h-9 w-[130px] text-center"
              />
            </div>
          </div> */}
        </div>

        {/* Outer Card Container */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs mt-6 space-y-6">
          {/* Card Sub-header: Date and Recorded By */}
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <IconCalendar className="size-5 text-body-text" />
              <span className="text-[22px] font-dm-san-regular text-body-text font-medium">
                {displayDate}
              </span>
            </div>
            <span className="text-base font-medium text-body-text font-dm-san-regular">
              {recordedByText}
            </span>
          </div>

          {/* Columns Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Left Side: Time logs Selector */}
            <div className="md:col-span-1 border border-primary-light rounded-[8px] p-2 flex flex-col gap-1.5 bg-white shadow-2xs">
              {times.map((t) => {
                const isActive = resolvedTime === t
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-[8px] font-dm-san-regular font-normal text-sm transition-all cursor-pointer outline-hidden ${
                      isActive
                        ? "bg-primary-light text-body-text shadow-xs"
                        : "text-body-text border-transparent hover:bg-zinc-50"
                    }`}
                  >
                    <IconClock className="text-body-text size-6" />
                    <span>{t}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Side: Tab Contents Panel */}
            <div className="md:col-span-3">
              {/* Vitals Tab */}
              <TabsContent value="vitals" className="mt-0">
                <VitalsTab vitals={currentVitals} />
              </TabsContent>

              {/* Medication Tab */}
              <TabsContent value="medication" className="mt-0">
                <MedicationTab meds={currentMeds} />
              </TabsContent>

              {/* Symptoms Tab */}
              <TabsContent value="symptoms" className="mt-0">
                <SymptomsTab symptoms={currentSymptoms} />
              </TabsContent>

              {/* Mood Tab */}
              <TabsContent value="mood" className="mt-0">
                <MoodTab mood={currentMoods} />
              </TabsContent>

              {/* ADLs Tab */}
              <TabsContent value="adls" className="mt-0">
                <AdlsTab adls={currentAdls} />
              </TabsContent>

              {/* Physicals Tab */}
              <TabsContent value="physicals" className="mt-0">
                <PhysicalsTab physicals={currentPhysicals} />
              </TabsContent>

              {/* Incident Reports Tab */}
              <TabsContent value="incidents" className="mt-0">
                <IncidentReportsTab reports={currentIncidentReports} />
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-0">
                <NotesTab notes={currentNotes} />
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}