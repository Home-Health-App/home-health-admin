"use client"

import React from "react"
import Link from "next/link"
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconChevronRight,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MOCK_PATIENTS } from "../mock-data"

interface PatientDetailsViewProps {
  patientId: string
}

export default function PatientDetailsView({ patientId }: PatientDetailsViewProps) {
  // Find current patient or fallback to first mockup item (Dean Winchester)
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId) || MOCK_PATIENTS[1]

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Profile Section */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-[#2B2B2B]">
          {patient.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#2B2B2B] font-dm-san-regular text-sm mt-1">
          <span>ID: {10000000 + Number(patient.id)}</span>
          <span className="text-zinc-300">•</span>
          <span>Registered: Aug. 5 2026</span>
          <span className="text-zinc-300">•</span>
          <span>Age: 66</span>
        </div>
      </div>

      {/* Action Shortcut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Logs Link */}
        <Link
          href={`/dashboard/patients/${patient.id}/daily-logs`}
          className="flex items-center justify-between p-4 bg-primary-light border-[0.5px] border-border-light rounded-[8px] transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex flex-col gap-2 space-y-2">
            <h3 className="font-dm-san-medium font-semibold text-primary-color text-2xl">
              Daily Logs
            </h3>
            <p className="text-primary-color font-dm-san-regular text-sm">
              View all daily activity and health logs
            </p>
          </div>
          <IconChevronRight className="size-6 text-primary-color transition-colors" />
        </Link>

        {/* AI Reports Link */}
        <Link
          href={`/dashboard/patients/${patient.id}/ai-report`}
          className="flex items-center justify-between p-5 bg-primary-light border border-border-light rounded-[8px] transition-all shadow-2xs group cursor-pointer"
        >
          <div className="space-y-2">
            <h3 className="font-dm-san-medium font-semibold text-primary-color text-2xl">
              AI Reports
            </h3>
            <p className="text-primary-color font-dm-san-regular text-sm">
              View all AI weekly health summaries
            </p>
          </div>
          <IconChevronRight className="size-6 text-primary-color transition-colors" />
        </Link>
      </div>

      {/* Main Grid: Info columns and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns (Grid span 2 on lg screens) */}
        <div className="lg:col-span-2 space-y-8 p-6 rounded-[8px] bg-white">
          
          {/* Medical Information */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-dm-san-regular font-medium text-primary-color pb-6">
              Medical Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Allergies */}
              <div className="space-y-2">
                <span className="text-base font-bold text-[#2B2B2B] font-sans block">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-warning-btn text-warning-border border-warning-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1.5"
                  >
                    <IconAlertCircle className="size-3.5" />
                    <span>Penicillin</span>
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-warning-btn text-warning-border border-warning-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1.5"
                  >
                    <IconAlertCircle className="size-3.5" />
                    <span>Latex</span>
                  </Badge>
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-2">
                <span className="text-base font-bold text-[#2B2B2B] font-sans block">
                  Chronic Conditions
                </span>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-[#FDF6E2] text-pending-border border-pending-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs"
                  >
                    Type 2 Diabetes
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-[#FDF6E2] text-pending-border border-pending-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs"
                  >
                    Hypertension
                  </Badge>
                </div>
              </div>

              {/* Blood Type */}
              <div className="space-y-1">
                <span className="text-base font-bold text-[#2B2B2B] block">
                  Blood Type
                </span>
                <span className="text-base font-normal font-dm-san-regular text-[#2B2B2B]">
                  AB
                </span>
              </div>

              {/* Genotype */}
              <div className="space-y-1">
                <span className="text-base font-bold text-[#2B2B2B] font-sans block">
                  Genotype
                </span>
                <span className="text-base font-normal font-dm-san-regular text-[#2B2B2B]">
                  AC
                </span>
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-dm-san-regular text-[#2B2B2B]">
              Current Medications
            </h2>

            <div className="space-y-3">
              {/* Metformin */}
              <div className="flex items-center justify-between p-4 bg-secondary-light rounded-[8px]">
                <div className="space-y-1">
                  <h4 className="font-semibold text-body-text text-sm font-sans">
                    Metformin
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    500mg • Twice daily with meals
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-active-btn text-active-border border-active-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1"
                >
                  <span>Active</span>
                </Badge>
              </div>

              {/* Lisinopril */}
              <div className="flex items-center justify-between p-4 bg-secondary-light rounded-[8px]">
                <div className="space-y-1">
                  <h4 className="font-semibold text-body-text text-sm font-sans">
                    Lisinopril
                  </h4>
                  <p className="text-xs text-zinc-500 font-sans">
                    10mg • Once Daily
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-active-btn text-active-border border-active-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1"
                >
                  <span>Active</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Special Care Instructions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-dm-san-regular text-[#2B2B2B]">
              Special Care Instructions
            </h2>
            <div className="p-5 rounded-[8px] bg-secondary-light text-body-text font-dm-san-regular text-base leading-relaxed">
              Please ensure the patient rests in a quiet, comfortable environment and follows all medication schedules precisely. Monitor for any unusual symptoms and report them immediately to the healthcare provider.
            </div>
          </div>

        </div>

        {/* Right Sidebar (Grid span 1) */}
        <div className="space-y-8">
          
          {/* Contact Details */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white">
            <h2 className="text-[22px] font-medium font-dm-san-regular text-[#2B2B2B] pb-2">
              Contact Details
            </h2>

            <div className="space-y-4 font-sans text-sm text-body-text">
              <div className="flex items-center gap-3.5">
                <IconPhone className="size-6 text-[#2B2B2B] shrink-0" />
                <span className="font-normal font-dm-san-regular text-[#2B2B2B] text-sm">09065437832</span>
              </div>
              <div className="flex items-center gap-3.5">
                <IconMail className="size-6 text-[#2B2B2B] shrink-0" />
                <span className="font-medium">jamesdoe@gmail.com</span>
              </div>
              <div className="flex items-start gap-3.5">
                <IconMapPin className="size-6 text-[#2B2B2B] shrink-0" />
                <span className="font-medium leading-relaxed">
                  1234 Lane 1 Ikeja Lagos 255233
                </span>
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div className="space-y-4 p-6 bg-white rounded-[8px]">
            <h2 className="text-[22px] font-medium font-dm-san-regular text-[#2B2B2B] pb-2">
              Family Members
            </h2>

            <div className="space-y-4">
              {/* Member 1: Sam Winchester */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-normal text-[#2B2B2B] text-base font-dm-san-regular">
                    Sam Winchester
                  </h4>
                  <p className="text-xs text-[#2B2B2B] font-dm-san-regular">
                    Primary Contact
                  </p>
                </div>
                <Button
                  variant="outline"
                  render={
                    <Link href={`/dashboard/patients/${patient.id}/family-member`} />
                  }
                  className="rounded-full border border-secondary-color font-sans font-semibold text-xs text-secondary-color p-3 cursor-pointer outline-hidden hover:bg-inherit hover:text-secondary-color"
                >
                  View Profile
                </Button>
              </div>

              {/* Member 2: Mary Winchester */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-normal text-[#2B2B2B] text-base font-dm-san-regular">
                    Mary Winchester
                  </h4>
                  <p className="text-xs text-[#2B2B2B] font-dm-san-regular">
                    Secondary Contact
                  </p>
                </div>
                <Button
                  variant="outline"
                  render={
                    <Link href={`/dashboard/patients/${patient.id}/family-member`} />
                  }
                  className="rounded-full border border-secondary-color font-sans font-semibold text-xs text-secondary-color p-3 cursor-pointer outline-hidden hover:bg-inherit hover:text-secondary-color"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Assigned Care Giver */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white">
          <h2 className="text-[22px] font-medium font-dm-san-regular text-[#2B2B2B] pb-2">
              Assigned Care Giver
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-11 border border-zinc-200">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
                    alt={patient.caregiver}
                  />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-normal text-zinc-900 text-sm font-dm-san-regular">
                    {patient.caregiver}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border border-zinc-300 font-sans font-semibold text-xs text-body-text h-9 hover:bg-zinc-50 cursor-pointer outline-hidden"
                >
                  Unassign
                </Button>
                <Button className="flex-1 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-xs h-9 cursor-pointer outline-hidden border-none shadow-none">
                  Send Message
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
