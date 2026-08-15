"use client"

import React, { useState, useMemo } from "react"
import { IconDots } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface AlertNotification {
  id: string
  title: string
  label: "Incitals" | "Medications" | "Incidents" | "Caregiver" | "Family" | "AI Reports"
  snippet: string
  timeString: string
  patient?: string
  caregiver?: string
  unread: boolean
}

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: "1",
    title: "New Incident Reported",
    label: "Incidents",
    snippet: "Patient Eleanor Vance reported a fall in the bathroom at 09:15 AM. Caregiver Sarah Jenkins is on-site and assessing the situation. Initial reports indicate no severe trauma, but standard protocol requires immediate review.",
    timeString: "Time",
    patient: "Dean Winchester",
    caregiver: "Bobby Singer",
    unread: true,
  },
  {
    id: "2",
    title: "Notification Title",
    label: "Incidents",
    snippet: "This is going to be a snippet of the notification",
    timeString: "Time",
    unread: true,
  },
  {
    id: "3",
    title: "Notification Title",
    label: "Incidents",
    snippet: "This is going to be a snippet of the notification",
    timeString: "Time",
    unread: false,
  },
  {
    id: "4",
    title: "Notification Title",
    label: "Incidents",
    snippet: "This is going to be a snippet of the notification",
    timeString: "Time",
    unread: false,
  },
]

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Category list definitions
  const categories = ["Vitals", "Medications", "Incidents", "Caregiver", "Family", "AI Reports"]

  // Handle category checkbox toggles
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  // Mark single alert as read
  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })))
  }

  // Filter alerts by category if checked
  const filteredAlerts = useMemo(() => {
    if (selectedCategories.length === 0) return alerts
    return alerts.filter((a) => selectedCategories.includes(a.label))
  }, [alerts, selectedCategories])

  const unreadAlerts = useMemo(() => {
    return filteredAlerts.filter((a) => a.unread)
  }, [filteredAlerts])

  const totalCount = filteredAlerts.length
  const unreadCount = alerts.filter((a) => a.unread).length

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-950">
          Notification Center
        </h1>
        <p className="text-zinc-500 font-sans mt-1 text-sm">
          Review and manage clinical alerts.
        </p>
      </div>

      <Tabs defaultValue="all" orientation="vertical" className="w-full flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Column Sidebar (Vertical Tabs & Filter checkboxes) */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          
          {/* Vertical tabs options */}
          <TabsList variant="line" className="flex flex-col gap-1 w-full bg-transparent p-0 border-none justify-start shrink-0">
            <TabsTrigger
              value="all"
              className="w-full justify-between text-sm font-semibold font-sans py-3.5 px-4.5 rounded-xl border-none data-active:bg-[#EEF2F6] data-active:text-[#0C1E3E] text-zinc-500 hover:text-zinc-900 transition-all flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
            >
              <span>All Notifications</span>
              <span className="size-5 bg-[#5D89C3] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                12
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="w-full justify-between text-sm font-semibold font-sans py-3.5 px-4.5 rounded-xl border-none data-active:bg-[#EEF2F6] data-active:text-[#0C1E3E] text-zinc-500 hover:text-zinc-900 transition-all flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
            >
              <span>Unread</span>
              <span className="size-5 bg-[#0B1E3F] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                {unreadCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="h-px bg-zinc-200/60 my-2" />

          {/* Filter Categories list */}
          <div className="space-y-4 px-1">
            <h3 className="text-xs font-bold text-zinc-700 tracking-wide font-sans block uppercase">
              Filter by Categories
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className="size-4.5 rounded-md border-zinc-300 accent-[#0B1E3F] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-zinc-600 font-sans group-hover:text-zinc-900 transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Contents workspace */}
        <div className="flex-1 w-full bg-transparent min-h-[450px] relative">
          
          {/* Mark all as read link */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="absolute top-0 right-0 text-xs font-bold text-[#0B1E3F] hover:underline cursor-pointer font-sans z-10"
            >
              Mark all as read
            </button>
          )}

          {/* All Notifications List */}
          <TabsContent value="all" className="mt-0 outline-hidden pt-8 space-y-4">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => markAsRead(a.id)}
                  className="bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-3xs flex relative cursor-pointer hover:bg-zinc-50/40 transition-all"
                >
                  {/* Left indicator blue border */}
                  {a.unread && (
                    <span className="absolute left-0 top-6 bottom-6 w-1 bg-[#0B1E3F] rounded-r-md" />
                  )}

                  <div className="flex-1 min-w-0 font-sans pl-1.5 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-zinc-950 block">
                            {a.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-medium">
                          <span>{a.timeString}</span>
                          <span className="bg-[#EEF2F6] text-[#0C1E3E] border border-zinc-200/50 font-sans font-semibold px-2.5 py-0.5 text-3xs rounded-full uppercase tracking-wider">
                            {a.label}
                          </span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-zinc-100 rounded-md outline-hidden shrink-0">
                        <IconDots className="size-5 text-zinc-500" />
                      </button>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed font-sans font-medium">
                      {a.snippet}
                    </p>

                    {a.patient && (
                      <div className="flex items-center gap-6 pt-1 text-xs text-zinc-500 font-medium">
                        <div>
                          <span className="font-bold text-zinc-900 font-sans">Patient</span>{" "}
                          <span className="font-sans font-semibold text-zinc-600">{a.patient}</span>
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 font-sans">Caregiver</span>{" "}
                          <span className="font-sans font-semibold text-zinc-600">{a.caregiver}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 space-y-2">
                <h3 className="text-lg font-bold text-zinc-950 font-sans">
                  No Notifications
                </h3>
                <p className="text-sm text-zinc-500 font-sans">
                  You're all caught up. Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Unread Notifications List (Empty State matches Image 3) */}
          <TabsContent value="unread" className="mt-0 outline-hidden pt-8 space-y-4">
            {unreadAlerts.length > 0 ? (
              unreadAlerts.map((a) => (
                <div
                  key={a.id}
                  onClick={() => markAsRead(a.id)}
                  className="bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-3xs flex relative cursor-pointer hover:bg-zinc-50/40 transition-all"
                >
                  <span className="absolute left-0 top-6 bottom-6 w-1 bg-[#0B1E3F] rounded-r-md" />

                  <div className="flex-1 min-w-0 font-sans pl-1.5 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-zinc-950 block">
                            {a.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-medium">
                          <span>{a.timeString}</span>
                          <span className="bg-[#EEF2F6] text-[#0C1E3E] border border-zinc-200/50 font-sans font-semibold px-2.5 py-0.5 text-3xs rounded-full uppercase tracking-wider">
                            {a.label}
                          </span>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-zinc-100 rounded-md outline-hidden shrink-0">
                        <IconDots className="size-5 text-zinc-500" />
                      </button>
                    </div>

                    <p className="text-sm text-zinc-600 leading-relaxed font-sans font-medium">
                      {a.snippet}
                    </p>

                    {a.patient && (
                      <div className="flex items-center gap-6 pt-1 text-xs text-zinc-500 font-medium">
                        <div>
                          <span className="font-bold text-zinc-900 font-sans">Patient</span>{" "}
                          <span className="font-sans font-semibold text-zinc-600">{a.patient}</span>
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 font-sans">Caregiver</span>{" "}
                          <span className="font-sans font-semibold text-zinc-600">{a.caregiver}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 space-y-1.5 flex flex-col justify-center items-center h-full min-h-[300px]">
                <h3 className="text-xl font-bold text-zinc-950 font-sans block">
                  No Notifications
                </h3>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed block">
                  You're all caught up. Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>

        </div>

      </Tabs>
    </div>
  )
}
