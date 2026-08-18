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
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No medications scheduled or taken at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {meds.map((med, index) => (
        <div
          key={index}
          className="p-5 bg-white border border-zinc-200/60 rounded-[8px] space-y-4 flex flex-col justify-between shadow-2xs"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-base font-bold font-dm-san-regular text-body-text">
              {med.name}
            </h3>
          </div>
          <div className="flex flex-col gap-4 font-dm-san-regular text-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-body-text font-bold block">Dose</span>
              <span className="font-normal text-body-text block mt-0.5">{med.dose}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-body-text font-bold block">Time Taken</span>
              <span className="font-normal text-body-text block mt-0.5">{med.time}</span>
            </div>
            <div className="flex items-center gap-2.5 text-body-text leading-relaxed font-dm-san-regular">
              <span className="font-semibold text-body-text block mb-0.5">Note</span>
              <span>
                {med.note}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
