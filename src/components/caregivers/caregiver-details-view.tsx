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
  const caregiver = CAREGIVERS_MAP[caregiverId] || CAREGIVERS_MAP["5"]

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
          
          {/* Profile Header Box */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6 bg-zinc-50/50 border border-zinc-200/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border border-zinc-200">
                <AvatarImage
                  src={caregiver.avatar}
                  alt={caregiver.name}
                />
                <AvatarFallback>CG</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-sans text-zinc-950">
                  {caregiver.name}
                </h2>
                <Badge
                  variant="outline"
                  className="bg-active-btn text-active-border border-active-border/20 font-sans font-semibold px-3.5 py-0.5 rounded-full shadow-none text-2xs"
                >
                  Active
                </Badge>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button className="rounded-full bg-[#C43A3A] hover:bg-[#B32F2F] text-white font-sans font-semibold text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none">
                Suspend Account
              </Button>
              <Button className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none">
                Send Message
              </Button>
            </div>
          </div>

          {/* Assigned Patient */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-sans text-zinc-950 block">
              Assigned Patient
            </h3>
            
            <div className="p-5 bg-[#EEF2F6]/50 border border-[#EEF2F6] rounded-2xl space-y-2">
              <h4 className="font-bold text-zinc-950 text-sm font-sans">
                {caregiver.patientName}
              </h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500 font-sans text-xs">
                <span>ID: {caregiver.patientId}</span>
                <span className="text-zinc-300">•</span>
                <span>Registered: Aug. 5 2026</span>
                <span className="text-zinc-300">•</span>
                <span>Age: 66</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-sans text-zinc-950 block">
              Activity Timeline
            </h3>

            <div className="relative border-l border-zinc-200 ml-3.5 pl-7 space-y-6">
              {/* Timeline Item 1 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[35.5px] top-1.5 size-4 rounded-full bg-[#648FCC] border-2 border-white ring-4 ring-[#EEF2F6]/50" />
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-zinc-950 text-sm font-sans">
                    Patient Assigned
                  </h4>
                  <span className="text-xs text-zinc-500 font-sans">
                    June 26, 2026
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-sans">
                  Assigned to {caregiver.patientName}
                </p>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[35.5px] top-1.5 size-4 rounded-full bg-zinc-400 border-2 border-white ring-4 ring-zinc-100" />
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-zinc-950 text-sm font-sans">
                    Account Activated
                  </h4>
                  <span className="text-xs text-zinc-500 font-sans">
                    June 25, 2026
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-sans">
                  User completed onboarding flow.
                </p>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative space-y-1">
                <div className="absolute -left-[35.5px] top-1.5 size-4 rounded-full bg-zinc-400 border-2 border-white ring-4 ring-zinc-100" />
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-zinc-950 text-sm font-sans">
                    Invitation Sent
                  </h4>
                  <span className="text-xs text-zinc-500 font-sans">
                    June 25, 2026
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-sans">
                  System generated welcome email.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar (Grid span 1) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-sans text-zinc-900 border-b border-zinc-100 pb-2">
            Contact Details
          </h2>

          <div className="space-y-4 font-sans text-sm text-body-text">
            <div className="flex items-center gap-3.5">
              <IconPhone className="size-5 text-zinc-400 shrink-0" />
              <span className="font-medium">09065437832</span>
            </div>
            <div className="flex items-center gap-3.5">
              <IconMail className="size-5 text-zinc-400 shrink-0" />
              <span className="font-medium">{caregiver.email}</span>
            </div>
            <div className="flex items-start gap-3.5">
              <IconMapPin className="size-5 text-zinc-400 shrink-0 mt-0.5" />
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
