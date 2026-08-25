"use client"

import React from "react"
import {
  IconPhone,
  IconMail,
  IconMapPin,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSuspenseGetUserById } from "@/hooks/user.hook"

interface CaregiverDetailsViewProps {
  caregiverId: string
}

export default function CaregiverDetailsView({ caregiverId }: CaregiverDetailsViewProps) {
  const { data: response } = useSuspenseGetUserById(caregiverId)
  const caregiver = response?.data

  if (!caregiver) return null

  const caregiverName = `${caregiver.first_name} ${caregiver.last_name}`
  const caregiverAvatar = caregiver.profile_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-900">
          Caregiver Information
        </h1>
      </div>

      {/* Main Grid: Details columns and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Grid span 2) */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white p-6 rounded-[8px] space-y-6">
            {/* Profile Header Box */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-30 border border-zinc-200">
                  <AvatarImage
                    src={caregiverAvatar}
                    alt={caregiverName}
                  />
                  <AvatarFallback>CG</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text">
                    {caregiverName}
                  </h2>
                  {caregiver.isSuspended ? (
                    <Badge
                      variant="outline"
                      className="bg-warning-btn text-error border-warning-border font-dm-san-regular font-medium px-3.5 py-0.5 rounded-full shadow-none text-xs"
                    >
                      Suspended
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-active-btn text-[#0A432C] border-active-border font-dm-san-regular font-medium px-3.5 py-0.5 rounded-full shadow-none text-xs"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              </div>

              {/* Profile Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Button className="rounded-full bg-warning-border hover:bg-warning-border text-white font-dm-san-regular font-normal text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none">
                  Suspend Account
                </Button>
                <Button className="rounded-full bg-primary-color hover:bg-primary-color text-white font-dm-san-regular font-normal text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none">
                  Send Message
                </Button>
              </div>
            </div>


            {/* Assigned Patient */}
            <div className="space-y-4">
              <h3 className="text-base font-bold font-dm-san-regular text-body-text block">
                Assigned Patients
              </h3>

              {caregiver.patients && caregiver.patients.length > 0 ? (
                caregiver.patients.map((pat: any) => (
                  <div key={pat.id} className="p-5 bg-secondary-light rounded-[8px] space-y-2">
                    <h4 className="font-normal text-body-text text-base font-dm-san-regular">
                      {pat.first_name} {pat.last_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-text font-normal font-dm-san-regular text-base">
                      <span>ID: {pat.id.slice(-8)}</span>
                      <span className="text-zinc-300">•</span>
                      <span>Gender: {pat.gender}</span>
                      <span className="text-zinc-300">•</span>
                      <span>Age: {pat.date_of_birth ? new Date().getFullYear() - new Date(pat.date_of_birth).getFullYear() : "-"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 bg-secondary-light rounded-[8px] text-zinc-400 italic text-sm font-dm-san-regular">
                  No assigned patients.
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6 bg-white p-6 rounded-[8px]">
            <h2 className="text-[22px] font-medium text-[#2B2B2B] font-dm-san-regular">
              Activity Timeline
            </h2>

            <div className="relative ml-3.5 space-y-8">
              {/* Single continuous line, positioned independently of the dots */}
              <div className="absolute left-1.5 top-2 bottom-2 border-l border-[#888888]" />

              {/* Timeline Item 1 */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="size-3.5 rounded-full bg-secondary-color ring-4 ring-white shrink-0" />
                </div>
                <div className="flex-1 space-y-1 -ml-px">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
                      Patient Assigned
                    </h4>
                    <span className="text-xs text-zinc-500 font-dm-san-regular whitespace-nowrap">
                      June 26, 2026
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-dm-san-regular">
                    Assigned to {caregiver.patients?.[0] ? `${caregiver.patients[0].first_name} ${caregiver.patients[0].last_name}` : "patient"}.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="size-3.5 rounded-full bg-[#888888] ring-4 ring-white shrink-0" />
                </div>
                <div className="flex-1 space-y-1 -ml-px">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
                      Account Activated
                    </h4>
                    <span className="text-xs text-zinc-500 font-dm-san-regular whitespace-nowrap">
                      June 25, 2026
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-dm-san-regular">
                    User completed onboarding flow.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className="size-3.5 rounded-full bg-[#888888] ring-4 ring-white shrink-0" />
                </div>
                <div className="flex-1 space-y-1 -ml-px">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
                      Invitation Sent
                    </h4>
                    <span className="text-xs text-zinc-500 font-dm-san-regular whitespace-nowrap">
                      June 25, 2026
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 font-dm-san-regular">
                    System generated welcome email.
                  </p>
                </div>
              </div>
            </div>

            {/* View Full History Button */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                className="rounded-full border bg-white border-secondary-color font-dm-san-regular font-semibold text-xs text-secondary-color px-6 py-2 h-9 hover:bg-zinc-50 cursor-pointer outline-hidden"
              >
                View Full History
              </Button>
            </div>
          </div>

        </div>

        {/* Right Sidebar (Grid span 1) */}
        <div className="space-y-4 bg-white rounded-[8px] h-fit p-6">
          <h2 className="text-lg font-bold font-dm-san-regular text-body-text pb-2">
            Contact Details
          </h2>

          <div className="space-y-4 font-dm-san-regular text-sm text-body-text">
            <div className="flex items-center gap-3.5">
              <IconPhone className="size-6 text-body-text shrink-0" />
              <span className="font-medium">{caregiver.phone || "-"}</span>
            </div>
            <div className="flex items-center gap-3.5">
              <IconMail className="size-6 text-body-text shrink-0" />
              <span className="font-medium">{caregiver.email || "-"}</span>
            </div>
            <div className="flex items-start gap-3.5">
              <IconMapPin className="size-6 text-body-text shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">
                {caregiver.address || "-"}
                {(caregiver.state || caregiver.country) && (
                  <span className="block text-xs text-zinc-500 mt-1">
                    {caregiver.state && `${caregiver.state}, `}{caregiver.country}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
