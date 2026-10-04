"use client"

import React, { useRef, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/libs/utils"
import { IconCamera, IconLoader2, IconCalendar } from "@tabler/icons-react"
import { useUploadFile } from "@/hooks/upload.hook"
import { Country, State } from "country-state-city"
import { toast } from "sonner"
import { PatientDemographicsData } from "./types"

export interface StepPatientProps {
  data: PatientDemographicsData
  updateData: (fields: Partial<PatientDemographicsData>) => void
  onContinue: () => void
}

export default function StepPatient({
  data,
  updateData,
  onContinue,
}: StepPatientProps) {
  const [dobPickerOpen, setDobPickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: uploadProfilePic, isPending: isUploadingProfilePic } = useUploadFile()

  // Countries and States
  const countries = useMemo(() => Country.getAllCountries(), [])
  const states = useMemo(() => {
    if (!data.country) return []
    const countryObj = countries.find((c) => c.name === data.country)
    return countryObj ? State.getStatesOfCountry(countryObj.isoCode) : []
  }, [data.country, countries])

  // Profile Picture Upload Handler
  const handleProfilePicClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadProfilePic(file, {
        onSuccess: (res) => {
          if (res.success && res.data?.url) {
            updateData({
              profilePicPreview: res.data.url,
              profilePicUrl: res.data.url,
            })
            toast.success("Profile picture uploaded")
          }
        },
        onError: () => {
          toast.error("Failed to upload profile picture")
        },
      })
    }
  }

  // Step 1 Validation
  const isStep1Valid = Boolean(
    data.firstName.trim() &&
    data.lastName.trim() &&
    data.email.trim() &&
    data.phone.trim() &&
    data.address.trim() &&
    data.country.trim() &&
    data.state.trim() &&
    data.gender.trim() &&
    data.dateOfBirth.trim() &&
    data.relationship.trim()
  )

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 bg-white p-4 rounded-[16px]">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center justify-center gap-3 mb-6">
        <span
          className="text-lg font-bold text-[#0B1F41] font-sans hover:underline cursor-pointer"
          onClick={handleProfilePicClick}
        >
          Add Profile Picture
        </span>
        <button
          type="button"
          disabled={isUploadingProfilePic}
          onClick={handleProfilePicClick}
          className="size-24 rounded-full border-2 border-[#5A84C4] flex items-center justify-center bg-white hover:bg-zinc-50 cursor-pointer overflow-hidden transition-all shadow-2xs group"
        >
          {isUploadingProfilePic ? (
            <IconLoader2 className="size-8 text-zinc-400 animate-spin" />
          ) : data.profilePicPreview ? (
            <img
              src={data.profilePicPreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <IconCamera className="size-9 text-[#1E1E1E] stroke-[1.7] group-hover:scale-105 transition-transform" />
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        {/* First Name */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            First name
          </FieldLabel>
          <Input
            type="text"
            placeholder="Dean"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#0B1F41]"
          />
        </Field>

        {/* Last Name */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Last name
          </FieldLabel>
          <Input
            type="text"
            placeholder="Winchester"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#0B1F41]"
          />
        </Field>

        {/* Date of Birth */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Date of Birth
          </FieldLabel>
          <Popover open={dobPickerOpen} onOpenChange={setDobPickerOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light text-left font-normal flex items-center justify-between text-[#1E1E1E] font-sans text-sm cursor-pointer focus:border-[#0B1F41] focus:outline-hidden"
                >
                  <span className={data.dateOfBirth ? "text-[#1E1E1E]" : "text-zinc-400"}>
                    {data.dateOfBirth
                      ? new Date(data.dateOfBirth).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "DD/MM/YYYY"}
                  </span>
                  <IconCalendar className="size-5 text-zinc-700 stroke-[1.8]" />
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
                selected={data.dateOfBirth ? new Date(data.dateOfBirth) : undefined}
                startMonth={new Date(1920, 0)}
                endMonth={new Date()}
                onSelect={(date) => {
                  if (date) {
                    const year = date.getFullYear()
                    const month = String(date.getMonth() + 1).padStart(2, "0")
                    const day = String(date.getDate()).padStart(2, "0")
                    updateData({ dateOfBirth: `${year}-${month}-${day}` })
                  } else {
                    updateData({ dateOfBirth: "" })
                  }
                  setDobPickerOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>

        {/* Gender */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Gender
          </FieldLabel>
          <Select
            value={data.gender}
            onValueChange={(val) => updateData({ gender: val ?? "Male" })}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:ring-0 focus:border-[#0B1F41] focus:outline-hidden shadow-none">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
              <SelectItem value="Male" className="font-sans text-sm">
                Male
              </SelectItem>
              <SelectItem value="Female" className="font-sans text-sm">
                Female
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Email
          </FieldLabel>
          <Input
            type="email"
            placeholder="deanwinchester@gmail.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#0B1F41]"
          />
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Phone Number
          </FieldLabel>
          <Input
            type="tel"
            placeholder="09063458724"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#0B1F41]"
          />
        </Field>

        {/* Relationship */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Relationship to family member
          </FieldLabel>
          <Select
            value={data.relationship}
            onValueChange={(val) => updateData({ relationship: val ?? "Brother" })}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:ring-0 focus:border-[#0B1F41] focus:outline-hidden shadow-none">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
              {["Father", "Mother", "Brother", "Sister", "Spouse", "Son", "Daughter", "Child", "Grandparent", "Guardian", "Friend", "Other"].map((rel) => (
                <SelectItem key={rel} value={rel} className="font-sans text-sm">
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Residential Address */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Residential Address
          </FieldLabel>
          <Input
            type="text"
            placeholder="123 Lane Street"
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:outline-hidden focus:border-[#0B1F41]"
          />
        </Field>

        {/* Country */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            Country
          </FieldLabel>
          <Select
            value={data.country}
            onValueChange={(val) => {
              updateData({ country: val ?? "Nigeria", state: "" })
            }}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:ring-0 focus:border-[#0B1F41] focus:outline-hidden shadow-none">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
              {countries.map((c) => (
                <SelectItem key={c.isoCode} value={c.name} className="font-sans text-sm">
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* State */}
        <Field>
          <FieldLabel className="text-sm font-medium text-[#1E1E1E] mb-1 block">
            State
          </FieldLabel>
          <Select
            value={data.state}
            onValueChange={(val) => updateData({ state: val ?? "" })}
            disabled={states.length === 0}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-[#1E1E1E] focus:ring-0 focus:border-[#0B1F41] focus:outline-hidden shadow-none">
              <SelectValue placeholder={states.length === 0 ? "Select country first" : "Select State"} />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
              {states.map((st) => (
                <SelectItem key={st.isoCode} value={st.name} className="font-sans text-sm">
                  {st.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {/* Continue Button */}
      <div className="pt-8 flex justify-center">
        <Button
          type="button"
          onClick={onContinue}
          disabled={!isStep1Valid}
          className={cn(
            "w-[388px] max-w-full !h-13 rounded-full font-sans font-semibold text-base transition-all cursor-pointer border-none shadow-none outline-hidden",
            isStep1Valid
              ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
              : "bg-[#D0DFEE] text-white cursor-not-allowed opacity-100"
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
