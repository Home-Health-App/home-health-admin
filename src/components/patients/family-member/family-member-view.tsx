"use client"

import React, { useState, useMemo } from "react"
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconLoader2,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import LinkedPatientsTable from "./table/linked-patients-table"
import { LinkedPatient } from "./table/columns"
import {
  useGetPatientById,
  useGetUserCreatedPatients,
} from "@/hooks/patient.hook"
import { useGetUserActivityLogs } from "@/hooks/activity-log.hook"
import { useGetAdminUserAnalytics } from "@/hooks/analytic.hook"
import { useCreateAdminChat } from "@/hooks/chat.hook"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FamilyMemberViewProps {
  patientId: string
}

function formatActivityTime(dateStr?: string) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export default function FamilyMemberView({ patientId }: FamilyMemberViewProps) {
  const router = useRouter()
  const [showAllLogs, setShowAllLogs] = useState(false)

  // 1. Fetch Primary Patient & Family Sponsor Details
  const { data: patientResponse, isLoading: isLoadingPatient } =
    useGetPatientById(patientId)
  const patient = patientResponse?.data
  const familyMember = patient?.user
  const familyMemberId = patient?.user_id || familyMember?.id || ""

  const memberName = familyMember
    ? `${familyMember.first_name || ""} ${familyMember.last_name || ""}`.trim()
    : patient?.first_name
    ? `Sponsor of ${patient.first_name}`
    : "Family Sponsor"

  const joinedDate = patient?.created_at
    ? new Date(patient.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-"

  // 2. Fetch User-Created Patients for this Family Sponsor
  const {
    data: userPatientsResponse,
    isLoading: isLoadingPatients,
  } = useGetUserCreatedPatients(familyMemberId, { limit: 50 }, {
    enabled: !!familyMemberId,
  })
  const userPatients = userPatientsResponse?.data || []

  // 3. Fetch User Activity Timeline
  const {
    data: activityLogsResponse,
    isLoading: isLoadingLogs,
  } = useGetUserActivityLogs(familyMemberId, { limit: 50 }, {
    enabled: !!familyMemberId,
  })
  const activityLogs = activityLogsResponse?.data || []

  // 4. Fetch Admin User Analytics (Linked Patients, Active Subscriptions, Last Payment)
  const {
    data: userAnalyticsResponse,
    isLoading: isLoadingUserAnalytics,
  } = useGetAdminUserAnalytics(familyMemberId, !!familyMemberId)
  const userAnalytics = userAnalyticsResponse?.data

  // Chat initiation
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

  // 4. Map user-created patients to LinkedPatients table shape
  const linkedPatientsData: LinkedPatient[] = useMemo(() => {
    if (!userPatients || userPatients.length === 0) {
      if (patient) {
        const caregiverObj =
          patient.caregiver ||
          (typeof patient.caregiver === "object" ? patient.caregiver : null)
        const caregiverName = caregiverObj
          ? `${caregiverObj.first_name || ""} ${caregiverObj.last_name || ""}`.trim()
          : patient.assignments?.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name
          ? `${patient.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name} ${patient.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.last_name || ""}`.trim()
          : "Unassigned"

        return [
          {
            id: patient.id,
            name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Patient",
            profile_picture: patient.profile_picture,
            relationship: patient.relationship || "Primary Contact",
            caregiver: caregiverName,
            subscription: patient.plan?.tier || (patient.status === "ACTIVE" ? "Active" : "Not Active"),
          },
        ]
      }
      return []
    }

    return userPatients.map((p) => {
      const caregiverObj =
        p.caregiver ||
        (typeof p.caregiver === "object" ? p.caregiver : null)
      const caregiverName = caregiverObj
        ? `${caregiverObj.first_name || ""} ${caregiverObj.last_name || ""}`.trim()
        : p.assignments?.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name
        ? `${p.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.first_name} ${p.assignments.find((a) => a.user_role === "CARE_GIVER")?.user?.last_name || ""}`.trim()
        : "Unassigned"

      const subscriptionDisplay =
        p.plan?.tier ||
        (p.status === "ACTIVE"
          ? "Active"
          : p.status === "NOT_ACTIVE"
          ? "Not Active"
          : p.status || "Not Active")

      return {
        id: p.id,
        name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Patient",
        profile_picture: p.profile_picture,
        relationship: p.relationship || "Other",
        caregiver: caregiverName,
        subscription: subscriptionDisplay,
      }
    })
  }, [userPatients, patient])

  // Summary counts (preferring /analytics/admin/user/:userId)
  const linkedPatientsCount =
    userAnalytics?.totalPatients ??
    userPatientsResponse?.pagination?.total ??
    (userPatients.length || (patient ? 1 : 0))
  const activeSubscriptionsCount =
    userAnalytics?.totalActivePatientsWithActiveSubscriptions ??
    (userPatients.length > 0
      ? userPatients.filter((p) => !!p.plan && p.status !== "CANCELLED" && p.status !== "EXPIRED" && p.status !== "NOT_ACTIVE").length
      : patient?.plan && patient?.status === "ACTIVE" ? 1 : 0)

  const lastPayment = userAnalytics?.lastPayment ?? null
  const lastPaymentAmount = lastPayment
    ? `${lastPayment.currency === "USD" ? "$" : "₦"}${lastPayment.amount.toLocaleString()}`
    : "No payments"
  const lastPaymentDate = lastPayment?.created_at
    ? new Date(lastPayment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  const latestActivityTime = activityLogs[0]?.created_at
    ? formatActivityTime(activityLogs[0].created_at)
    : joinedDate

  const displayedLogs = showAllLogs ? activityLogs : activityLogs.slice(0, 4)

  
  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header Profile Section with action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            {memberName}
          </h1>
          <div className="flex items-center gap-2 text-body-text font-dm-san-regular text-sm mt-1">
            <span>{patient?.relationship || "Primary Family Member"}</span>
            <span className="text-zinc-300">•</span>
            <span>Joined: {joinedDate}</span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <Button className="rounded-full bg-error text-white font-dm-san-regular font-normal text-xs p-3 hover:bg-error cursor-pointer outline-hidden border-none shadow-none">
            Suspend Account
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isCreatingChat || !familyMemberId}
            className="rounded-full bg-primary-color text-white font-dm-san-regular font-normal text-xs p-3 hover:bg-primary-color cursor-pointer outline-hidden border-none shadow-none disabled:opacity-50"
          >
            {isCreatingChat ? "Opening..." : "Send Message"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Linked Patients */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-border-light rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Linked Patients
          </span>
          <span className="text-2xl font-bold font-sans text-body-text block">
            {isLoadingUserAnalytics && isLoadingPatients ? (
              <span className="text-sm font-normal text-body-text">Loading...</span>
            ) : (
              linkedPatientsCount
            )}
          </span>
        </div>

        {/* Active Subscriptions */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-body-text/40 rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Active Subscriptions
          </span>
          <span className="text-2xl font-bold font-sans text-body-text block">
            {isLoadingUserAnalytics && isLoadingPatients ? (
              <span className="text-sm font-normal text-body-text">Loading...</span>
            ) : (
              activeSubscriptionsCount
            )}
          </span>
        </div>

        {/* Last Payment */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-body-text/40 rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Last Payment
          </span>
          <div className="space-y-0.5">
            <span className="text-xl font-bold font-sans text-heading-text block truncate">
              {isLoadingUserAnalytics ? (
                <span className="text-sm font-normal text-body-text">Loading...</span>
              ) : (
                lastPaymentAmount
              )}
            </span>
            {!isLoadingUserAnalytics && lastPaymentDate && (
              <span className="text-xs text-zinc-500 font-sans block truncate">
                {lastPaymentDate}
                {lastPayment?.plan?.name ? ` • ${lastPayment.plan.name}` : ""}
              </span>
            )}
          </div>
        </div>

        {/* Last Activity */}
        <div className="p-4 flex flex-col gap-4 bg-primary-light border border-body-text/40 rounded-[8px] shadow-2xs space-y-2">
          <span className="text-base font-semibold text-body-text font-sans block">
            Last Activity
          </span>
          <span className="text-xl font-bold font-sans text-heading-text block truncate">
            {isLoadingLogs ? (
              <span className="text-sm font-normal text-body-text">Loading...</span>
            ) : (
              latestActivityTime
            )}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Linked Patients Table & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Linked Patients Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-medium text-body-text">
                Linked Patients
              </h2>
              {linkedPatientsCount > 0 && (
                <span className="text-xs text-zinc-500 font-dm-san-regular">
                  {linkedPatientsCount} patient{linkedPatientsCount === 1 ? "" : "s"} linked
                </span>
              )}
            </div>

            <LinkedPatientsTable
              data={linkedPatientsData}
              isLoading={isLoadingPatients}
            />
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6 bg-white p-6 rounded-[8px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-medium text-body-text">
                Activity Timeline
              </h2>
            </div>

            {isLoadingLogs ? (
              <div className="py-8 flex items-center justify-center gap-2 text-body-text/70 text-sm font-dm-san-regular">
                <IconLoader2 className="size-4 animate-spin text-primary-color" />
                <span>Loading activity logs...</span>
              </div>
            ) : activityLogs.length === 0 ? (
              <p className="text-sm font-dm-san-regular text-zinc-400 py-6 text-center">
                No recent activity recorded for this family sponsor.
              </p>
            ) : (
              <div className="relative ml-3.5 space-y-8">
                {/* Single continuous vertical line */}
                <div className="absolute left-1.5 top-2 bottom-2 border-l border-[#888888]" />

                {displayedLogs.map((item, index) => {
                  const isLatest = index === 0
                  return (
                    <div key={item._id || index} className="relative flex gap-4">
                      {/* Node Dot */}
                      <div className="flex flex-col items-center pt-1">
                        <div
                          className={`size-3.5 rounded-full ring-4 shrink-0 ${
                            isLatest
                              ? "bg-secondary-color ring-white"
                              : "bg-[#888888] ring-white"
                          }`}
                        />
                      </div>

                      {/* Content: log_type, time, message */}
                      <div className="flex-1 space-y-1 -ml-px">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className="font-bold text-heading-text text-sm font-sans">
                            {item.log_type || item.action || "Activity Log"}
                          </h4>
                          <span className="text-xs text-zinc-500 font-sans whitespace-nowrap">
                            {formatActivityTime(item.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* View Full History Toggle Button */}
            {activityLogs.length > 4 && (
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setShowAllLogs((prev) => !prev)}
                  variant="outline"
                  className="rounded-full border bg-white border-secondary-color font-sans font-semibold text-xs text-secondary-color px-6 py-2 h-9 hover:bg-zinc-50 cursor-pointer outline-hidden shadow-none"
                >
                  {showAllLogs
                    ? "Show Less"
                    : `View Full History (${activityLogs.length})`}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Contact Details */}
        <div className="space-y-6 bg-white rounded-[8px] h-fit p-6">
          <h2 className="text-[22px] font-medium text-body-text">
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
