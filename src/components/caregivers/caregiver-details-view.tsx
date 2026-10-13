"use client"

import React, { useMemo } from "react"
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSuspenseGetUserById, useSuspendCaregiver } from "@/hooks/user.hook"
import { useUnassignPatient } from "@/hooks/patient.hook"
import { useCreateAdminChat } from "@/hooks/chat.hook"
import { toast } from "sonner"
import ConfirmationModal, { useConfirmation } from "@/components/modal/confirmation-modal"
import { calculateAge, cn } from "@/libs/utils"
import { PatientType } from "@/types/patient.type"

interface CaregiverDetailsViewProps {
  caregiverId: string
}

export default function CaregiverDetailsView({ caregiverId }: CaregiverDetailsViewProps) {
  const { data: response } = useSuspenseGetUserById(caregiverId)
  const caregiver = response?.data

  const router = useRouter()
  const { mutate: createChat, isPending: isChatPending } = useCreateAdminChat()
  const { mutate: suspendMutate, isPending } = useSuspendCaregiver()
  const { mutate: unassignMutate, isPending: isUnassignPending } = useUnassignPatient()

  // Confirmation Modal state
  const { state: confirmState, confirm, close: closeConfirm } = useConfirmation()

  const handleToggleSuspend = (suspendStatus: boolean) => {
    const actionText = suspendStatus ? "suspend" : "unsuspend"
    confirm({
      title: `${suspendStatus ? "Suspend" : "Unsuspend"} Caregiver`,
      description: `Are you sure you want to ${actionText} this caregiver's account?`,
      confirmText: suspendStatus ? "Suspend" : "Unsuspend",
      variant: suspendStatus ? "danger" : "primary",
      onConfirm: () => {
        suspendMutate(
          { id: caregiverId, payload: { isSuspended: suspendStatus } },
          {
            onSuccess: () => {
              toast.success(`Account ${suspendStatus ? "suspended" : "unsuspended"} successfully!`)
              closeConfirm()
            },
            onError: () => {
              toast.error(`Failed to ${actionText} caregiver account.`)
            },
          }
        )
      },
    })
  }

  const handleUnassignPatient = (pat: PatientType) => {
    const patName = `${pat.first_name || ""} ${pat.last_name || ""}`.trim() || "Patient"
    confirm({
      title: "Unassign Patient",
      description: `Are you sure you want to unassign ${patName} from ${caregiverName}?`,
      confirmText: "Unassign",
      variant: "danger",
      onConfirm: () => {
        unassignMutate(
          {
            patient_id: pat.id,
            user_id: caregiverId,
          },
          {
            onSuccess: () => {
              toast.success("Patient unassigned successfully!")
              closeConfirm()
            },
            onError: (error) => {
              const msg =
                error.response?.data?.message ||
                "Failed to unassign patient."
              toast.error(msg)
            },
          }
        )
      },
    })
  }

  const handleMessageCaregiver = () => {
    createChat(
      {
        type: "USER",
        reciever_id: caregiverId,
        is_for_admin: true,
      },
      {
        onSuccess: (res) => {
          const chatId = res?.data?.id || caregiverId
          router.push(`/dashboard/messages?chatId=${chatId}`)
        },
        onError: () => {
          toast.error("Failed to initiate chat.")
        },
      }
    )
  }

  // Extract assigned patients
  const assignedPatients = useMemo<PatientType[]>(() => {
    if (!caregiver) return []
    return caregiver.patients || []
  }, [caregiver])

  // Build dynamic timeline items
  const timelineItems = useMemo(() => {
    if (!caregiver) return []
    const items: { title: string; date: string; description: string; isLatest?: boolean }[] = []

    if (caregiver.patients && caregiver.patients.length > 0) {
      caregiver.patients.forEach((pat) => {
        const patName =
          `${pat.first_name || ""} ${pat.last_name || ""}`.trim() || "patient"
        const formattedDate = pat.created_at
          ? new Date(pat.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recent"
        items.push({
          title: "Patient Assigned",
          date: formattedDate,
          description: `Assigned to ${patName}.`,
        })
      })
    }

    if (caregiver.created_at) {
      const joinedDate = new Date(caregiver.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      items.push({
        title: "Account Activated",
        date: joinedDate,
        description: "User completed onboarding flow.",
      })
      items.push({
        title: "Invitation Sent",
        date: joinedDate,
        description: "System generated welcome email.",
      })
    }

    if (items.length === 0) {
      items.push({
        title: "Account Created",
        date: "Recent",
        description: "Caregiver registered on platform.",
      })
    }

    items[0].isLatest = true
    return items
  }, [caregiver])

  if (!caregiver) return null

  const caregiverName = `${caregiver.first_name} ${caregiver.last_name}`
  const caregiverAvatar =
    caregiver.profile_picture ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200"
  const caregiverAge = calculateAge(caregiver.date_of_birth)

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
                  <AvatarImage src={caregiverAvatar} alt={caregiverName} />
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
              {caregiver.isSuspended ? (
                <Button
                  onClick={() => handleToggleSuspend(false)}
                  disabled={isPending}
                  className="rounded-full bg-primary-color hover:bg-primary-color text-white font-dm-san-regular font-normal text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none disabled:opacity-50"
                >
                  {isPending ? "Restoring..." : "Restore Account"}
                </Button>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Button
                    onClick={() => handleToggleSuspend(true)}
                    disabled={isPending}
                    className="rounded-full bg-warning-border hover:bg-warning-border text-white font-dm-san-regular font-normal text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none disabled:opacity-50"
                  >
                    {isPending ? "Suspending..." : "Suspend Account"}
                  </Button>
                  <Button
                    onClick={handleMessageCaregiver}
                    disabled={isChatPending}
                    className="rounded-full bg-primary-color hover:bg-primary-color text-white font-dm-san-regular font-normal text-xs px-5 py-2 cursor-pointer outline-hidden border-none shadow-none"
                  >
                    Send Message
                  </Button>
                </div>
              )}
            </div>

            {/* Assigned Patients */}
            <div className="space-y-4">
              <h3 className="text-base font-bold font-dm-san-regular text-body-text block">
                Assigned Patients
              </h3>

              {assignedPatients.length > 0 ? (
                <div className="space-y-3">
                  {assignedPatients.map((pat) => {
                    const patName = `${pat.first_name || ""} ${pat.last_name || ""}`.trim() || "Patient"
                    const patAge = calculateAge(pat.date_of_birth) ?? "-"

                    return (
                      <div
                        key={pat.id}
                        className="p-5 bg-secondary-light rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <h4 className="font-semibold text-body-text text-base font-dm-san-regular">
                            {patName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-600 font-normal font-dm-san-regular text-sm">
                            <span>Gender: {pat.gender || "-"}</span>
                            <span className="text-zinc-300">•</span>
                            <span>Age: {patAge}</span>
                            {pat.blood_group && (
                              <>
                                <span className="text-zinc-300">•</span>
                                <span>Blood Group: {pat.blood_group}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                          <Link
                            href={`/dashboard/patients/${pat.id}`}
                            className="inline-flex items-center justify-center rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color px-5 h-8.5 hover:bg-secondary-color/10 cursor-pointer outline-hidden transition-colors"
                          >
                            View Patient
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() => handleUnassignPatient(pat)}
                            disabled={isUnassignPending}
                            className="rounded-full border border-[#EF4444] text-[#EF4444] hover:bg-red-50 font-dm-san-regular font-semibold text-xs px-4 h-8.5 cursor-pointer outline-hidden shadow-none disabled:opacity-50"
                          >
                            Unassign
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-5 bg-secondary-light rounded-[8px] text-zinc-400 italic text-sm font-dm-san-regular">
                  No assigned patients currently linked.
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
              {/* Single continuous line */}
              <div className="absolute left-1.5 top-2 bottom-2 border-l border-[#888888]" />

              {timelineItems.map((item, idx) => (
                <div key={idx} className="relative flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className={cn(
                        "size-3.5 rounded-full ring-4 ring-white shrink-0",
                        item.isLatest ? "bg-secondary-color" : "bg-[#888888]"
                      )}
                    />
                  </div>
                  <div className="flex-1 space-y-1 -ml-px">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-semibold text-zinc-900 text-sm font-dm-san-regular">
                        {item.title}
                      </h4>
                      <span className="text-xs text-zinc-500 font-dm-san-regular whitespace-nowrap">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 font-dm-san-regular">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Grid span 1) */}
        <div className="space-y-6">
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
                      {caregiver.state && `${caregiver.state}, `}
                      {caregiver.country}
                    </span>
                  )}
                </span>
              </div>
              {caregiver.date_of_birth && (
                <div className="flex items-center gap-3.5">
                  <IconCalendar className="size-6 text-body-text shrink-0" />
                  <span className="font-medium">
                    {new Date(caregiver.date_of_birth).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {caregiverAge !== null && ` (${caregiverAge} yrs)`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) closeConfirm()
        }}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        variant={confirmState.variant}
        isPending={isPending || isUnassignPending}
      />
    </div>
  )
}
