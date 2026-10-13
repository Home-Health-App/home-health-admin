"use client"

import React, { useState, useEffect } from "react"
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

interface CustomTimeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<MedicationSchedule> | null
  onConfirm: (schedule: MedicationSchedule) => void
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const REPEAT_INTERVALS = [
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "6 hours",
  "8 hours",
  "12 hours",
  "24 hours",
]

export default function CustomTimeModal({
  open,
  onOpenChange,
  initialData,
  onConfirm,
}: CustomTimeModalProps) {
  const [scheduleType, setScheduleType] = useState<"Specific Times" | "Interval">("Specific Times")
  const [times, setTimes] = useState<string[]>(["10:00 AM", "06:00 PM"])
  const [newTimeInput, setNewTimeInput] = useState<string>("12:00 PM")
  const [isAddingTime, setIsAddingTime] = useState<boolean>(false)

  const [interval, setInterval] = useState<string>("2 hours")
  const [startingFrom, setStartingFrom] = useState<string>("08:00 AM")
  const [selectedDays, setSelectedDays] = useState<string[]>(["Wed", "Fri", "Sun"])

  useEffect(() => {
    if (open) {
      if (initialData) {
        setScheduleType(initialData.schedule_type || "Specific Times")
        setTimes(initialData.times && initialData.times.length > 0 ? initialData.times : ["10:00 AM", "06:00 PM"])
        setInterval(initialData.interval || "2 hours")
        setStartingFrom(initialData.starting_from || "08:00 AM")
        setSelectedDays(initialData.days_of_week && initialData.days_of_week.length > 0 ? initialData.days_of_week : ["Wed", "Fri", "Sun"])
      } else {
        setScheduleType("Specific Times")
        setTimes(["10:00 AM", "06:00 PM"])
        setInterval("2 hours")
        setStartingFrom("08:00 AM")
        setSelectedDays(["Wed", "Fri", "Sun"])
      }
      setIsAddingTime(false)
    }
  }, [open, initialData])

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleRemoveTime = (indexToRemove: number) => {
    setTimes((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleAddTime = () => {
    if (newTimeInput.trim()) {
      setTimes((prev) => [...prev, newTimeInput.trim()])
      setIsAddingTime(false)
    }
  }

  const handleConfirm = () => {
    onConfirm({
      name: initialData?.name || "",
      dosage: initialData?.dosage || "",
      frequency: scheduleType === "Specific Times" ? `${times.length} times daily` : `Every ${interval}`,
      schedule_type: scheduleType,
      times: scheduleType === "Specific Times" ? times : undefined,
      interval: scheduleType === "Interval" ? interval : undefined,
      starting_from: scheduleType === "Interval" ? startingFrom : undefined,
      days_of_week: selectedDays,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[460px] p-7 rounded-[12px] gap-0 outline-hidden border-none shadow-xl bg-white select-none font-sans">
        <div className="space-y-6">
          <DialogHeader className="p-0">
            <DialogTitle className="text-3xl font-bold font-sans text-[#1E1E1E]">
              Custom Time
            </DialogTitle>
          </DialogHeader>

          {/* Schedule Type Section */}
          <div className="space-y-3">
            <span className="text-base font-semibold text-[#1E1E1E] font-sans block">
              Schedule Type
            </span>

            {/* Segmented Switcher Pill Container */}
            <div className="grid grid-cols-2 p-1.5 rounded-[12px] border border-zinc-200 bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setScheduleType("Specific Times")}
                className={cn(
                  "py-2.5 rounded-[8px] text-sm font-semibold transition-all cursor-pointer outline-hidden font-sans",
                  scheduleType === "Specific Times"
                    ? "bg-[#5A84C4] text-white shadow-xs"
                    : "text-[#2B2B2B] hover:bg-zinc-50"
                )}
              >
                Specific Times
              </button>
              <button
                type="button"
                onClick={() => setScheduleType("Interval")}
                className={cn(
                  "py-2.5 rounded-[8px] text-sm font-semibold transition-all cursor-pointer outline-hidden font-sans",
                  scheduleType === "Interval"
                    ? "bg-[#5A84C4] text-white shadow-xs"
                    : "text-[#2B2B2B] hover:bg-zinc-50"
                )}
              >
                Interval
              </button>
            </div>
          </div>

          {/* Schedule Type Body */}
          {scheduleType === "Specific Times" ? (
            <div className="space-y-3">
              {/* List of Times */}
              <div className="space-y-3">
                {times.map((time, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 text-sm text-[#1E1E1E] font-medium font-sans"
                  >
                    <div className="flex items-center gap-3">
                      <IconClock className="size-5 text-zinc-700 stroke-[1.8]" />
                      <span className="text-base font-medium">{time}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="p-1 text-zinc-600 hover:text-red-500 cursor-pointer transition-colors outline-hidden"
                    >
                      <IconX className="size-5 stroke-[2]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Time Form or Dashed Button */}
              {isAddingTime ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTimeInput}
                    onChange={(e) => setNewTimeInput(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="flex-1 !h-12 px-4 rounded-[8px] border border-zinc-300 text-sm font-sans focus:outline-hidden focus:border-[#5A84C4]"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTime}
                    className="bg-[#0B1E3F] hover:bg-[#1B335B] text-white text-xs font-semibold h-12 px-5 rounded-full cursor-pointer"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingTime(false)}
                    className="h-12 px-4 rounded-full border border-zinc-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingTime(true)}
                  className="w-full !h-12 rounded-full border-2 border-dashed border-[#648FCC] bg-transparent text-[#648FCC] hover:bg-[#648FCC]/5 font-sans font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors outline-hidden"
                >
                  <IconPlus className="size-4 stroke-[2.5]" />
                  <span>Add Time</span>
                </button>
              )}
            </div>
          ) : (
            /* Interval Mode */
            <div className="space-y-4 font-sans">
              <Field>
                <FieldLabel className="text-sm font-medium text-[#1E1E1E] block mb-1">
                  Repeat Every
                </FieldLabel>
                <Select value={interval} onValueChange={(val) => setInterval(val ?? "2 hours")}>
                  <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:ring-0 focus:border-[#5A84C4] focus:outline-hidden shadow-none">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
                    {REPEAT_INTERVALS.map((intv) => (
                      <SelectItem key={intv} value={intv} className="font-sans text-sm py-2 px-3">
                        {intv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-sm font-medium text-[#1E1E1E] block mb-1">
                  Starting From
                </FieldLabel>
                <div className="relative">
                  <input
                    type="text"
                    value={startingFrom}
                    onChange={(e) => setStartingFrom(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full !h-12 px-4 pr-11 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#5A84C4]"
                  />
                  <IconClock className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 text-zinc-600 stroke-[1.8] pointer-events-none" />
                </div>
              </Field>
            </div>
          )}

          {/* Days of the week */}
          <div className="space-y-3 pt-1">
            <span className="text-sm font-medium text-[#1E1E1E] font-sans block">
              Days of the week
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer outline-hidden font-sans",
                      isSelected
                        ? "bg-[#0B1E3F] text-white shadow-2xs"
                        : "bg-[#F1F5F9] text-[#2B2B2B] hover:bg-zinc-200"
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full border border-[#648FCC] bg-white font-sans font-semibold text-sm text-[#648FCC] hover:bg-[#648FCC]/10 !h-12 cursor-pointer transition-colors shadow-none"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-sm !h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
