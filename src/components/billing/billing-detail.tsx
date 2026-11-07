"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  IconArrowLeft,
  IconFileDownload,
  IconLoader2,
  IconPhone,
  IconAlertCircle,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { getBillingDetailColumns } from "./billing-detail-columns"
import { AdminPaymentItem } from "@/types/billing.type"
import { useGetPaymentByPatientId } from "@/hooks/billing.hook"
import { useGetPatientById } from "@/hooks/patient.hook"
import { cn } from "@/libs/utils"

interface BillingDetailProps {
  patientId: string
  onBack?: () => void
}

const isSafeImageUrl = (url?: string | null) => {
  if (!url) return false
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  )
}

export default function BillingDetail({
  patientId,
  onBack,
}: BillingDetailProps) {
  const router = useRouter()

  // 1. Fetch live payment history for patient
  const {
    data: paymentResponse,
    isPending: isPaymentPending,
  } = useGetPaymentByPatientId(patientId)

  // 2. Fetch patient record for complete profile details
  const {
    data: patientResponse,
    isPending: isPatientPending,
  } = useGetPatientById(patientId)

  const isLoading = isPaymentPending || isPatientPending

  // Normalize payments data into array
  const rawPayments = paymentResponse?.data
  const paymentList: AdminPaymentItem[] = useMemo(() => {
    if (Array.isArray(rawPayments)) return rawPayments
    if (rawPayments) return [rawPayments]
    return []
  }, [rawPayments])

  // Get primary / latest payment item
  const latestPayment = paymentList[0] || null

  // Patient data resolution
  const patient = patientResponse?.data || latestPayment?.patient
  const patientName =
    `${patient?.first_name || ""} ${patient?.last_name || ""}`.trim() ||
    "Patient"
  const patientInitials =
    `${patient?.first_name?.[0] || ""}${patient?.last_name?.[0] || ""}`.toUpperCase() ||
    "P"

  const registeredDate = patient?.created_at
    ? new Date(patient.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-"

  // Family Member data resolution
  const familyMember = latestPayment?.user || (patient as any)?.user
  const familyMemberName =
    `${familyMember?.first_name || ""} ${familyMember?.last_name || ""}`.trim() ||
    "Family Member"
  const familyMemberInitials =
    `${familyMember?.first_name?.[0] || ""}${familyMember?.last_name?.[0] || ""}`.toUpperCase() ||
    "FM"

  // Active Plan details resolution
  const plan = latestPayment?.plan || (patient as any)?.plan
  const planPrice = Number(plan?.price || 0)
  const planCurrency = latestPayment?.currency || "NGN"
  const planCategory = plan?.category
    ? plan.category.replace(/_/g, " ")
    : "Care Plan"
  const planTier = plan?.tier || "-"

  const paymentStatus = (
    latestPayment?.status ||
    (patient as any)?.status ||
    "PENDING"
  ).toUpperCase()

  let statusBadgeClasses = "border-pending-border bg-pending-btn text-pending-border"
  let statusBadgeLabel = "Pending"

  if (["PAID", "SUCCESS", "ACTIVE"].includes(paymentStatus)) {
    statusBadgeClasses = "border-active-border bg-active-btn text-active-border"
    statusBadgeLabel = "Active"
  } else if (["FAILED", "EXPIRED"].includes(paymentStatus)) {
    statusBadgeClasses = "border-warning-border bg-warning-btn text-warning-border"
    statusBadgeLabel = paymentStatus === "EXPIRED" ? "Expired" : "Failed"
  } else if (paymentStatus === "REFUNDED") {
    statusBadgeClasses = "border-[#9CA3AF] bg-secondary-light text-[#4B5563]"
    statusBadgeLabel = "Refunded"
  }

  const paidDateFormatted = latestPayment?.created_at
    ? new Date(latestPayment.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-"

  const renewalDateFormatted = useMemo(() => {
    if (!latestPayment?.created_at) return "-"
    try {
      const d = new Date(latestPayment.created_at)
      d.setMonth(d.getMonth() + 1)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "-"
    }
  }, [latestPayment?.created_at])

  // Handlers
  const handleOverrideSubscription = () => {
    router.push(`/dashboard/patients/${patientId}/create-bill`)
  }

  const handleMessageMember = (userId?: string) => {
    router.push(
      userId ? `/dashboard/messages?userId=${userId}` : `/dashboard/messages`
    )
  }

  const handleRefundTransaction = (payment: AdminPaymentItem) => {
    router.push(`/dashboard/billing/refunds`)
  }

  const handleExportCSV = () => {
    if (paymentList.length === 0) {
      alert("No payment transactions to export.")
      return
    }

    const headers = [
      "Payment ID",
      "Plan Name",
      "Tier",
      "Category",
      "Amount",
      "Currency",
      "Status",
      "Date",
    ]
    const rows = paymentList.map((p) => [
      `"${p.id || ""}"`,
      `"${p.plan?.name || ""}"`,
      `"${p.plan?.tier || ""}"`,
      `"${p.plan?.category || ""}"`,
      `"${p.plan?.price || 0}"`,
      `"${p.currency || "NGN"}"`,
      `"${p.status || ""}"`,
      `"${p.created_at || ""}"`,
    ])

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `billing_patient_${patientId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns = useMemo<ColumnDef<AdminPaymentItem>[]>(
    () =>
      getBillingDetailColumns({
        onRefund: handleRefundTransaction,
        onMessage: handleMessageMember,
      }),
    []
  )

  
  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <IconLoader2 className="size-8 text-primary-color animate-spin" />
        <span className="text-xs font-dm-san-regular text-body-text/70">
          Loading billing details...
        </span>
      </div>
    )
  }

  if (!patient && paymentList.length === 0) {
    return (
      <div className="w-full space-y-6 select-none font-dm-san-regular">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack || (() => router.push("/dashboard/billing"))}
            className="flex items-center gap-1.5 text-xs text-body-text hover:text-primary-color transition-colors cursor-pointer group"
          >
            <IconArrowLeft className="size-4 text-body-text group-hover:text-primary-color transition-colors" />
            <span>Back to Billing</span>
          </button>
        </div>
        <div className="bg-white border border-zinc-200/60 rounded-[8px] p-12 text-center flex flex-col items-center justify-center gap-3">
          <IconAlertCircle className="size-10 text-zinc-400" />
          <h2 className="text-lg font-semibold text-body-text">
            Patient or Billing Record Not Found
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm">
            We could not find any active patient or billing details matching ID:{" "}
            <span className="font-mono">{patientId}</span>.
          </p>
          <Button
            onClick={onBack || (() => router.push("/dashboard/billing"))}
            className="mt-2 rounded-full bg-primary-color hover:bg-primary-color/90 text-white text-xs px-5"
          >
            Return to Billing Overview
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 pb-12 select-none">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack || (() => router.push("/dashboard/billing"))}
          className="flex items-center gap-1.5 text-xs text-body-text hover:text-primary-color transition-colors cursor-pointer group"
        >
          <IconArrowLeft className="size-4 text-body-text group-hover:text-primary-color transition-colors" />
          <span>Back to Billing</span>
        </button>
      </div>

      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border border-zinc-200 shrink-0 shadow-2xs">
            {isSafeImageUrl(patient?.profile_picture) ? (
              <AvatarImage
                src={patient!.profile_picture!}
                alt={patientName}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-bold text-lg font-dm-san-regular">
              {patientInitials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              {patientName}
            </h1>
            <p className="text-body-text font-dm-san-regular font-normal text-sm">
              ID: <span className="font-mono text-xs">{patientId}</span> |
              Registered: {registeredDate}
            </p>
          </div>
        </div>

        <Button
          onClick={handleOverrideSubscription}
          className="rounded-full bg-error hover:bg-error/90 text-white font-dm-san-regular font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors self-start sm:self-center"
        >
          Override Subscription
        </Button>
      </div>

      {/* Subscription info and Family columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 items-start">
        {/* Col 1: Subscription Info */}
        <div className="space-y-4 bg-white rounded-[8px] p-6 border border-zinc-200/50 shadow-3xs">
          <h3 className="text-[20px] font-medium font-dm-san-regular text-body-text">
            Subscription Info
          </h3>

          <div className="space-y-3.5 font-dm-san-regular text-sm text-body-text">
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Status</span>
              <span
                className={cn(
                  "inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full select-none capitalize",
                  statusBadgeClasses
                )}
              >
                {statusBadgeLabel}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Plan Name</span>
              <span className="font-normal text-body-text text-base">
                {plan?.name || "Care Plan"}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Plan Amount</span>
              <span className="font-normal text-body-text text-base">
                ₦{planPrice.toLocaleString()} {planCurrency}/month
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Care Category</span>
              <span className="font-normal text-body-text text-base">
                {planCategory}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Tier</span>
              <span className="font-normal text-body-text text-base">
                {planTier}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5">
              <span className="font-bold text-body-text text-sm">Paid Date</span>
              <span className="font-normal text-body-text text-base">
                {paidDateFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between py-0.5 border-b border-zinc-100 pb-3">
              <span className="font-bold text-body-text text-sm">Next Renewal</span>
              <span className="font-normal text-body-text text-base">
                {renewalDateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: Family Member */}
        <div className="space-y-4 bg-white rounded-[8px] p-6 border border-zinc-200/50 shadow-3xs h-fit">
          <h3 className="text-[20px] font-medium font-dm-san-regular text-body-text">
            Family Member
          </h3>

          {familyMember ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
              <div className="flex items-center gap-3.5 min-w-0">
                <Avatar className="size-12 border border-zinc-200 shrink-0">
                  {isSafeImageUrl(familyMember.profile_picture) ? (
                    <AvatarImage
                      src={familyMember.profile_picture!}
                      alt={familyMemberName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary-light text-primary-color font-bold text-sm">
                    {familyMemberInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <span className="font-semibold text-base text-body-text block truncate">
                    {familyMemberName}
                  </span>
                  {familyMember.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-dm-san-regular mt-0.5">
                      <IconPhone className="size-3.5 text-zinc-400 shrink-0" />
                      <span>{familyMember.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={() => handleMessageMember(familyMember.id)}
                variant="outline"
                className="rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:text-secondary-color hover:bg-zinc-50 px-4 py-2 cursor-pointer shadow-none transition-colors shrink-0 self-start sm:self-center"
              >
                Message Family Member
              </Button>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-zinc-400 font-dm-san-regular">
              No family member linked to this patient.
            </div>
          )}
        </div>
      </div>

      {/* Payment History Table Section */}
      <div className="space-y-4 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-dm-san-regular text-body-text">
              Payment History
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Historical transactions and payments logged for this patient.
            </p>
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="rounded-full border border-secondary-color bg-transparent hover:text-secondary-color font-dm-san-regular font-normal text-xs text-secondary-color hover:bg-transparent px-3.5 py-2 cursor-pointer shadow-none transition-colors gap-1.5"
          >
            <IconFileDownload className="size-4 text-secondary-color" />
            Export CSV
          </Button>
        </div>

        {/* DataTable */}
        {paymentList.length > 0 ? (
          <DataTable
            columns={columns}
            data={paymentList}
            isPaginated={paymentList.length > 10}
            pageSize={10}
          />
        ) : (
          <div className="p-10 text-center bg-white border border-zinc-200/60 rounded-[8px] text-zinc-400 text-xs font-dm-san-regular">
            No payment transactions recorded for this patient.
          </div>
        )}
      </div>
    </div>
  )
}
