"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { IconClock, IconX, IconPlus } from "@tabler/icons-react"
import { cn } from "@/libs/utils"
import { MedicationSchedule } from "@/types/patient.type"
import { toast } from "sonner"

interface CustomTimeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<MedicationSchedule> | null
  onConfirm: (schedule: MedicationSchedule) => void
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const REPEAT_INTERVALS = [
  "2 hours",
  "3 hours",
  "4 hours",
  "6 hours",
  "8 hours",
  "12 hours",
  "24 hours",
]

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"]

// Parse 12-hour formatted string to parts
function parse12HourTime(time12?: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!time12) return { hour: "08", minute: "00", period: "AM" }
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return { hour: "08", minute: "00", period: "AM" }

  let h = parseInt(match[1], 10)
  if (isNaN(h) || h < 1 || h > 12) h = 8
  const hour = h.toString().padStart(2, "0")
  const minute = match[2] || "00"
  const period = (match[3]?.toUpperCase() === "PM" ? "PM" : "AM") as "AM" | "PM"

  return { hour, minute, period }
}

// Format parts to 12-hour string (e.g. "08:00 AM")
function formatTimeFromParts(hour: string, minute: string, period: "AM" | "PM"): string {
  const h = parseInt(hour, 10)
  const hourFormatted = (isNaN(h) ? 8 : h).toString().padStart(2, "0")
  return `${hourFormatted}:${minute} ${period}`
}

// Convert 12-hour string to minutes from midnight for sorting
function timeToMinutes(time12: string): number {
  const { hour, minute, period } = parse12HourTime(time12)
  let h = parseInt(hour, 10)
  if (period === "PM" && h < 12) h += 12
  if (period === "AM" && h === 12) h = 0
  return h * 60 + parseInt(minute, 10)
}

// Sort times chronologically
function sortTimesChronologically(times: string[]): string[] {
  return [...times].sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
}

// Calculate schedule preview for interval mode over a 24-hour cycle
function calculateIntervalTimes(start12: string, intervalStr: string): string[] {
  const startTotalMinutes = timeToMinutes(start12)
  const hoursMatch = intervalStr.match(/(\d+)/)
  const intervalHours = hoursMatch ? parseInt(hoursMatch[1], 10) : 4

  if (intervalHours <= 0 || intervalHours > 24) return [start12]

  const result: string[] = []
  const endTotalMinutes = startTotalMinutes + 24 * 60

  let current = startTotalMinutes
  while (current < endTotalMinutes && result.length < 12) {
    const normalized = current % (24 * 60)
    let h24 = Math.floor(normalized / 60)
    const m24 = normalized % 60
    const period = h24 >= 12 ? "PM" : "AM"
    let h12 = h24 % 12
    if (h12 === 0) h12 = 12

    const formatted = `${h12.toString().padStart(2, "0")}:${m24.toString().padStart(2, "0")} ${period}`
    result.push(formatted)
    current += intervalHours * 60
  }

  return result
}

interface TimeSelectProps {
  value: string
  onChange: (time: string) => void
  className?: string
}

/**
 * Clean, simplified Time Select matching the application's select aesthetics
 */
function TimeSelect({ value, onChange, className }: TimeSelectProps) {
  const { hour, minute, period } = parse12HourTime(value)

  const handleHour = (newHour: string | null) => {
    if (!newHour) return
    onChange(formatTimeFromParts(newHour, minute, period))
  }

  const handleMinute = (newMinute: string | null) => {
    if (!newMinute) return
    onChange(formatTimeFromParts(hour, newMinute, period))
  }

  const handlePeriod = (newPeriod: string | null) => {
    if (!newPeriod) return
    onChange(formatTimeFromParts(hour, minute, newPeriod as "AM" | "PM"))
  }

  return (
    <div className={cn("flex items-center gap-1.5 shrink-0", className)}>
      {/* Hour Dropdown */}
      <Select value={hour} onValueChange={handleHour}>
        <SelectTrigger className="w-[62px] !h-10 px-2 bg-white border border-zinc-300 rounded-[8px] font-sans font-semibold text-xs sm:text-sm text-heading-text shadow-none focus:ring-0 focus:border-primary-color cursor-pointer">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent className="z-[9999] max-h-56 bg-white border border-zinc-200 shadow-xl rounded-[10px] p-1">
          {HOURS.map((h) => (
            <SelectItem
              key={h}
              value={h}
              className="font-sans text-xs py-1.5 px-2 rounded-[6px] hover:bg-zinc-100 cursor-pointer"
            >
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-zinc-400 font-bold text-sm select-none">:</span>

      {/* Minute Dropdown */}
      <Select value={minute} onValueChange={handleMinute}>
        <SelectTrigger className="w-[62px] !h-10 px-2 bg-white border border-zinc-300 rounded-[8px] font-sans font-semibold text-xs sm:text-sm text-heading-text shadow-none focus:ring-0 focus:border-primary-color cursor-pointer">
          <SelectValue placeholder="Min" />
        </SelectTrigger>
        <SelectContent className="z-[9999] max-h-56 bg-white border border-zinc-200 shadow-xl rounded-[10px] p-1">
          {MINUTES.map((m) => (
            <SelectItem
              key={m}
              value={m}
              className="font-sans text-xs py-1.5 px-2 rounded-[6px] hover:bg-zinc-100 cursor-pointer"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Period Dropdown */}
      <Select value={period} onValueChange={handlePeriod}>
        <SelectTrigger className="w-[68px] !h-10 px-2 bg-white border border-zinc-300 rounded-[8px] font-sans font-semibold text-xs sm:text-sm text-heading-text shadow-none focus:ring-0 focus:border-primary-color cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="z-[9999] bg-white border border-zinc-200 shadow-xl rounded-[10px] p-1">
          <SelectItem
            value="AM"
            className="font-sans text-xs py-1.5 px-2 rounded-[6px] hover:bg-zinc-100 cursor-pointer"
          >
            AM
          </SelectItem>
          <SelectItem
            value="PM"
            className="font-sans text-xs py-1.5 px-2 rounded-[6px] hover:bg-zinc-100 cursor-pointer"
          >
            PM
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default function CustomTimeModal({
  open,
  onOpenChange,
  initialData,
  onConfirm,
}: CustomTimeModalProps) {
  const [scheduleType, setScheduleType] = useState<"Specific Times" | "Interval">("Specific Times")
  const [times, setTimes] = useState<string[]>(["08:00 AM"])
  const [newTime, setNewTime] = useState<string>("12:00 PM")
  const [isAddingTime, setIsAddingTime] = useState<boolean>(false)

  const [interval, setInterval] = useState<string>("4 hours")
  const [startingFrom, setStartingFrom] = useState<string>("08:00 AM")
  const [selectedDays, setSelectedDays] = useState<string[]>([...DAYS_OF_WEEK])

  useEffect(() => {
    if (open) {
      if (initialData) {
        setScheduleType(initialData.schedule_type || "Specific Times")
        setTimes(
          initialData.times && initialData.times.length > 0
            ? sortTimesChronologically(initialData.times)
            : ["08:00 AM"]
        )
        setInterval(initialData.interval || "4 hours")
        setStartingFrom(initialData.starting_from || "08:00 AM")
        setSelectedDays(
          initialData.days_of_week && initialData.days_of_week.length > 0
            ? initialData.days_of_week
            : [...DAYS_OF_WEEK]
        )
      } else {
        setScheduleType("Specific Times")
        setTimes(["08:00 AM"])
        setInterval("4 hours")
        setStartingFrom("08:00 AM")
        setSelectedDays([...DAYS_OF_WEEK])
      }
      setIsAddingTime(false)
      setNewTime("12:00 PM")
    }
  }, [open, initialData])

  // Computed interval schedule preview
  const calculatedIntervalTimes = useMemo(() => {
    return calculateIntervalTimes(startingFrom, interval)
  }, [startingFrom, interval])

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSelectAllDays = () => {
    if (selectedDays.length === DAYS_OF_WEEK.length) {
      setSelectedDays([])
    } else {
      setSelectedDays([...DAYS_OF_WEEK])
    }
  }

  const handleRemoveTime = (indexToRemove: number) => {
    setTimes((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddSelectedTime = () => {
    if (times.includes(newTime)) {
      toast.warning(`${newTime} is already added to the schedule.`)
      return
    }
    setTimes((prev) => sortTimesChronologically([...prev, newTime]))
    setIsAddingTime(false)
  }

  const handleConfirm = () => {
    if (scheduleType === "Specific Times" && times.length === 0) {
      toast.error("Please add at least one specific administration time.")
      return
    }
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day of the week.")
      return
    }

    let frequency = ""
    if (scheduleType === "Specific Times") {
      const count = times.length
      const countLabel =
        count === 1 ? "Once Daily" : count === 2 ? "Twice Daily" : `${count} times daily`
      frequency = `${countLabel} (${times.join(", ")})`
    } else {
      frequency = `Every ${interval} starting at ${startingFrom}`
    }

    onConfirm({
      name: initialData?.name || "",
      dosage: initialData?.dosage || "",
      frequency,
      schedule_type: scheduleType,
      times: scheduleType === "Specific Times" ? times : calculatedIntervalTimes,
      interval: scheduleType === "Interval" ? interval : undefined,
      starting_from: scheduleType === "Interval" ? startingFrom : undefined,
      days_of_week: selectedDays,
    })
    onOpenChange(false)
  }

  const isAllDaysSelected = selectedDays.length === DAYS_OF_WEEK.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[500px] p-7 sm:p-8 rounded-[16px] gap-0 outline-hidden border-none shadow-2xl bg-white select-none font-sans">
        <div className="space-y-6">
          {/* Header */}
          <DialogHeader className="p-0">
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl font-bold font-sans text-body-text">
                Custom Schedule
              </DialogTitle>
              {initialData?.name ? (
                <div className="flex items-center gap-2 text-sm font-sans text-zinc-500">
                  <span className="font-semibold text-body-text">{initialData.name}</span>
                  {initialData.dosage && (
                    <>
                      <span className="text-zinc-300">•</span>
                      <span className="bg-zinc-100 font-medium px-2 py-0.5 rounded text-body-text text-xs">
                        {initialData.dosage}
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 font-normal">
                  Configure specific administration times or interval frequency
                </p>
              )}
            </div>
          </DialogHeader>

          {/* Schedule Type Segmented Switcher */}
          <div className="space-y-2.5">
            <span className="text-sm font-semibold text-body-text font-sans block">
              Schedule Type
            </span>
            <div className="grid grid-cols-2 p-1.5 rounded-[12px] border border-zinc-200 bg-zinc-50">
              <button
                type="button"
                onClick={() => setScheduleType("Specific Times")}
                className={cn(
                  "py-2.5 rounded-[9px] text-sm font-semibold transition-all cursor-pointer outline-hidden font-sans",
                  scheduleType === "Specific Times"
                    ? "bg-primary-color text-white shadow-xs"
                    : "text-zinc-600 hover:text-heading-text"
                )}
              >
                Specific Times
              </button>
              <button
                type="button"
                onClick={() => setScheduleType("Interval")}
                className={cn(
                  "py-2.5 rounded-[9px] text-sm font-semibold transition-all cursor-pointer outline-hidden font-sans",
                  scheduleType === "Interval"
                    ? "bg-primary-color text-white shadow-xs"
                    : "text-zinc-600 hover:text-heading-text"
                )}
              >
                Interval
              </button>
            </div>
          </div>

          {/* Schedule Body */}
          {scheduleType === "Specific Times" ? (
            <div className="space-y-4">
              {/* Times List */}
              <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                {times.length > 0 ? (
                  times.map((time, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-[10px] bg-secondary-light border border-zinc-200 text-sm text-body-text font-medium font-sans"
                    >
                      <div className="flex items-center gap-3">
                        <IconClock className="size-5 text-secondary-color stroke-[2]" />
                        <span className="text-base font-semibold text-heading-text">{time}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(idx)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-error hover:bg-warning-btn cursor-pointer transition-colors outline-hidden"
                        title="Remove time"
                      >
                        <IconX className="size-4.5 stroke-[2]" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-5 rounded-[10px] border border-dashed border-zinc-300 text-center text-sm text-zinc-400">
                    No times added yet. Click &quot;Add Time&quot; below.
                  </div>
                )}
              </div>

              {/* Add Time Form or Dashed Button */}
              {isAddingTime ? (
                <div className="p-3.5 bg-secondary-light border border-zinc-200 rounded-[12px] space-y-2">
                  <span className="text-xs font-semibold text-zinc-500 block">
                    Select time to add
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <TimeSelect value={newTime} onChange={setNewTime} />
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        onClick={handleAddSelectedTime}
                        className="bg-primary-color hover:bg-primary-color/90 text-white text-xs font-semibold !h-10 px-4 rounded-full cursor-pointer shadow-none"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingTime(false)}
                        className="!h-10 px-3.5 rounded-full border border-zinc-300 text-xs font-semibold cursor-pointer shadow-none"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTime(true)}
                  className="w-full !h-12 rounded-full border-2 border-dashed border-secondary-color bg-transparent text-secondary-color hover:bg-secondary-color/5 font-sans font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors outline-hidden"
                >
                  <IconPlus className="size-4.5 stroke-[2.5]" />
                  <span>Add Time</span>
                </button>
              )}
            </div>
          ) : (
            /* Interval Mode */
            <div className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-body-text block">
                    Repeat Every
                  </FieldLabel>
                  <Select
                    value={interval}
                    onValueChange={(val) => val && setInterval(val)}
                  >
                    <SelectTrigger className="w-full !h-10 px-3 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:ring-0 focus:border-primary-color focus:outline-hidden shadow-none cursor-pointer">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] bg-white border border-zinc-200 shadow-xl rounded-[12px] p-1">
                      {REPEAT_INTERVALS.map((intv) => (
                        <SelectItem
                          key={intv}
                          value={intv}
                          className="font-sans text-sm py-2 px-3 rounded-[6px] hover:bg-zinc-100 cursor-pointer text-body-text"
                        >
                          Every {intv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel className="text-xs font-semibold text-body-text block">
                    Starting At
                  </FieldLabel>
                  <TimeSelect value={startingFrom} onChange={setStartingFrom} />
                </Field>
              </div>

              {/* Calculated Schedule Preview */}
              {/* <div className="p-4 bg-secondary-light border border-zinc-200 rounded-[12px] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-600 font-medium">
                  <span>Calculated Daily Schedule:</span>
                  <span className="text-xs font-semibold text-primary-color bg-white px-2.5 py-0.5 rounded-full border border-zinc-200">
                    {calculatedIntervalTimes.length} doses / day
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pt-1">
                  {calculatedIntervalTimes.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-semibold text-body-text shadow-2xs"
                    >
                      <IconClock className="size-3.5 text-secondary-color" />
                      {t}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          {/* Days of the Week */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-body-text font-sans">
                Days of the week
              </span>
              <button
                type="button"
                onClick={handleSelectAllDays}
                className="text-xs font-semibold text-secondary-color hover:underline cursor-pointer"
              >
                {isAllDaysSelected ? "Deselect All" : "Select All (Daily)"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "flex-1 min-w-[46px] py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer outline-hidden font-sans text-center",
                      isSelected
                        ? "bg-primary-color text-white shadow-2xs"
                        : "bg-secondary-light text-body-text hover:bg-zinc-200"
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full border border-secondary-color bg-white font-sans font-semibold text-sm text-secondary-color hover:bg-secondary-color/10 !h-12 cursor-pointer transition-colors shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-sans font-semibold text-sm !h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors"
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
