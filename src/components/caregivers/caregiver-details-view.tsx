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

interface CaregiverDetailsViewProps {
  caregiverId: string
}

// Mock map of caregivers for rendering details
const CAREGIVERS_MAP: Record<string, {
  name: string
  avatar: string
  patientName: string
  patientId: string
  email: string
}> = {
  "1": {
    name: "Angel Castiel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    patientName: "Dean Winchester",
    patientId: "12345678",
    email: "angelcastiel@gmail.com",
  },
  "2": {
    name: "Rowena MacLeod",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
    patientName: "Dean Winchester",
    patientId: "12345678",
    email: "rowenamacleod@gmail.com",
  },
  "3": {
    name: "Jody Mills",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
    patientName: "Dean Winchester",
    patientId: "12345678",
    email: "jodymills@gmail.com",
  },
  "4": {
    name: "Charlie Bradbury",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200&h=200",
    patientName: "Dean Winchester",
    patientId: "12345678",
    email: "charliebadbury@gmail.com",
  },
  "5": {
    name: "Bobby Singer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    patientName: "Dean Winchester",
    patientId: "12345678",
    email: "bobbysinger@gmail.com",
  },
}

export default function CaregiverDetailsView({ caregiverId }: CaregiverDetailsViewProps) {
  const caregiver = CAREGIVERS_MAP[caregiverId] || CAREGIVERS_MAP["1"]

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
                    src={caregiver.avatar}
                    alt={caregiver.name}
                  />
                  <AvatarFallback>CG</AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text">
                    {caregiver.name}
                  </h2>
                  <Badge
                    variant="outline"
                    className="bg-active-btn text-[#0A432C] border-active-border font-dm-san-regular font-medium px-3.5 py-0.5 rounded-full shadow-none text-xs"
                  >
                    Active
                  </Badge>
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
                Assigned Patient
              </h3>

              <div className="p-5 bg-secondary-light rounded-[8px] space-y-2">
                <h4 className="font-normal text-body-text text-base font-dm-san-regular">
                  {caregiver.patientName}
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-text font-normal font-dm-san-regular text-base">
                  <span>ID: {caregiver.patientId}</span>
                  <span className="text-zinc-300">•</span>
                  <span>Registered: Aug. 5 2026</span>
                  <span className="text-zinc-300">•</span>
                  <span>Age: 66</span>
                </div>
              </div>
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
                    Assigned to {caregiver.patientName}
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
              <span className="font-medium">09065437832</span>
            </div>
            <div className="flex items-center gap-3.5">
              <IconMail className="size-6 text-body-text shrink-0" />
              <span className="font-medium">{caregiver.email}</span>
            </div>
            <div className="flex items-start gap-3.5">
              <IconMapPin className="size-6 text-body-text shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">
                1234 Lane 1 Ikeja Lagos 255233
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
