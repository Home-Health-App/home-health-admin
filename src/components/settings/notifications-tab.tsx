"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

function Switch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-hidden ${
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
  const [notifications, setNotifications] = useState({
    vitalsAlert: true,
    weeklyInsights: true,
    dailyReport1: true,
    dailyReport2: true,
  })

  const handleSave = () => {
    alert("Notification preferences updated successfully!")
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1">
        <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text">
          Notification Preferences
        </h2>
        <p className="text-sm font-normal font-dm-san-regular text-body-text">
          Control how and when you receive alerts from the Admin system.
        </p>
      </div>

      <div className="space-y-6 pt-4 max-w-full">
        <div className="flex items-center justify-between py-1.5">
          <span className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
            New Vital Signs Alert
          </span>
          <Switch
            checked={notifications.vitalsAlert}
            onChange={(val) => setNotifications({ ...notifications, vitalsAlert: val })}
          />
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
            Weekly AI Insights
          </span>
          <Switch
            checked={notifications.weeklyInsights}
            onChange={(val) => setNotifications({ ...notifications, weeklyInsights: val })}
          />
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
            Daily Summary Report
          </span>
          <Switch
            checked={notifications.dailyReport1}
            onChange={(val) => setNotifications({ ...notifications, dailyReport1: val })}
          />
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
            Daily Summary Report
          </span>
          <Switch
            checked={notifications.dailyReport2}
            onChange={(val) => setNotifications({ ...notifications, dailyReport2: val })}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            className="rounded-full bg-primary-color hover:bg-primary-color text-sm text-white font-dm-san-regular font-semibold px-6 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Update Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
