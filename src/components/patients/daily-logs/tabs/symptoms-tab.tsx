import React from "react"
import { Badge } from "@/components/ui/badge"

interface SymptomsTabProps {
  symptoms: Array<{
    name: string
    severity: "Mild" | "Medium" | "High" | "Serious"
    note: string
  }>
}

export default function SymptomsTab({ symptoms }: SymptomsTabProps) {
  if (symptoms.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-sans text-sm italic">
        No symptoms noted at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {symptoms.map((sym, index) => {
        let badgeClass = "bg-active-btn text-active-border border-active-border/20"
        if (sym.severity === "Medium") {
          badgeClass = "bg-[#FDF6E2] text-pending-border border-pending-border/20"
        } else if (sym.severity === "High" || sym.severity === "Serious") {
          badgeClass = "bg-warning-btn text-warning-border border-warning-border/20"
        }
        return (
          <div
            key={index}
            className="p-5 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl space-y-4 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-base font-bold font-sans text-zinc-950">
                {sym.name}
              </h3>
              <Badge
                variant="outline"
                className={`${badgeClass} font-sans font-semibold px-3.5 py-0.5 rounded-full shadow-none text-2xs uppercase tracking-wider`}
              >
                {sym.severity}
              </Badge>
            </div>
            <div className="bg-white border border-zinc-200/30 rounded-xl p-3.5 text-xs text-body-text leading-relaxed font-sans flex-1">
              <span className="font-bold text-zinc-800 block mb-0.5">Note</span>
              {sym.note}
            </div>
          </div>
        )
      })}
    </div>
  )
}
