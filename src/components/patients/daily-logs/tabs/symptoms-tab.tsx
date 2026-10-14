import React from "react"
import { Badge } from "@/components/ui/badge"

export interface SymptomDisplayItem {
  name: string
  severity: "Mild" | "Medium" | "High" | "Serious" | string
  note: string
}

interface SymptomsTabProps {
  symptoms: SymptomDisplayItem[]
}

export default function SymptomsTab({ symptoms }: SymptomsTabProps) {
  if (!symptoms || symptoms.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No symptoms noted at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {symptoms.map((sym, index) => {
        const sevLower = (sym.severity || "").toLowerCase()
        let badgeClass = "bg-active-btn text-active-border border-active-border"
        if (sevLower.includes("medium") || sevLower.includes("mid")) {
          badgeClass = "bg-[#FDF6E2] text-[#4D4000] border-pending-border"
        } else if (
          sevLower.includes("high") ||
          sevLower.includes("serious") ||
          sevLower.includes("critical")
        ) {
          badgeClass = "text-[#430D0A] bg-warning-btn text-warning-border border-warning-border"
        }
        return (
          <div
            key={index}
            className="p-6 bg-secondary-light rounded-[8px] space-y-4 flex flex-col h-fit justify-between"
          >
            <div className="flex items-center gap-4">
              <h3 className="text-base font-bold font-dm-san-regular text-body-text">
                {sym.name}
              </h3>
              <Badge
                variant="outline"
                className={`${badgeClass} font-dm-san-regular font-normal px-3.5 py-0.5 rounded-full shadow-none text-xs tracking-wider capitalize`}
              >
                {sym.severity}
              </Badge>
            </div>
            {sym.note && (
              <div className="flex gap-4 text-sm text-body-text leading-relaxed font-dm-san-regular flex-1">
                <span className="font-semibold text-zinc-800 block mb-0.5 shrink-0">Note</span>
                <span>
                  {sym.note}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

