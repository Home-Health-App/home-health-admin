"use client"

import React, { useState } from "react"
import { IconCalendar, IconClock } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MOCK_PATIENTS } from "../mock-data"

// Import Tab Components
import VitalsTab from "./tabs/vitals-tab"
import MedicationTab from "./tabs/medication-tab"
import SymptomsTab from "./tabs/symptoms-tab"
import MoodTab from "./tabs/mood-tab"
import NotesTab from "./tabs/notes-tab"

interface DailyLogTabsViewProps {
  patientId: string
  logId: string
}

// Log records mapped by unique alphanumeric log ID and time slots
const LOG_DATA_BY_ID: Record<string, {
  displayDate: string;
  pickerDate: string;
  timesData: Record<string, {
    vitals: Array<{ label: string; value: string; status: "Normal" | "No change" | "Mid" | "High" | "Serious" }>;
    meds: Array<{ name: string; dose: string; time: string; note: string; status: "Active" | "Expired" }>;
    symptoms: Array<{ name: string; severity: "Mild" | "Medium" | "High" | "Serious"; note: string }>;
    mood: { emoji: string; name: string; note: string; severityClass: string };
    notes: Array<{ text: string }>;
  }>;
}> = {
  "22u26guqwwtq": {
    displayDate: "Aug 05, 2026",
    pickerDate: "05/08/2026",
    timesData: {
      "08:00 AM": {
        vitals: [
          { label: "Blood Pressure", value: "120/80 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "72 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "99 %", status: "Normal" },
          { label: "Temperature", value: "98.6 °F", status: "No change" },
          { label: "Respiratory Rate", value: "16 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "95 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "3 /10", status: "Mid" },
        ],
        meds: [
          {
            name: "Metformin",
            dose: "500mg",
            time: "08:05 AM",
            note: "Taken with breakfast and after dinner, no adverse reactions noted.",
            status: "Active",
          },
          {
            name: "Lisinopril",
            dose: "10mg",
            time: "08:40 AM",
            note: "Taken with lunch, no adverse reactions noted.",
            status: "Active",
          },
        ],
        symptoms: [
          {
            name: "Shortness of Breath",
            severity: "High",
            note: "Patient reported sudden shortness of breath after walking to the restroom. Oxygen saturation dropped to 92%. Administered supplemental O2 at 2L/min via nasal cannula. Saturation improved to 96% within 10 minutes. Will monitor closely overnight.",
          },
          {
            name: "Nausea",
            severity: "Medium",
            note: "Reported mild nausea following morning medication administration. Refused breakfast. Administered prescribed antiemetic PRN at 11:30 AM.",
          },
        ],
        mood: {
          emoji: "😞",
          name: "Sad",
          note: "Woke up tired. Assisted with morning hygiene routine. Ate about 40% of breakfast. Quiet and uncooperative during morning care.",
          severityClass: "border-l-[#C43A3A] bg-zinc-50",
        },
        notes: [
          {
            text: "Patient reported sudden shortness of breath after walking to the restroom. Oxygen saturation dropped to 92%. Administered supplemental O2 at 2L/min via nasal cannula. Saturation improved to 96% within 10 minutes. Will monitor closely overnight.",
          },
          {
            text: "Patient noted dull headache upon waking. Pain rated 2/10. Encouraged oral hydration. Did not request analgesics at this time.",
          },
          {
            text: "Reported mild nausea following morning medication administration. Refused breakfast. Administered prescribed antiemetic PRN at 11:30 AM.",
          },
        ],
      },
      "10:00 AM": {
        vitals: [
          { label: "Blood Pressure", value: "118/78 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "70 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "98 %", status: "Normal" },
          { label: "Temperature", value: "98.4 °F", status: "No change" },
          { label: "Respiratory Rate", value: "15 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "92 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "1 /10", status: "Normal" },
        ],
        meds: [],
        symptoms: [],
        mood: {
          emoji: "😐",
          name: "Neutral",
          note: "Resting quietly in her room. Administered mid-morning medications without issue. Vitals stable. Did not want to turn on the TV, preferred to look out the window.",
          severityClass: "border-l-yellow-500 bg-zinc-50",
        },
        notes: [],
      },
      "02:30 PM": {
        vitals: [
          { label: "Blood Pressure", value: "122/82 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "75 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "99 %", status: "Normal" },
          { label: "Temperature", value: "98.8 °F", status: "No change" },
          { label: "Respiratory Rate", value: "17 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "105 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "2 /10", status: "Normal" },
        ],
        meds: [],
        symptoms: [],
        mood: {
          emoji: "😊",
          name: "Happy",
          note: "She had a wonderful afternoon in the sunroom. She participated in a knitting activity and was very talkative with me. Ate 100% of her lunch. Seemed very bright and energetic.",
          severityClass: "border-l-green-500 bg-zinc-50",
        },
        notes: [],
      },
      "06:00 PM": {
        vitals: [
          { label: "Blood Pressure", value: "120/80 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "73 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "99 %", status: "Normal" },
          { label: "Temperature", value: "98.6 °F", status: "No change" },
          { label: "Respiratory Rate", value: "16 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "98 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "2 /10", status: "Normal" },
        ],
        meds: [],
        symptoms: [],
        mood: {
          emoji: "😊",
          name: "Happy",
          note: "She had a wonderful afternoon in the sunroom. She participated in a knitting activity and was very talkative with me. Ate 100% of her lunch. Seemed very bright and energetic.",
          severityClass: "border-l-green-500 bg-zinc-50",
        },
        notes: [],
      },
    },
  },
  "19p83xyzabcq": {
    displayDate: "Aug 04, 2026",
    pickerDate: "04/08/2026",
    timesData: {
      "08:00 AM": {
        vitals: [
          { label: "Blood Pressure", value: "122/82 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "74 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "98 %", status: "Normal" },
          { label: "Temperature", value: "98.7 °F", status: "No change" },
          { label: "Respiratory Rate", value: "17 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "96 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "1 /10", status: "Normal" },
        ],
        meds: [
          {
            name: "Metformin",
            dose: "500mg",
            time: "08:15 AM",
            note: "Administered after breakfast.",
            status: "Active",
          },
        ],
        symptoms: [],
        mood: {
          emoji: "😊",
          name: "Positive",
          note: "Quiet morning, had full breakfast.",
          severityClass: "border-l-green-500 bg-zinc-50",
        },
        notes: [],
      },
    },
  },
  "12a90klmnoqr": {
    displayDate: "Aug 03, 2026",
    pickerDate: "03/08/2026",
    timesData: {
      "08:00 AM": {
        vitals: [
          { label: "Blood Pressure", value: "124/84 mmHg", status: "Normal" },
          { label: "Heart Rate", value: "76 bpm", status: "Normal" },
          { label: "Oxygen Saturation", value: "97 %", status: "Normal" },
          { label: "Temperature", value: "98.9 °F", status: "No change" },
          { label: "Respiratory Rate", value: "18 rpm", status: "Normal" },
          { label: "Blood Glucose", value: "102 mg/dL", status: "No change" },
          { label: "Weight", value: "76 kg", status: "No change" },
          { label: "Pain Level", value: "2 /10", status: "Normal" },
        ],
        meds: [],
        symptoms: [],
        mood: {
          emoji: "😐",
          name: "Neutral",
          note: "Woke up with slight fatigue.",
          severityClass: "border-l-yellow-500 bg-zinc-50",
        },
        notes: [],
      },
    },
  },
}

export default function DailyLogTabsView({ patientId, logId }: DailyLogTabsViewProps) {
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  // Resolve active dataset based on log ID
  const activeLog = LOG_DATA_BY_ID[logId] || LOG_DATA_BY_ID["22u26guqwwtq"]

  // Local states for times selection
  const times = Object.keys(activeLog.timesData)
  const [activeTime, setActiveTime] = useState<string>(times[0] || "08:00 AM")

  // Fallback check if time selection is not in times list
  const resolvedTime = times.includes(activeTime) ? activeTime : times[0] || "08:00 AM"
  const currentData = activeLog.timesData[resolvedTime] || activeLog.timesData["08:00 AM"]

  // Controlled tab state — needed so we can style the active trigger directly
  // from React state (below) instead of depending on the data-[state=active]
  // CSS selector, which can be silently overridden by the base TabsTrigger
  // component's own default active-state classes.
  const [activeTab, setActiveTab] = useState("vitals")

  const tabTriggerClass = (tab: string) =>
    `text-sm font-normal font-dm-san-regular px-4 py-2 rounded-[6px] border border-transparent transition-all cursor-pointer shadow-none ${activeTab === tab
      ? "bg-[#648FCC] text-white"
      : "bg-transparent text-[#2B2B2B] hover:bg-zinc-50/60"
    }`

  return (
    <div className="w-full space-y-6 pb-12">
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

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-row justify-between items-center gap-10 pb-3">
          {/* Tabs Triggers Bar */}
          <TabsList className="p-1.5 h-auto w-full bg-white flex justify-start items-center gap-2 border-0 rounded-[8px] shadow-none ring-0 overflow-hidden">
            <div className="h-full flex gap-4 rounded-[8px]">
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
                value="notes"
                className={`${tabTriggerClass("notes")} whitespace-nowrap data-active:bg-secondary-color data-active:text-white data-active:hover:bg-secondary-color data-active:hover:text-white`}
              >
                Notes
              </TabsTrigger>
            </div>

          </TabsList>

          {/* Date Selector input */}
          <div className="flex items-center gap-3.5 shrink-0 select-none">
            <span className="text-sm font-normal text-body-text font-dm-san-regular whitespace-nowrap">
              Enter Date
            </span>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={activeLog.pickerDate}
                className="border border-zinc-950 font-dm-san-regular font-normal text-sm text-body-text px-4 py-1.5 rounded-[12px] bg-white select-none outline-hidden h-9 w-[130px] text-center"
              />
            </div>
          </div>
        </div>

        {/* Outer Card Container */}
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs mt-6 space-y-6">

          {/* Card Sub-header: Date and Recorded By */}
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <IconCalendar className="size-5 text-body-text" />
              <span className="text-[22px] font-dm-san-regular text-body-text font-medium">
                {activeLog.displayDate}
              </span>
            </div>
            <span className="text-base font-medium text-body-text font-dm-san-regular">
              Recorded by Bobby Singer
            </span>
          </div>

          {/* Columns Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

            {/* Left Side: Time logs Selector */}
            <div className="md:col-span-1 border border-[#B3CBE6] rounded-[8px] p-2 flex flex-col gap-1.5 bg-white shadow-2xs">
              {times.map((t) => {
                const isActive = resolvedTime === t
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTime(t)}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-[8px] font-dm-san-regular font-normal text-sm transition-all cursor-pointer outline-hidden ${isActive
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
                <VitalsTab vitals={currentData.vitals} />
              </TabsContent>

              {/* Medication Tab */}
              <TabsContent value="medication" className="mt-0">
                <MedicationTab meds={currentData.meds} />
              </TabsContent>

              {/* Symptoms Tab */}
              <TabsContent value="symptoms" className="mt-0">
                <SymptomsTab symptoms={currentData.symptoms} />
              </TabsContent>

              {/* Mood Tab */}
              <TabsContent value="mood" className="mt-0">
                <MoodTab mood={currentData.mood} />
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-0">
                <NotesTab notes={currentData.notes} />
              </TabsContent>

            </div>
          </div>

        </div>
      </Tabs>
    </div>
  )
}