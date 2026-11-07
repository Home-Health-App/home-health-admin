"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import { authAtom } from "@/states/auth.atom"
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/hooks/notification-preferences.hook"
import { toast } from "sonner"

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-hidden disabled:opacity-50 ${
        checked ? "bg-primary-light" : "bg-zinc-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full shadow-xs transition duration-200 ease-in-out ${
          checked ? "translate-x-5 bg-primary-color" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  )
}

export default function NotificationsTab() {
  const auth = useAtomValue(authAtom)
  const adminId = auth?.admin?.id || ""

  const { data: preferenceResponse, isPending: loadingPreferences } = useGetNotificationPreferences(adminId)
  const { mutate: updatePreferences, isPending: updatingPreferences } = useUpdateNotificationPreferences()

  const [preferences, setPreferences] = useState({
    vitals: true,
    medication: true,
    symptoms: true,
    moods: true,
    activities: true,
    incident_reports: true,
    care_giver: true,
    ai_report: true,
  })

  useEffect(() => {
    if (preferenceResponse?.data) {
      const d = preferenceResponse.data
      setPreferences({
        vitals: d.vitals,
        medication: d.medication,
        symptoms: d.symptoms,
        moods: d.moods,
        activities: d.activities,
        incident_reports: d.incident_reports,
        care_giver: d.care_giver,
        ai_report: d.ai_report,
      })
    }
  }, [preferenceResponse])

  const handleSave = () => {
    if (!adminId) {
      toast.error("Admin session not found.")
      return
    }
    updatePreferences(
      { adminId, payload: preferences },
      {
        onSuccess: () => {
          toast.success("Notification preferences updated successfully!")
        },
        onError: () => {
          toast.error("Failed to update notification preferences.")
        },
      }
    )
  }

  const preferenceFields = [
    { key: "vitals", label: "New Vital Signs Alert", desc: "Receive immediate updates on vital sign shifts." },
    { key: "medication", label: "Medication Updates", desc: "Alerts on caregiver medication administration logs." },
    { key: "symptoms", label: "Symptom Log Reports", desc: "Get notifications when new symptoms are reported." },
    { key: "moods", label: "Mood/Behavior Shifts", desc: "Updates on patient emotional/behavioral logs." },
    { key: "activities", label: "Daily Activity Summaries", desc: "Daily highlights of patient tasks & actions." },
    { key: "incident_reports", label: "Incident & Emergency Alerts", desc: "Immediate alarms on falls, accidents, or urgent events." },
    { key: "care_giver", label: "Caregiver Activity Updates", desc: "Tracking logs on caregiver check-in and check-out times." },
    { key: "ai_report", label: "Weekly AI Insights & Reports", desc: "Receive automated health analysis digests weekly." },
  ] as const

  return (
    <div className="space-y-6 w-full font-dm-san-regular">
      <div className="space-y-1">
        <h2 className="text-[22px] font-medium text-heading-text">
          Notification Preferences
        </h2>
        <p className="text-sm font-normal text-body-text/70">
          Control how and when you receive alerts from the Admin system.
        </p>
      </div>

      {loadingPreferences ? (
        <div className="space-y-6 pt-4 max-w-full animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-zinc-100 pb-3">
              <div className="space-y-1 flex-1">
                <div className="h-4 bg-zinc-200/70 rounded w-1/3" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
              </div>
              <div className="h-6 w-11 bg-zinc-200/70 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2 pt-4 max-w-full">
          {preferenceFields.map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between py-1.5 border-b border-zinc-100/50 pb-4">
              <div className="space-y-0.5 flex-1 pr-4">
                <span className="font-semibold text-heading-text text-sm block">
                  {label}
                </span>
                <span className="text-xs text-zinc-400 font-normal block leading-relaxed">
                  {desc}
                </span>
              </div>
              <Switch
                disabled={updatingPreferences}
                checked={preferences[key as keyof typeof preferences]}
                onChange={(val) => setPreferences((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={updatingPreferences}
              className="rounded-full bg-primary-color hover:bg-primary-color/90 text-sm text-white font-semibold px-8 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:opacity-50"
            >
              {updatingPreferences ? "Saving Changes..." : "Update Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
