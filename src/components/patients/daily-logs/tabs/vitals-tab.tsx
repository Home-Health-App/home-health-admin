import React from "react"

export interface VitalDisplayItem {
  label: string
  value: string
  status: "Normal" | "No change" | "Mid" | "High" | "Serious" | string
}

interface VitalsTabProps {
  vitals: VitalDisplayItem[]
}

export default function VitalsTab({ vitals }: VitalsTabProps) {
  if (!vitals || vitals.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No vitals recorded at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {vitals.map((v, index) => {
        let badgeClass = "text-active-border"
        if (v.status === "No change") {
          badgeClass = "text-[#6F6F6F]"
        } else if (v.status === "Mid") {
          badgeClass = "text-pending-border"
        } else if (v.status === "High" || v.status === "Serious") {
          badgeClass = "text-warning-border"
        }
        return (
          <div
            key={index}
            className="p-4 bg-secondary-light rounded-[8px] shadow-2xs space-y-2.5 flex flex-col justify-between"
          >
            <span className="text-xs font-normal text-body-text font-dm-san-regular block">
              {v.label}
            </span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-semibold font-dm-san-regular text-body-text block">
                  {v.value.split(" ")[0]}
                </span>
                <span className="text-xs text-bosy-text font-dm-san-regular font-normal tracking-wider block">
                  {v.value.split(" ").slice(1).join(" ")}
                </span>
              </div>
            </div>
            <span
              className={`${badgeClass} font-dm-san-regular font-bold text-xs self-start`}
            >
              {v.status}
            </span>
          </div>
        )
      })}
    </div>
  )
}

