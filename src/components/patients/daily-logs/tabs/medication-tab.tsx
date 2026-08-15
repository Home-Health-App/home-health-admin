import React from "react"
import { Badge } from "@/components/ui/badge"

interface MedicationTabProps {
  meds: Array<{
    name: string
    dose: string
    time: string
    note: string
    status: "Active" | "Expired"
  }>
}

export default function MedicationTab({ meds }: MedicationTabProps) {
  if (meds.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-sans text-sm italic">
        No medications scheduled or taken at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {meds.map((med, index) => (
        <div
          key={index}
          className="p-5 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl space-y-4 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-base font-bold font-sans text-zinc-950">
              {med.name}
            </h3>
            <Badge
              variant="outline"
              className="bg-active-btn text-active-border border-active-border/20 font-sans font-medium px-3.5 py-0.5 rounded-full shadow-none text-2xs"
            >
              Active
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 font-sans text-xs">
            <div>
              <span className="text-zinc-500 font-medium block">Dose</span>
              <span className="font-bold text-zinc-900 block mt-0.5">{med.dose}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-medium block">Time Taken</span>
              <span className="font-bold text-zinc-900 block mt-0.5">{med.time}</span>
            </div>
          </div>
          <div className="bg-white border border-zinc-200/30 rounded-xl p-3.5 text-xs text-body-text leading-relaxed font-sans">
            <span className="font-bold text-zinc-800 block mb-0.5">Note</span>
            {med.note}
          </div>
        </div>
      ))}
    </div>
  )
}
