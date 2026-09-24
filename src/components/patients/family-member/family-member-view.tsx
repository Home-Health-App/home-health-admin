"use client"

import React from "react"
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconCircleCheck,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import LinkedPatientsTable from "./table/linked-patients-table"
import { useGetPatientById } from "@/hooks/patient.hook"
import { useCreateAdminChat } from "@/hooks/chat.hook"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FamilyMemberViewProps {
  patientId: string
}

const timelineItems = [
  {
    title: "Subscription Payment",
    date: "June 26, 2026",
    description: "Paid the monthly subscription payment for Dean Winchester",
    isLatest: true,
  },
  {
    title: "Added a Patient",
    date: "June 26, 2026",
    description: "Added Mary Winchester as patient",
    isLatest: false,
  },
  {
    title: "Added a Patient",
    date: "June 26, 2026",
    description: "Added John Winchester as patient",
    isLatest: false,
  },
  {
    title: "Added a Patient",
    date: "June 26, 2026",
    description: "Added John Winchester as patient",
    isLatest: false,
  },
  {
    title: "Added a Patient",
    date: "June 26, 2026",
    description: "Added John Winchester as patient",
    isLatest: false,
  },
];

export default function FamilyMemberView({ patientId }: FamilyMemberViewProps) {
  const { data: response } = useGetPatientById(patientId)
  const patient = response?.data
  const familyMember = patient?.user
  const familyMemberId = familyMember?.id || patient?.user_id || ""
  const memberName = familyMember
    ? `${familyMember.first_name || ""} ${familyMember.last_name || ""}`.trim()
    : "Family Member"

  const joinedDate = patient?.created_at
    ? new Date(patient.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Aug. 5 2026"

  const router = useRouter()
  const { mutate: createChat, isPending: isCreatingChat } = useCreateAdminChat()

  const handleSendMessage = () => {
    if (!familyMemberId) return
    createChat(
      {
        type: "USER",
        reciever_id: familyMemberId,
        is_for_admin: true,
      },
      {
        onSuccess: (res) => {
          const chatId = res?.data?.id || familyMemberId
          router.push(`/dashboard/messages?chatId=${chatId}`)
        },
        onError: () => {
          toast.error("Failed to initiate chat.")
        },
      }
    )
  }

  const caregiverObj =
    patient?.caregiver ||
    (typeof patient?.caregiver === "object" ? patient?.caregiver : null)
  const caregiverName = caregiverObj
    ? `${caregiverObj.first_name || ""} ${caregiverObj.last_name || ""}`.trim()
    : patient?.assignments?.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name
    ? `${patient.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name} ${patient.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.last_name || ""}`.trim()
    : "Unassigned"

  const linkedPatientsData = patient
    ? [
        {
          id: patient.id,
          name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient",
          relationship: patient.relationship || "Primary Contact",
          caregiver: caregiverName || "Unassigned",
          subscription: (patient.plan?.tier || (patient.status === "ACTIVE" ? "Active" : "Grace Period")) as any,
        },
      ]
    : undefined

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Profile Section with action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-[#2B2B2B]">
            {memberName}
          </h1>
          <div className="flex items-center gap-2 text-[#2B2B2B] font-dm-san-regular text-sm mt-1">
            <span>{patient?.relationship || "Primary Family Member"}</span>
            <span className="text-zinc-300">•</span>
            <span>Joined: {joinedDate}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <Button className="rounded-full bg-[#C43A3A] text-white font-dm-san-regular font-normal text-xs p-3 hover:bg-[#C43A3A] cursor-pointer outline-hidden border-none shadow-none">
            Suspend Account
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isCreatingChat || !familyMemberId}
            className="rounded-full bg-[#0B1E3F] text-white font-dm-san-regular font-normal text-xs p-3 hover:bg-[#0B1E3F] cursor-pointer outline-hidden border-none shadow-none disabled:opacity-50"
          >
            {isCreatingChat ? "Opening..." : "Send Message"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Linked Patients */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-border-light rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Linked Patients
          </span>
          <span className="text-2xl font-bold font-sans text-zinc-900 block">
            {patient ? 1 : 3}
          </span>
        </div>

        {/* Active Subscriptions */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-zinc-200/40 rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Active Subscriptions
          </span>
          <span className="text-2xl font-bold font-sans text-zinc-900 block">
            {patient?.plan ? 1 : 1}
          </span>
        </div>

        {/* Last Payment */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-zinc-200/40 rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Last Payment
          </span>
          <span className="text-2xl font-bold font-sans text-zinc-900 block">
            {joinedDate}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Linked Patients Table & Timeline */}
        <div className="lg:col-span-2 space-y-8">

          {/* Linked Patients Table */}
          <div className="space-y-4">
            <h2 className="text-[22px] font-medium text-[#2B2B2B]">
              Linked Patients
            </h2>

            <LinkedPatientsTable data={linkedPatientsData} />
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6 bg-white p-6 rounded-[8px]">
            <h2 className="text-[22px] font-medium text-[#2B2B2B]">
              Activity Timeline
            </h2>

            <div className="relative ml-3.5 space-y-8">
              {/* Single continuous line, positioned independently of the dots */}
              <div className="absolute left-1.5 top-2 bottom-2 border-l border-[#888888]" />

              {timelineItems.slice(0, 3).map((item, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Node Dot — centered against the title line via flex + self-center on a fixed-height row */}
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className={`size-3.5 rounded-full border-white ring-4 shrink-0 ${item.isLatest
                        ? "bg-secondary-color ring-white"
                        : "bg-[#888888] ring-white"
                        }`}
                    />
                  </div>

                  <div className="flex-1 space-y-1 -ml-px">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-zinc-900 text-sm font-sans">
                        {item.title}
                      </h4>
                      <span className="text-xs text-zinc-500 font-sans whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 font-sans">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>


            {/* View Full History Button */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                className="rounded-full border bg-white border-secondary-color font-sans font-semibold text-xs text-secondary-color px-6 py-2 h-9 hover:bg-zinc-50 cursor-pointer outline-hidden"
              >
                View Full History
              </Button>
            </div>
          </div>

        </div>

        {/* Right Side: Contact Details */}
        <div className="space-y-6 bg-white rounded-[8px] h-fit p-6">
          <h2 className="text-[22px] font-medium text-[#2B2B2B]">
            Contact Details
          </h2>

          <div className="space-y-3 font-sans text-sm text-body-text">
            <div className="flex items-center gap-3.5">
              <IconPhone className="size-6 font-bold text-primary-color shrink-0" />
              <span className="font-normal text-sm">
                {familyMember?.phone || patient?.phone || "-"}
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <IconMail className="size-6 font-bold text-primary-color shrink-0" />
              <span className="font-normal text-sm">
                {familyMember?.email || patient?.email || "-"}
              </span>
            </div>
            <div className="flex items-start gap-3.5">
              <IconMapPin className="size-6 font-bold text-primary-color shrink-0 mt-0.5" />
              <span className="font-normal text-sm leading-relaxed">
                {patient?.address || "-"}
                {(patient?.state || patient?.country) && (
                  <span className="block text-xs text-zinc-500 mt-0.5">
                    {patient?.state ? `${patient.state}, ` : ""}
                    {patient?.country || ""}
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
