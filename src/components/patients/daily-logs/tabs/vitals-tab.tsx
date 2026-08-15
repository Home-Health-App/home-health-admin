import React from "react"
import { Badge } from "@/components/ui/badge"

interface VitalsTabProps {
  vitals: Array<{
    label: string
    value: string
    status: "Normal" | "No change" | "Mid" | "High" | "Serious"
  }>
}

export default function VitalsTab({ vitals }: VitalsTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {vitals.map((v, index) => {
        let badgeClass = "bg-active-btn text-active-border border-active-border/20"
        if (v.status === "No change") {
          badgeClass = "bg-zinc-100 text-zinc-500 border-zinc-200/30"
        } else if (v.status === "Mid") {
          badgeClass = "bg-[#FDF6E2] text-pending-border border-pending-border/20"
        } else if (v.status === "High" || v.status === "Serious") {
          badgeClass = "bg-warning-btn text-warning-border border-warning-border/20"
        }
        return (
          <div
            key={index}
            className="p-4 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl space-y-2.5 flex flex-col justify-between"
          >
            <span className="text-2xs font-semibold text-body-text opacity-60 font-sans block">
              {v.label}
            </span>
            <div className="space-y-1">
              <span className="text-lg font-bold font-sans text-zinc-950 block">
                {v.value.split(" ")[0]}
              </span>
              <span className="text-3xs text-zinc-500 font-sans font-semibold uppercase tracking-wider block">
                {v.value.split(" ").slice(1).join(" ")}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`${badgeClass} font-sans font-semibold px-2.5 py-0.5 rounded-full shadow-none text-3xs self-start`}
            >
              {v.status}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}
