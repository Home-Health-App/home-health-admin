import React from "react"
import { Badge } from "@/components/ui/badge"

export interface PhysicalFieldItem {
  label: string
  value?: string | null
  status?: string
}

export interface PhysicalDisplayItem {
  id?: string
  fields: PhysicalFieldItem[]
}

interface PhysicalsTabProps {
  physicals: PhysicalDisplayItem[]
}

export default function PhysicalsTab({ physicals }: PhysicalsTabProps) {
  if (!physicals || physicals.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No physical assessment records noted at this time.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {physicals.map((physicalGroup, groupIndex) => (
        <div
          key={physicalGroup.id || groupIndex}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {physicalGroup.fields.map((field, fieldIndex) => {
            const valLower = (field.value || "").toLowerCase()
            let badgeClass = "text-active-border"
            if (valLower.includes("medium") || valLower.includes("mid") || valLower.includes("moderate")) {
              badgeClass = "text-pending-border"
            } else if (valLower.includes("high") || valLower.includes("serious") || valLower.includes("poor") || valLower.includes("incontinent")) {
              badgeClass = "text-warning-border"
            }

            return (
              <div
                key={fieldIndex}
                className="p-5 bg-secondary-light rounded-[8px] space-y-2.5 flex flex-col justify-between shadow-2xs"
              >
                <span className="text-xs font-normal text-body-text font-dm-san-regular block">
                  {field.label}
                </span>

                <div className="space-y-1">
                  <span className="text-lg font-semibold font-dm-san-regular text-body-text block">
                    {field.value || "Normal"}
                  </span>
                </div>

                {/* {field.status && (
                  <span className={`${badgeClass} font-dm-san-regular font-bold text-xs self-start`}>
                    {field.status}
                  </span>
                )} */}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
