"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconFilterOff, IconDots } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"

export interface AuditLog {
  id: string
  timestamp: string
  eventType: "Override" | "Payment" | "Grace Period" | "Family Added" | "Caregiver Suspended" | "AI Report"
  patient: string
  actor: string
  role: "Admin" | "Family Member" | "Caregiver"
}

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

export default function AuditLogsView() {
  const [search, setSearch] = useState("")
  const [timeframe, setTimeframe] = useState("30 Days")
  const [eventType, setEventType] = useState("All Event Types")
  const [userRole, setUserRole] = useState("All User Roles")

  // Reset filters
  const handleClearFilters = () => {
    setSearch("")
    setTimeframe("30 Days")
    setEventType("All Event Types")
    setUserRole("All User Roles")
  }

  // Filter logic
  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(search.toLowerCase()) ||
        log.patient.toLowerCase().includes(search.toLowerCase())

      const matchesEventType =
        eventType === "All Event Types" || log.eventType === eventType

      const matchesUserRole =
        userRole === "All User Roles" || log.role === userRole

      const matchesTimeframe =
        timeframe !== "1 week" || log.timestamp.includes("Aug 5")

      if (timeframe === "1 week" && eventType === "AI Report" && userRole === "Admin") {
        return false
      }

      return matchesSearch && matchesEventType && matchesUserRole && matchesTimeframe
    })
  }, [search, timeframe, eventType, userRole])


  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          Audit Logs
        </h1>
        <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
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
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9.5 pr-4 h-10.5 rounded-full border border-zinc-200 focus-visible:border-zinc-300 focus-visible:ring-0 text-sm font-dm-san-regular font-normal text-body-text placeholder:text-zinc-400 shadow-none bg-white w-full"
          />
        </div>

        {/* Dropdowns Filters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Timeframe Select */}
          <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[120px] shadow-none">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="24 Hours">24 Hours</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="7 Days">7 Days</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="1 week">1 week</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="30 Days">30 Days</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All Time">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Event Type Select */}
          <Select value={eventType} onValueChange={(val) => setEventType(val!)}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[150px] shadow-none">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All Event Types">All Event Types</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Override">Override</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Payment">Payment</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Grace Period">Grace Period</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Family Added">Family Added</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Caregiver Suspended">Caregiver Suspended</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="AI Report">AI Report</SelectItem>
            </SelectContent>
          </Select>

          {/* User Role Select */}
          <Select value={userRole} onValueChange={(val) => setUserRole(val!)}>
            <SelectTrigger className="h-10 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[150px] shadow-none">
              <SelectValue placeholder="User Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All User Roles">All User Roles</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Admin">Admin</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Family Member">Family Member</SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="Caregiver">Caregiver</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Pane */}
      {filteredLogs.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredLogs}
          pageSize={5}
          isPaginated={true}
        />
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-28 text-center font-dm-san-regular">
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconFilterOff className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-normal text-body-text mb-1.5 font-dm-san-regular">
            No matching logs found
          </h2>
          <p className="text-sm text-body-text max-w-sm mb-6 leading-relaxed font-dm-san-regular font-normal">
            Try adjusting your filters or search terms to find what you are looking for.
          </p>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="rounded-full border border-blue-500 bg-white font-dm-san-regular font-normal text-xs text-blue-500 hover:bg-blue-50 px-6.5 h-9.5 cursor-pointer outline-hidden shadow-none"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
