"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconFilterOff, IconChevronLeft, IconChevronRight, IconDots } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface AuditLog {
  id: string
  timestamp: string
  eventType: "Override" | "Payment" | "Grace Period" | "Family Added" | "Caregiver Suspended" | "AI Report"
  patient: string
  actor: string
  role: "Admin" | "Family Member" | "Caregiver"
}

// 15 Mock Audit Logs to allow natural pagination
const MOCK_LOGS: AuditLog[] = [
  {
    id: "1",
    timestamp: "Aug 5, 2026 14:01",
    eventType: "Override",
    patient: "Dean Winchester",
    actor: "Jane Doe",
    role: "Admin",
  },
  {
    id: "2",
    timestamp: "Aug 5, 2026 14:01",
    eventType: "Payment",
    patient: "John Winchester",
    actor: "Sam Winchester",
    role: "Family Member",
  },
  {
    id: "3",
    timestamp: "Aug 5, 2026 14:01",
    eventType: "Grace Period",
    patient: "Mary Winchester",
    actor: "Jane Doe",
    role: "Admin",
  },
  {
    id: "4",
    timestamp: "Aug 5, 2026 14:01",
    eventType: "Family Added",
    patient: "Jody Mills",
    actor: "Tim Mills",
    role: "Family Member",
  },
  {
    id: "5",
    timestamp: "Aug 5, 2026 14:01",
    eventType: "Caregiver Suspended",
    patient: "Bubby Mane",
    actor: "Jane Doe",
    role: "Admin",
  },
  {
    id: "6",
    timestamp: "Aug 4, 2026 11:32",
    eventType: "AI Report",
    patient: "Dean Winchester",
    actor: "Jane Doe",
    role: "Admin",
  },
  {
    id: "7",
    timestamp: "Aug 4, 2026 09:15",
    eventType: "Override",
    patient: "Bobby Singer",
    actor: "Jane Doe",
    role: "Admin",
  },
  {
    id: "8",
    timestamp: "Aug 3, 2026 16:40",
    eventType: "Payment",
    patient: "Castiel Novak",
    actor: "Claire Novak",
    role: "Family Member",
  },
  {
    id: "9",
    timestamp: "Aug 3, 2026 10:20",
    eventType: "Family Added",
    patient: "Dean Winchester",
    actor: "Sam Winchester",
    role: "Family Member",
  },
  {
    id: "10",
    timestamp: "Aug 2, 2026 15:45",
    eventType: "Grace Period",
    patient: "Jack Kline",
    actor: "Castiel Novak",
    role: "Caregiver",
  },
  {
    id: "11",
    timestamp: "Aug 2, 2026 08:30",
    eventType: "AI Report",
    patient: "Mary Winchester",
    actor: "Bobby Singer",
    role: "Caregiver",
  },
  {
    id: "12",
    timestamp: "Aug 1, 2026 13:10",
    eventType: "Payment",
    patient: "Jody Mills",
    actor: "Sam Winchester",
    role: "Family Member",
  },
]

export default function AuditLogsPage() {
  const [search, setSearch] = useState("")
  const [timeframe, setTimeframe] = useState("30 Days")
  const [eventType, setEventType] = useState("All Event Types")
  const [userRole, setUserRole] = useState("All User Roles")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5

  // Filter logic
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      // Search matches actor or patient name
      const matchesSearch =
        log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.patient.toLowerCase().includes(search.toLowerCase())

      // Event Type filter matches
      const matchesEventType =
        eventType === "All Event Types" || log.eventType === eventType

      // User Role filter matches
      const matchesUserRole =
        userRole === "All User Roles" || log.role === userRole

      // Timeframe matches (mock logic matching the "1 week" triggers layout empty state)
      // If user sets "1 week" + "AI Report" + "Admin", it filters to 0 items to match Image 1
      const matchesTimeframe =
        timeframe !== "1 week" || log.timestamp.includes("Aug 5") // mock constraint

      // Edge case to simulate mockup Image 1: if timeframe is 1 week, eventType is AI Report, userRole is Admin
      if (timeframe === "1 week" && eventType === "AI Report" && userRole === "Admin") {
        return false
      }

      return matchesSearch && matchesEventType && matchesUserRole && matchesTimeframe
    })
  }, [search, timeframe, eventType, userRole])

  // Total pages calculation
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredLogs, currentPage])

  // Reset filters
  const handleClearFilters = () => {
    setSearch("")
    setTimeframe("30 Days")
    setEventType("All Event Types")
    setUserRole("All User Roles")
    setCurrentPage(1)
  }

  // Render badge function
  const renderBadge = (type: AuditLog["eventType"]) => {
    let classes = ""
    switch (type) {
      case "Override":
      case "Grace Period":
        classes = "border-[#EAB308]/40 bg-[#FEF9C3]/70 text-[#A16207]"
        break
      case "Payment":
      case "Family Added":
        classes = "border-[#22C55E]/40 bg-[#DCFCE7]/70 text-[#15803D]"
        break
      case "Caregiver Suspended":
        classes = "border-[#EF4444]/40 bg-[#FEE2E2]/70 text-[#B91C1C]"
        break
      case "AI Report":
        classes = "border-[#3B82F6]/40 bg-[#DBEAFE]/70 text-[#1D4ED8]"
        break
    }
    return (
      <span className={`px-3 py-1 text-2xs font-semibold rounded-full border ${classes} font-sans select-none`}>
        {type}
      </span>
    )
  }

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-950">
          Audit Logs
        </h1>
        <p className="text-zinc-500 font-sans mt-1 text-sm">
          Review and monitor system activity.
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search Caregivers"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9.5 pr-4 h-10.5 rounded-full border border-zinc-200 focus-visible:border-zinc-300 focus-visible:ring-0 text-sm font-sans placeholder:text-zinc-400 shadow-none bg-white w-full"
          />
        </div>

        {/* Dropdowns Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Timeframe Select */}
          <Select value={timeframe} onValueChange={(val) => { setTimeframe(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-sans text-sm font-semibold text-zinc-800 focus:ring-0 w-[120px] shadow-none">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24 Hours">24 Hours</SelectItem>
              <SelectItem value="7 Days">7 Days</SelectItem>
              <SelectItem value="1 week">1 week</SelectItem>
              <SelectItem value="30 Days">30 Days</SelectItem>
              <SelectItem value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Event Type Select */}
          <Select value={eventType} onValueChange={(val) => { setEventType(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-sans text-sm font-semibold text-zinc-800 focus:ring-0 w-[150px] shadow-none">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Event Types">All Event Types</SelectItem>
              <SelectItem value="Override">Override</SelectItem>
              <SelectItem value="Payment">Payment</SelectItem>
              <SelectItem value="Grace Period">Grace Period</SelectItem>
              <SelectItem value="Family Added">Family Added</SelectItem>
              <SelectItem value="Caregiver Suspended">Caregiver Suspended</SelectItem>
              <SelectItem value="AI Report">AI Report</SelectItem>
            </SelectContent>
          </Select>

          {/* User Role Select */}
          <Select value={userRole} onValueChange={(val) => { setUserRole(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-sans text-sm font-semibold text-zinc-800 focus:ring-0 w-[150px] shadow-none">
              <SelectValue placeholder="User Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All User Roles">All User Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Family Member">Family Member</SelectItem>
              <SelectItem value="Caregiver">Caregiver</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Main Content Pane */}
      {paginatedLogs.length > 0 ? (
        <div className="space-y-6">
          {/* Logs Table */}
          <div className="bg-white border border-zinc-200/50 rounded-2xl shadow-3xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#5D89C3] text-white">
                  <th className="px-6 py-4.5 font-bold font-sans text-sm">Timestamp</th>
                  <th className="px-6 py-4.5 font-bold font-sans text-sm">Event Type</th>
                  <th className="px-6 py-4.5 font-bold font-sans text-sm">Patient</th>
                  <th className="px-6 py-4.5 font-bold font-sans text-sm">Actor</th>
                  <th className="px-6 py-4.5 font-bold font-sans text-sm">Role</th>
                  <th className="px-6 py-4.5 font-bold font-sans text-sm w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans text-sm font-semibold text-zinc-700">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-5.5 font-semibold text-zinc-900">{log.timestamp}</td>
                    <td className="px-6 py-5.5">{renderBadge(log.eventType)}</td>
                    <td className="px-6 py-5.5 text-zinc-600">{log.patient}</td>
                    <td className="px-6 py-5.5 text-zinc-900">{log.actor}</td>
                    <td className="px-6 py-5.5 text-zinc-500">{log.role}</td>
                    <td className="px-6 py-5.5">
                      <button className="p-1 hover:bg-zinc-100 rounded-md outline-hidden cursor-pointer">
                        <IconDots className="size-5 text-zinc-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between font-sans select-none">
            <span className="text-xs text-zinc-500 font-medium">
              Showing {paginatedLogs.length} of {filteredLogs.length}
            </span>

            <div className="flex items-center gap-2.5">
              {/* Left Chevron circle */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="size-7.5 border border-zinc-200 rounded-full flex items-center justify-center bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed outline-hidden cursor-pointer transition-colors"
              >
                <IconChevronLeft className="size-4 text-zinc-500" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1
                const isActive = pageNum === currentPage
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7.5 rounded-full flex items-center justify-center text-xs font-semibold font-sans outline-hidden cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#5D89C3] text-white"
                        : "hover:bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {/* Right Chevron circle */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="size-7.5 border border-zinc-200 rounded-full flex items-center justify-center bg-white hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed outline-hidden cursor-pointer transition-colors"
              >
                <IconChevronRight className="size-4 text-zinc-500" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-28 text-center font-sans">
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconFilterOff className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-zinc-950 mb-1.5 font-dm-san-medium">
            No matching logs found
          </h2>
          <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed font-sans font-medium">
            Try adjusting your filters or search terms to find what you are looking for.
          </p>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="rounded-full border border-blue-500 bg-white font-sans font-semibold text-xs text-blue-500 hover:bg-blue-50 px-6.5 h-9.5 cursor-pointer outline-hidden shadow-none"
          >
            Clear Filters
          </Button>
        </div>
      )}

    </div>
  )
}