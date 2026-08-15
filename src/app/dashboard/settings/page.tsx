"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Reusable Switch Component matching mockup precisely
function Switch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-hidden ${
        checked ? "bg-[#0B1E3F]" : "bg-zinc-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@gmail.com",
  })

  const [notifications, setNotifications] = useState({
    vitalsAlert: true,
    weeklyInsights: true,
    dailyReport1: true,
    dailyReport2: true,
  })

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Profile saved successfully!")
  }

  const handleNotificationsSave = () => {
    alert("Notification preferences updated successfully!")
  }

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-950">
          Settings
        </h1>
        <p className="text-zinc-500 font-sans mt-1 text-sm">
          Manage your platform configurations and preferences.
        </p>
      </div>

      {/* Vertical Tabs Workspace */}
      <Tabs defaultValue="profile" orientation="vertical" className="w-full flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column Tabs Sidebar */}
        <TabsList variant="line" className="flex flex-col gap-1 w-full md:w-64 bg-transparent p-0 border-none justify-start shrink-0">
          <TabsTrigger
            value="profile"
            className="w-full justify-start text-sm font-semibold font-sans py-3.5 px-4.5 rounded-xl border-none data-active:bg-[#EEF2F6] data-active:text-[#0C1E3E] text-zinc-500 hover:text-zinc-900 transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
          >
            Account Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start text-sm font-semibold font-sans py-3.5 px-4.5 rounded-xl border-none data-active:bg-[#EEF2F6] data-active:text-[#0C1E3E] text-zinc-500 hover:text-zinc-900 transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Right Column Content Panel */}
        <div className="flex-1 w-full bg-white border border-zinc-200/50 rounded-2xl p-8 shadow-3xs min-h-[400px]">
          
          {/* Account Profile Content */}
          <TabsContent value="profile" className="mt-0 outline-hidden space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans text-zinc-950">
                Account Profile
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Manage your personal information
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-semibold text-zinc-800">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="h-11 px-4 rounded-xl border border-zinc-200 font-sans text-sm focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50/10"
                  />
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-semibold text-zinc-800">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="h-11 px-4 rounded-xl border border-zinc-200 font-sans text-sm focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <label className="text-xs font-semibold text-zinc-800">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="h-11 px-4 rounded-xl border border-zinc-200 font-sans text-sm focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50/10"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Notifications Preferences Content */}
          <TabsContent value="notifications" className="mt-0 outline-hidden space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans text-zinc-950">
                Notification Preferences
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Control how and when you receive alerts from the Admin system.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between py-1.5">
                <span className="font-bold text-zinc-950 text-sm font-sans">
                  New Vital Signs Alert
                </span>
                <Switch
                  checked={notifications.vitalsAlert}
                  onChange={(val) => setNotifications({ ...notifications, vitalsAlert: val })}
                />
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between py-1.5">
                <span className="font-bold text-zinc-950 text-sm font-sans">
                  Weekly AI Insights
                </span>
                <Switch
                  checked={notifications.weeklyInsights}
                  onChange={(val) => setNotifications({ ...notifications, weeklyInsights: val })}
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between py-1.5">
                <span className="font-bold text-zinc-950 text-sm font-sans">
                  Daily Summary Report
                </span>
                <Switch
                  checked={notifications.dailyReport1}
                  onChange={(val) => setNotifications({ ...notifications, dailyReport1: val })}
                />
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between py-1.5">
                <span className="font-bold text-zinc-950 text-sm font-sans">
                  Daily Summary Report
                </span>
                <Switch
                  checked={notifications.dailyReport2}
                  onChange={(val) => setNotifications({ ...notifications, dailyReport2: val })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNotificationsSave}
                  className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden"
                >
                  Update Changes
                </Button>
              </div>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}