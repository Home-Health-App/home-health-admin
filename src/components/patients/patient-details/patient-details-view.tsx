"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconChevronRight,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  useSuspenseGetPatientById,
  useSuspendPatient,
  useUnassignPatient,
} from "@/hooks/patient.hook"
import { useCreateAdminChat } from "@/hooks/chat.hook"
import { useRouter } from "next/navigation"
import ConfirmationModal, { useConfirmation } from "@/components/modal/confirmation-modal"
import AssignPatientModal from "@/components/modal/assign-patient-modal"
import { toast } from "sonner"
import { cn, calculateAge } from "@/libs/utils"


interface PatientDetailsViewProps {
  patientId: string
}

export default function PatientDetailsView({ patientId }: PatientDetailsViewProps) {
  const { data: response } = useSuspenseGetPatientById(patientId)
  const patient = response?.data

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const { state: confirmState, confirm, close: closeConfirm } = useConfirmation()
  const { mutate: suspendMutate, isPending: suspendPending } = useSuspendPatient()
  const { mutate: unassignMutate, isPending: unassignPending } = useUnassignPatient()

  const router = useRouter()
  const { mutate: createChat, isPending: isCreatingChat } = useCreateAdminChat()

  const handleSendMessage = (receiverId: string, type: "ADMIN" | "USER" = "USER") => {
    if (!receiverId) return
    createChat(
      {
        type,
        reciever_id: receiverId,
        is_for_admin: true,
      },
      {
        onSuccess: (res) => {
          const chatId = res?.data?.id || receiverId
          router.push(`/dashboard/messages?chatId=${chatId}`)
        },
        onError: () => {
          toast.error("Failed to initiate chat.")
        },
      }
    )
  }

  if (!patient) return null

  const patientName = `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Unnamed Patient"
  const formattedDate = patient.created_at
    ? new Date(patient.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Aug. 5 2026"

  const isSuspended = patient.isSuspended

  const handleToggleSuspend = (currentStatus: boolean) => {
    const actionText = currentStatus ? "unsuspend" : "suspend"
    confirm({
      title: `${currentStatus ? "Unsuspend" : "Suspend"} Patient`,
      description: `Are you sure you want to ${actionText} this patient's account?`,
      confirmText: currentStatus ? "Unsuspend" : "Suspend",
      variant: currentStatus ? "primary" : "danger",
      onConfirm: () => {
        suspendMutate(
          { id: patientId, payload: { isSuspended: !currentStatus } },
          {
            onSuccess: () => {
              toast.success(`Patient ${currentStatus ? "unsuspended" : "suspended"} successfully!`)
              closeConfirm()
            },
            onError: () => {
              toast.error(`Failed to ${actionText} patient.`)
            },
          }
        )
      },
    })
  }

  const caregiver =
    (typeof patient.caregiver === "object" ? patient.caregiver : null) || null
  const caregiverUserId =
    caregiver?.id || patient.caregiver_id || ""
  const caregiverName = caregiver
    ? `${caregiver.first_name || ""} ${caregiver.last_name || ""}`.trim()
    : typeof patient.caregiver === "string"
    ? patient.caregiver
    : null
  const caregiverEmail = caregiver?.email || null
  const caregiverAvatar =
    caregiver?.profile_picture!

  const handleUnassignCaregiver = () => {
    if (!caregiverUserId) {
      toast.error("Caregiver record not found for this patient.")
      return
    }

    confirm({
      title: "Unassign Caregiver",
      description: `Are you sure you want to unassign ${caregiverName || "the caregiver"} from ${patientName}?`,
      confirmText: "Unassign",
      variant: "danger",
      onConfirm: () => {
        unassignMutate(
          {
            patient_id: patient.id,
            user_id: caregiverUserId,
          },
          {
            onSuccess: () => {
              toast.success("Caregiver unassigned successfully!")
              closeConfirm()
            },
            onError: (error) => {
              const msg =
                error.response?.data?.message ||
                "Failed to unassign caregiver."
              toast.error(msg)
            },
          }
        )
      },
    })
  }

  const dobFormatted = patient.date_of_birth
    ? new Date(patient.date_of_birth).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : null

  const calculatedAge =
    calculateAge(patient.date_of_birth) ??
    (patient.age && patient.age > 0 ? patient.age : null)

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              {patientName}
            </h1>
            {isSuspended ? (
              <Badge
                variant="outline"
                className="bg-warning-btn text-error border-warning-border font-dm-san-regular font-medium px-3 py-0.5 rounded-full shadow-none text-xs"
              >
                Suspended
              </Badge>
            ) : patient.status === "ACTIVE" ? (
              <Badge
                variant="outline"
                className="bg-active-btn text-active-border border-active-border font-dm-san-regular font-medium px-3 py-0.5 rounded-full shadow-none text-xs"
              >
                Active
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-zinc-100 text-zinc-600 border-zinc-200 font-dm-san-regular font-medium px-3 py-0.5 rounded-full shadow-none text-xs"
              >
                {patient.status ? patient.status.replace("_", " ") : "Not Active"}
              </Badge>
            )}
            {patient.plan?.tier && (
              <Badge
                variant="outline"
                className="bg-primary-light text-primary-color border-border-light font-dm-san-regular font-medium px-3 py-0.5 rounded-full shadow-none text-xs"
              >
                {patient.plan.tier} Plan
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-text font-dm-san-regular text-sm mt-1">
            {/* <span>ID: {patient.id}</span> */}
            {/* <span className="text-zinc-300">•</span> */}
            <span>Registered: {formattedDate}</span>
            {calculatedAge !== null && (
              <>
                <span className="text-zinc-300">•</span>
                <span>Age: {calculatedAge}</span>
              </>
            )}
            {dobFormatted && (
              <>
                <span className="text-zinc-300">•</span>
                <span>DOB: {dobFormatted}</span>
              </>
            )}
            {patient.gender && (
              <>
                <span className="text-zinc-300">•</span>
                <span>Gender: {patient.gender}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/dashboard/patients/${patient.id}/create-bill`}>
            <Button className="rounded-full bg-secondary-color hover:bg-secondary-color/90 text-white font-sans font-semibold text-xs h-10 px-5 cursor-pointer outline-hidden shadow-none transition-colors">
              Create Payment Link
            </Button>
          </Link>

          <Button
            onClick={() => handleToggleSuspend(isSuspended)}
            variant="outline"
            className={
              isSuspended
                ? "rounded-full border border-active-border bg-white font-sans font-semibold text-xs text-active-border hover:bg-active-btn h-10 px-5 cursor-pointer outline-hidden shadow-none transition-colors"
                : "rounded-full border border-warning-border bg-white font-sans font-semibold text-xs text-error hover:bg-warning-btn h-10 px-5 cursor-pointer outline-hidden shadow-none transition-colors"
            }
          >
            {isSuspended ? "Unsuspend Account" : "Suspend Account"}
          </Button>
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
                <span className="text-base font-bold text-body-text font-sans block">
                  Allergies
                </span>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-warning-btn text-warning-border border-warning-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1.5"
                      >
                        <IconAlertCircle className="size-3.5" />
                        <span>{allergy}</span>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-400 font-sans italic">
                      None recorded
                    </span>
                  )}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-2">
                <span className="text-base font-bold text-body-text font-sans block">
                  Chronic Conditions
                </span>
                <div className="flex flex-wrap gap-2">
                  {patient.chronic_conditions &&
                    patient.chronic_conditions.length > 0 ? (
                    patient.chronic_conditions.map((condition, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-pending-btn text-pending-border border-pending-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs"
                      >
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-400 font-sans italic">
                      None recorded
                    </span>
                  )}
                </div>
              </div>

              {/* Blood Type */}
              <div className="space-y-1">
                <span className="text-base font-bold text-body-text block">
                  Blood Type
                </span>
                <span className="text-base font-normal font-dm-san-regular text-body-text">
                  {patient.blood_group || "-"}
                </span>
              </div>

              {/* Genotype */}
              <div className="space-y-1">
                <span className="text-base font-bold text-body-text font-sans block">
                  Genotype
                </span>
                <span className="text-base font-normal font-dm-san-regular text-body-text">
                  {patient.genotype || "-"}
                </span>
              </div>

              {/* Height */}
              {patient.height && (
                <div className="space-y-1">
                  <span className="text-base font-bold text-body-text font-sans block">
                    Height
                  </span>
                  <span className="text-base font-normal font-dm-san-regular text-body-text">
                    {patient.height} cm
                  </span>
                </div>
              )}

              {/* Weight */}
              {patient.weight && (
                <div className="space-y-1">
                  <span className="text-base font-bold text-body-text font-sans block">
                    Weight
                  </span>
                  <span className="text-base font-normal font-dm-san-regular text-body-text">
                    {patient.weight} kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Current Medications */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-dm-san-regular text-body-text">
              Current Medications
            </h2>

            {patient.patientMedications && patient.patientMedications.length > 0 ? (
              <div className="space-y-3">
                {patient.patientMedications.map((med) => {
                  const dosage = med.doseage || med.dosage || ""
                  const frequency = med.frequency || ""
                  const details = [dosage, frequency].filter(Boolean).join(" • ")

                  return (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-4 bg-secondary-light rounded-[8px]"
                    >
                      <div className="space-y-1">
                        <h4 className="font-semibold text-body-text text-sm font-sans">
                          {med.name}
                        </h4>
                        {details && (
                          <p className="text-xs text-zinc-500 font-sans">
                            {details}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-active-btn text-active-border border-active-border font-sans font-medium px-2 py-1 rounded-full shadow-none text-xs flex items-center gap-1"
                      >
                        <span>Active</span>
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 bg-secondary-light/40 border border-dashed border-zinc-200 rounded-[8px] text-sm text-zinc-400 font-sans italic">
                No current medications recorded.
              </div>
            )}
          </div>

          {/* Special Care Instructions */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-dm-san-regular text-body-text">
              Special Care Instructions
            </h2>
            <div className="p-5 rounded-[8px] bg-secondary-light text-body-text font-dm-san-regular text-base leading-relaxed">
              {patient.notes ||
                "Please ensure the patient rests in a quiet, comfortable environment and follows all medication schedules precisely. Monitor for any unusual symptoms and report them immediately to the healthcare provider."}
            </div>
          </div>

          {/* Care Plan & Coverage */}
          {patient.plan && (
            <></>
            // <div className="space-y-4">
            //   <div className="flex items-center justify-between">
            //     <h2 className="text-base font-bold font-dm-san-regular text-body-text">
            //       Care Plan & Coverage
            //     </h2>
            //     {patient.plan.tier && (
            //       <Badge
            //         variant="outline"
            //         className="bg-active-btn text-active-border border-active-border font-sans font-medium px-3 py-0.5 rounded-full shadow-none text-xs"
            //       >
            //         {patient.plan.tier} Tier
            //       </Badge>
            //     )}
            //   </div>

            //   <div className="p-5 bg-secondary-light rounded-[8px] space-y-4">
            //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-200/60 pb-3">
            //       <div>
            //         <h3 className="text-base font-semibold font-dm-san-medium text-body-text">
            //           {patient.plan.name}
            //         </h3>
            //         {patient.plan.category && (
            //           <p className="text-xs text-zinc-500 font-dm-san-regular mt-0.5">
            //             Category: {patient.plan.category.replace(/_/g, " ")}
            //           </p>
            //         )}
            //       </div>
            //       <div className="text-left sm:text-right">
            //         <span className="text-base font-bold font-dm-san-medium text-primary-color">
            //           ₦{patient.plan.price?.toLocaleString()}
            //         </span>
            //         {patient.plan.price_in_usd && (
            //           <span className="text-xs text-zinc-500 block font-dm-san-regular">
            //             (${patient.plan.price_in_usd} USD)
            //           </span>
            //         )}
            //       </div>
            //     </div>

            //     {patient.plan.coverage && patient.plan.coverage.length > 0 && (
            //       <div className="space-y-2.5">
            //         <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-sans block">
            //           Coverage Includes
            //         </span>
            //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            //           {patient.plan.coverage.map((item, idx) => (
            //             <div key={idx} className="flex items-start gap-2 text-xs text-body-text font-dm-san-regular">
            //               <IconCheck className="size-4 text-active-border shrink-0 mt-0.5" />
            //               <span>{item}</span>
            //             </div>
            //           ))}
            //         </div>
            //       </div>
            //     )}
            //   </div>
            // </div>
          )}
        </div>

        {/* Right Sidebar (Grid span 1) */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white">
            <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text pb-2">
              Contact Details
            </h2>

            <div className="space-y-4 font-sans text-sm text-body-text">
              <div className="flex items-center gap-3.5">
                <IconPhone className="size-6 text-body-text shrink-0" />
                <span className="font-normal font-dm-san-regular text-body-text text-sm">
                  {patient.phone || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                <IconMail className="size-6 text-body-text shrink-0" />
                <span className="font-medium">{patient.email || "-"}</span>
              </div>
              <div className="flex items-start gap-3.5">
                <IconMapPin className="size-6 text-body-text shrink-0" />
                <span className="font-medium leading-relaxed">
                  {patient.address || "-"}
                  {(patient.state || patient.country) && (
                    <span className="block text-xs text-zinc-500 mt-1">
                      {patient.state ? `${patient.state}, ` : ""}
                      {patient.country || ""}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div className="space-y-4 p-6 bg-white rounded-[8px]">
            <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text pb-2">
              Family Members
            </h2>

            <div className="space-y-4">
              {patient.user ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="font-normal text-body-text text-base font-dm-san-regular">
                      {patient.user.first_name} {patient.user.last_name}
                    </h4>
                    {patient.user.email && (
                      <p className="text-xs text-zinc-500 font-dm-san-regular">
                        {patient.user.email}
                      </p>
                    )}
                    <p className="text-xs text-body-text font-dm-san-regular font-medium pt-0.5">
                      {patient.relationship || "Primary Contact"}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/patients/${patient.id}/family-member`}
                    className="inline-flex items-center justify-center rounded-full border border-secondary-color font-sans font-semibold text-xs text-secondary-color px-4 py-2 h-9 cursor-pointer outline-hidden hover:bg-secondary-color/10 shrink-0 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 font-sans italic">
                  No family member linked.
                </p>
              )}
            </div>
          </div>

          {/* Assigned Care Giver */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white">
            <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text pb-2">
              Assigned Care Giver
            </h2>

            {caregiverName ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 border border-zinc-200">
                    <AvatarImage src={caregiverAvatar} alt={caregiverName} />
                    <AvatarFallback>
                      {caregiverName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "CG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-normal text-heading-text text-sm font-dm-san-regular">
                        {caregiverName}
                      </h4>
                    </div>
                    {caregiverEmail && (
                      <p className="text-xs text-zinc-500 font-dm-san-regular">
                        {caregiverEmail}
                      </p>
                    )}
                    {caregiver?.phone && (
                      <p className="text-xs text-zinc-500 font-dm-san-regular">
                        {caregiver.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-full gap-2">
                  {caregiverUserId && (
                    <Button
                      onClick={() => handleSendMessage(caregiverUserId, "USER")}
                      disabled={isCreatingChat}
                      className="flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-sans font-semibold text-xs h-9 cursor-pointer outline-hidden border-none shadow-none disabled:opacity-50"
                    >
                      {isCreatingChat ? "Opening..." : "Send Message"}
                    </Button>
                  )}
                  <Button
                    onClick={handleUnassignCaregiver}
                    disabled={unassignPending}
                    variant="outline"
                    className="flex-1 rounded-full border border-warning-border text-warning-border hover:text-warning-border font-sans font-semibold text-xs h-9 cursor-pointer outline-hidden shadow-none disabled:opacity-50"
                  >
                    Unassign Caregiver
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-zinc-400 font-sans italic">
                  No caregiver currently assigned to this patient.
                </p>
                <Button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="w-full rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-sans font-semibold text-xs h-9 cursor-pointer outline-hidden border-none shadow-none"
                >
                  Assign Caregiver
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AssignPatientModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        patient={{ id: patient.id, name: patientName }}
      />

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
        isPending={suspendPending || unassignPending}
      />
    </div>
  )
}
