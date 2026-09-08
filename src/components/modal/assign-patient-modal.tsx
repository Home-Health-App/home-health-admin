"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { useGetUsers } from "@/hooks/user.hook"
import { useAssignPatient } from "@/hooks/patient.hook"
import { IconCalendar, IconX } from "@tabler/icons-react"
import { toast } from "sonner"
import { cn } from "@/libs/utils"

interface AssignPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: {
    id: string
    name: string
  } | null
}

const PERMISSION_OPTIONS = [
  { value: "Full_Access", label: "Full Access" },
  { value: "Limited_Access", label: "Limited Access" },
  { value: "View_Only", label: "View Only" },
]

export default function AssignPatientModal({
  open,
  onOpenChange,
  patient,
}: AssignPatientModalProps) {
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [permission, setPermission] = useState<string>("Full_Access")

  const [startPickerOpen, setStartPickerOpen] = useState(false)
  const [endPickerOpen, setEndPickerOpen] = useState(false)

  const { data: caregiversData, isLoading: loadingCaregivers } = useGetUsers({
    type: "CARE_GIVER",
    limit: 100,
  })

  const { mutate: assignMutate, isPending } = useAssignPatient()

  const caregivers = caregiversData?.data || []

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCaregiverId("")
      setStartDate(new Date())
      setEndDate(undefined)
      setPermission("Full_Access")
      setStartPickerOpen(false)
      setEndPickerOpen(false)
    }
  }, [open])

  const selectedCaregiver = caregivers.find((c) => c.id === selectedCaregiverId)
  const selectedPermission = PERMISSION_OPTIONS.find((p) => p.value === permission)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient?.id) return

    if (!selectedCaregiverId) {
      toast.error("Please select a caregiver to assign.")
      return
    }

    if (!startDate) {
      toast.error("Please select a start date.")
      return
    }

    assignMutate(
      {
        patient_id: patient.id,
        user_id: selectedCaregiverId,
        user_role: "CARE_GIVER",
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : undefined,
        family_access_permissions: [permission],
        status: "ACTIVE",
      },
      {
        onSuccess: () => {
          toast.success("Caregiver assigned to patient successfully!")
          onOpenChange(false)
        },
        onError: () => {
          toast.error("Failed to assign caregiver.")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        <div className="space-y-6 font-dm-san-regular">
          <DialogHeader className="flex flex-col gap-1 pb-1">
            <DialogTitle className="text-2xl font-bold text-body-text">
              Assign Caregiver
            </DialogTitle>
            {patient && (
              <DialogDescription className="text-xs text-zinc-500 font-normal">
                Assign a dedicated caregiver to{" "}
                <span className="font-semibold text-zinc-800">
                  {patient.name}
                </span>
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Caregiver Selector */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-body-text">
                Select Caregiver
              </FieldLabel>
              <Select
                value={selectedCaregiverId}
                onValueChange={(val) => setSelectedCaregiverId(val ?? "")}
                disabled={loadingCaregivers || isPending}
              >
                <SelectTrigger className="w-full h-12! px-3 py-2 rounded-[8px] border border-zinc-200 bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none">
                  {selectedCaregiver ? (
                    <span className="flex-1 text-left font-dm-san-regular text-sm text-body-text truncate">
                      {selectedCaregiver.first_name} {selectedCaregiver.last_name}
                    </span>
                  ) : (
                    <span className="flex-1 text-left font-dm-san-regular text-sm text-zinc-400">
                      {loadingCaregivers
                        ? "Loading caregivers..."
                        : "Select a Caregiver"}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                  {caregivers.map((cg) => (
                    <SelectItem
                      key={cg.id}
                      value={cg.id}
                      className="font-dm-san-regular font-normal text-sm py-2 px-3 hover:bg-zinc-50 cursor-pointer"
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-medium text-body-text">
                          {cg.first_name} {cg.last_name}
                        </span>
                        <span className="text-xs text-zinc-400">{cg.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Dates Grid with Calendar & Popover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <Field className="space-y-1.5">
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Start Date
                </FieldLabel>
                <Popover open={startPickerOpen} onOpenChange={setStartPickerOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className={cn(
                          "w-full h-12! px-3 rounded-[8px] border border-zinc-200 bg-secondary-light text-left font-normal flex items-center justify-between text-body-text shadow-none hover:bg-secondary-light font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden"
                        )}
                      >
                        <span>
                          {startDate
                            ? startDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Pick start date"}
                        </span>
                        <IconCalendar className="size-4 text-zinc-500 shrink-0" />
                      </button>
                    }
                  />
                  <PopoverContent
                    className="w-auto p-0 z-50 bg-white border border-zinc-200 shadow-lg rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={startDate}
                      startMonth={new Date(2020, 0)}
                      endMonth={new Date(2035, 11)}
                      onSelect={(date) => {
                        setStartDate(date)
                        setStartPickerOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* End Date */}
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel className="text-xs font-semibold text-body-text">
                    End Date (Optional)
                  </FieldLabel>
                  {endDate && (
                    <button
                      type="button"
                      onClick={() => setEndDate(undefined)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-600 flex items-center gap-0.5 cursor-pointer outline-hidden"
                    >
                      <IconX className="size-3" /> Clear
                    </button>
                  )}
                </div>
                <Popover open={endPickerOpen} onOpenChange={setEndPickerOpen}>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className={cn(
                          "w-full h-12! px-3 rounded-[8px] border border-zinc-200 bg-secondary-light text-left font-normal flex items-center justify-between text-body-text shadow-none hover:bg-secondary-light font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden"
                        )}
                      >
                        <span className={endDate ? "text-body-text" : "text-zinc-400"}>
                          {endDate
                            ? endDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "No end date"}
                        </span>
                        <IconCalendar className="size-4 text-zinc-500 shrink-0" />
                      </button>
                    }
                  />
                  <PopoverContent
                    className="w-auto p-0 z-50 bg-white border border-zinc-200 shadow-lg rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={endDate}
                      startMonth={startDate || new Date(2020, 0)}
                      endMonth={new Date(2035, 11)}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndPickerOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            </div>

            {/* Family Access Permissions */}
            <Field className="space-y-1.5">
              <FieldLabel className="text-xs font-semibold text-body-text">
                Family Access Permission
              </FieldLabel>
              <Select
                value={permission}
                onValueChange={(val) => setPermission(val ?? "Full_Access")}
                disabled={isPending}
              >
                <SelectTrigger className="w-full h-12! px-3 py-2 rounded-[8px] border border-zinc-200 bg-secondary-light font-dm-san-regular text-sm text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden shadow-none">
                  <span className="flex-1 text-left font-dm-san-regular text-sm text-body-text truncate">
                    {selectedPermission?.label || "Select Permission Level"}
                  </span>
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                  {PERMISSION_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="font-dm-san-regular font-normal text-sm py-2 px-3 hover:bg-zinc-50 cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 rounded-full border border-[#648FCC] bg-white font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 h-12 cursor-pointer transition-colors shadow-none"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending || !selectedCaregiverId}
                className="flex-1 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-[#D0DFE7] disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {isPending ? "Assigning..." : "Assign Caregiver"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
