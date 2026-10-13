"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconFilterOff } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"
import { columns } from "./columns"
import { useGetActivityLogs } from "@/hooks/activity-log.hook"
import { useAtomValue } from "jotai"
import { authAtom } from "@/states/auth.atom"

export default function AuditLogsView() {
  const auth = useAtomValue(authAtom)
  const adminId = auth?.admin?.id

  const { data: logsResponse, isLoading } = useGetActivityLogs({
    admin_id: adminId || undefined,
    limit: 100,
    // user_id: undefined,
    // patient_id: undefined,
  })

  const logs = useMemo(() => {
    const raw = logsResponse?.data || []
    return [...raw].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
      return timeB - timeA
    })
  }, [logsResponse])

  const [search, setSearch] = useState("")
  const [timeframe, setTimeframe] = useState("All Time")
  const [eventType, setEventType] = useState("All Event Types")
  const [logType, setLogType] = useState("All Log Types")

  // Dynamically extract unique actions & log types from received data
  const actionOptions = useMemo(() => {
    const actions = new Set<string>()
    logs.forEach((log) => {
      if (log.action) actions.add(log.action)
    })
    return Array.from(actions)
  }, [logs])

  const logTypeOptions = useMemo(() => {
    const types = new Set<string>()
    logs.forEach((log) => {
      if (log.log_type) types.add(log.log_type)
    })
    return Array.from(types)
  }, [logs])

  // Reset filters
  const handleClearFilters = () => {
    setSearch("")
    setTimeframe("All Time")
    setEventType("All Event Types")
    setLogType("All Log Types")
  }

  // Filter logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search filter
      const searchLower = search.toLowerCase().trim()
      const matchesSearch =
        !searchLower ||
        log.message?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.actor_type?.toLowerCase().includes(searchLower) ||
        log.log_type?.toLowerCase().includes(searchLower)

      // 2. Event type (Action) filter
      const matchesEventType =
        eventType === "All Event Types" || log.action === eventType

      // 3. Log type filter
      const matchesLogType =
        logType === "All Log Types" || log.log_type === logType

      // 4. Timeframe filter
      let matchesTimeframe = true
      if (timeframe !== "All Time" && log.created_at) {
        const logDate = new Date(log.created_at).getTime()
        const now = Date.now()
        const diffMs = now - logDate

        if (timeframe === "24 Hours") {
          matchesTimeframe = diffMs <= 24 * 60 * 60 * 1000
        } else if (timeframe === "7 Days" || timeframe === "1 week") {
          matchesTimeframe = diffMs <= 7 * 24 * 60 * 60 * 1000
        } else if (timeframe === "30 Days") {
          matchesTimeframe = diffMs <= 30 * 24 * 60 * 60 * 1000
        }
      }

      return (
        matchesSearch &&
        matchesEventType &&
        matchesLogType &&
        matchesTimeframe
      )
    })
  }, [logs, search, timeframe, eventType, logType])

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
        <div className="relative h-14 w-full sm:w-110">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-6 text-body-text opacity-40" />
          <Input
            type="text"
            placeholder="Search activity logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 h-full rounded-full border border-[#A1A1A1] shadow-none font-sans text-sm focus-visible:border-[#999999] focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
          />
        </div>
        {/* Dropdowns Filters */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {/* Timeframe Select */}
          <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
            <SelectTrigger className="h-10! rounded-[8px] border border-body-text bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[130px] shadow-none">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All Time">
                All Time
              </SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="24 Hours">
                24 Hours
              </SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="7 Days">
                7 Days
              </SelectItem>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="30 Days">
                30 Days
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Event Type / Action Select */}
          <Select value={eventType} onValueChange={(val) => setEventType(val!)}>
            <SelectTrigger className="h-10! rounded-[8px] border border-body-text bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[170px] shadow-none">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All Event Types">
                All Event Types
              </SelectItem>
              {actionOptions.map((action) => (
                <SelectItem
                  key={action}
                  className="font-dm-san-regular font-normal text-sm"
                  value={action}
                >
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Log Type Select */}
          <Select value={logType} onValueChange={(val) => setLogType(val!)}>
            <SelectTrigger className="h-10! rounded-[8px] border border-body-text bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-[160px] shadow-none">
              <SelectValue placeholder="Log Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="font-dm-san-regular font-normal text-sm" value="All Log Types">
                All Log Types
              </SelectItem>
              {logTypeOptions.map((type) => (
                <SelectItem
                  key={type}
                  className="font-dm-san-regular font-normal text-sm"
                  value={type}
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Pane */}
      {isLoading ? (
        <div className="border border-zinc-200/60 rounded-[8px] p-12 bg-white flex flex-col items-center justify-center gap-3">
          <div className="size-8 rounded-full border-2 border-[#0B1E3F] border-t-transparent animate-spin" />
          <p className="text-sm font-dm-san-regular text-zinc-500">Loading activity logs...</p>
        </div>
      ) : filteredLogs.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredLogs}
          pageSize={10}
          isPaginated={true}
        />
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-28 text-center font-dm-san-regular bg-white rounded-[8px] border border-zinc-200/60">
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconFilterOff className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-normal text-body-text mb-1.5 font-dm-san-regular">
            No matching activity logs found
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
