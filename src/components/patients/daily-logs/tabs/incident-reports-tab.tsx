import React from "react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/libs/helper"

export interface IncidentReportDisplayItem {
  id: string
  incident_type: string
  severity?: string
  time?: string
  description?: string
  notes?: string
  action_taken?: string
  location?: string
  reported_to_family?: boolean
  reported_to_family_time?: string | null
  reported_to_professional?: boolean
  reported_to_professional_time?: string | null
  next_follow_up_date?: string | null
}

interface IncidentReportsTabProps {
  reports: IncidentReportDisplayItem[]
}

export default function IncidentReportsTab({ reports }: IncidentReportsTabProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 font-dm-san-regular text-sm italic">
        No incident reports recorded at this time.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {reports.map((item, index) => {
        const sevLower = (item.severity || "").toLowerCase()
        let badgeClass = "bg-active-btn text-active-border border-active-border"
        if (sevLower.includes("medium") || sevLower.includes("mid") || sevLower.includes("mod")) {
          badgeClass = "bg-pending-btn text-pending-border border-pending-border"
        } else if (
          sevLower.includes("high") ||
          sevLower.includes("serious") ||
          sevLower.includes("critical")
        ) {
          badgeClass = "text-warning-border bg-warning-btn text-warning-border border-warning-border"
        }

        return (
          <div
            key={item.id || index}
            className="p-6 bg-secondary-light rounded-[8px] space-y-4 flex flex-col justify-between shadow-2xs"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold font-dm-san-regular text-body-text">
                  {item.incident_type || "Incident Report"}
                </h3>
                {item.severity && (
                  <Badge
                    variant="outline"
                    className={`${badgeClass} font-dm-san-regular font-normal px-3 py-0.5 rounded-full shadow-none text-xs tracking-wider capitalize`}
                  >
                    {item.severity}
                  </Badge>
                )}
              </div>
              {item.time && (
                <span className="text-xs font-normal text-body-text font-dm-san-regular shrink-0">
                  {item.time}
                </span>
              )}
            </div>

            <div className="space-y-3 font-dm-san-regular text-sm text-body-text leading-relaxed">
              {item.location && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-body-text">Location:</span>
                  <span>{item.location}</span>
                </div>
              )}

              {(item.description || item.notes) && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-body-text shrink-0">Details:</span>
                  <span>{item.description || item.notes}</span>
                </div>
              )}

              {item.action_taken && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-body-text shrink-0">Action Taken:</span>
                  <span>{item.action_taken}</span>
                </div>
              )}

              {item.reported_to_family && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-body-text">Reported to Family:</span>
                  <span className="text-active-border font-medium">
                    Yes{" "}
                    {item.reported_to_family_time
                      ? `(${formatDate(item.reported_to_family_time, "MMM dd, yyyy") || item.reported_to_family_time})`
                      : ""}
                  </span>
                </div>
              )}

              {item.reported_to_professional && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-body-text">Reported to Professional:</span>
                  <span className="text-active-border font-medium">
                    Yes{" "}
                    {item.reported_to_professional_time
                      ? `(${formatDate(item.reported_to_professional_time, "MMM dd, yyyy") || item.reported_to_professional_time})`
                      : ""}
                  </span>
                </div>
              )}

              {item.next_follow_up_date && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-body-text">Next Follow-up:</span>
                  <span>{formatDate(item.next_follow_up_date, "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
