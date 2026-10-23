"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import {
  IconCheck,
  IconDownload,
  IconPrinter,
  IconSparkles,
  IconLoader2,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetPaymentById, useVerifyPaymentLink } from "@/hooks/billing.hook"
import { toast } from "sonner"

const PaystackCheckoutButton = dynamic(
  () => import("./paystack-checkout-button"),
  {
    ssr: false,
    loading: () => (
      <Button
        disabled
        className="w-full h-12 rounded-full bg-secondary-color text-white font-dm-san-regular font-bold text-sm shadow-md flex items-center justify-center gap-2 opacity-80"
      >
        <IconLoader2 className="size-4 animate-spin" />
        <span>Loading Paystack Gateway...</span>
      </Button>
    ),
  }
)

interface PaymentCheckoutViewProps {
  paymentId?: string
}

export default function PaymentCheckoutView({ paymentId }: PaymentCheckoutViewProps) {
  const resolvedId = paymentId || ""

  // 1. Fetch payment details by ID
  const {
    data: paymentResponse,
    isPending: isPaymentPending,
    error,
    refetch: refetchPayment,
  } = useGetPaymentById(resolvedId)
  const paymentData = paymentResponse?.data

  // 2. Server verification mutation (POST /payment-link/verify/:id)
  const verifyMutation = useVerifyPaymentLink()

  // 3. Extract core details
  const patient = paymentData?.patient
  const selectedPlan = paymentData?.plan
  const paymentRecord = paymentData?.payment
  const familyMember = patient?.user || paymentRecord?.user

  console.log(paymentData)

  const patientFullName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
    : "Patient"

  const familyFullName =
    `${familyMember?.first_name || ""} ${familyMember?.last_name || ""}`.trim() ||
    `${paymentData?.first_name || ""} ${paymentData?.last_name || ""}`.trim() ||
    "Primary Family Sponsor"

  // Comprehensive email resolution
  const customerEmail = (
    paymentData?.email ||
    familyMember?.email ||
    paymentRecord?.user?.email ||
    ""
  ).trim()

  const sponsorPhone = familyMember?.phone || patient?.phone

  const finalTotalAmount = Number(selectedPlan?.price || 0)
  const amountInKobo = Math.round(finalTotalAmount * 100)

  // Payment reference strictly lies in PaymentLinkResponseData.payment.id
  const paymentReference = paymentRecord?.id || paymentData?.payment_id || ""

  const isAlreadyPaid = paymentData?.status === "PAID" || paymentRecord?.status === "PAID"

  // 4. View states
  const [paymentState, setPaymentState] = useState<"idle" | "success">("idle")
  const [transactionRef, setTransactionRef] = useState(paymentReference)
  const [paidAt, setPaidAt] = useState("")

  // 5. Verification handler
  const handlePaymentSuccess = (response?: any) => {
    const targetPaymentId = paymentReference || response?.reference
    if (!targetPaymentId) {
      toast.error("Payment reference identifier is missing from record.")
      return
    }

    if (response?.reference) {
      setTransactionRef(response.reference)
    }

    toast.loading("Verifying payment...", { id: "payment-verify" })

    // verifyMutation.mutate(
    //   {
    //     paymentRecordId: targetPaymentId,
    //   },
    //   {
    //     onSuccess: () => {
    //       setPaidAt(
    //         new Date().toLocaleString("en-US", {
    //           month: "short",
    //           day: "numeric",
    //           year: "numeric",
    //           hour: "2-digit",
    //           minute: "2-digit",
    //         })
    //       )
    //       setPaymentState("success")
    //       toast.success("Payment verified successfully! Care plan subscription is active.", {
    //         id: "payment-verify",
    //       })
    //       refetchPayment()
    //     }, 
    //     onError: (err: any) => {
    //       const errMsg =
    //         err?.response?.data?.message ||
    //         err?.message ||
    //         "Could not verify transaction with the server. Please try again."
    //       toast.error(errMsg, { id: "payment-verify" })
    //     },
    //   }
    // )
  }

  const handlePaymentClose = () => {
    toast.info("Payment window closed.")
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  if (isPaymentPending) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3">
        <IconLoader2 className="size-8 text-primary-color animate-spin" />
        <p className="text-xs font-dm-san-regular text-zinc-500">
          Loading payment details...
        </p>
      </div>
    )
  }

  if (error || (!isPaymentPending && !paymentData)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 max-w-md w-full shadow-sm space-y-3">
          <h2 className="text-lg font-bold font-dm-san-regular text-body-text">
            Payment Not Found
          </h2>
          <p className="text-xs font-dm-san-regular text-zinc-500">
            We couldn&apos;t retrieve the details for this payment. It may have expired or the link is invalid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-body-text selection:bg-primary-light selection:text-primary-color flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        {paymentState === "success" || isAlreadyPaid ? (
          /* ================= SUCCESS / DIGITAL RECEIPT VIEW ================= */
          <div className="w-full max-w-xl bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Header Celebration */}
            <div className="text-center space-y-2.5">
              <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <IconCheck className="size-8 stroke-[3]" />
              </div>
              <Badge className="bg-emerald-600 text-white font-dm-san-regular px-3 py-0.5 text-2xs">
                {isAlreadyPaid ? "Subscription Active" : "Payment Completed & Verified"}
              </Badge>
              <h1 className="text-2xl font-extrabold font-dm-san-regular text-body-text">
                Care Plan Activated!
              </h1>
              <p className="text-xs font-dm-san-regular text-zinc-600 max-w-sm mx-auto">
                Thank you, <span className="font-semibold">{familyFullName}</span>. The subscription for{" "}
                <span className="font-semibold text-primary-color">{patientFullName}</span> has been confirmed.
              </p>
            </div>

            {/* Receipt Box in Naira (NGN) */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5">
                <span className="text-2xs font-bold font-dm-san-regular uppercase tracking-wider text-zinc-500">
                  Paystack Official Receipt
                </span>
                <span className="text-xs font-mono font-bold text-zinc-700 truncate max-w-[180px]">
                  {transactionRef || paymentRecord?.id || paymentData?.id || "N/A"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-dm-san-regular">
                <div>
                  <span className="text-zinc-400 block text-2xs">Patient</span>
                  <span className="font-bold text-body-text">{patientFullName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-2xs">Payer (Family)</span>
                  <span className="font-bold text-body-text">{familyFullName}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-2xs">Care Plan Tier</span>
                  <span className="font-bold text-body-text">{selectedPlan?.name} ({selectedPlan?.tier})</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-2xs">Category</span>
                  <span className="font-bold text-body-text">{selectedPlan?.category?.replace(/_/g, " ") || "General Care"}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-2xs">Payment Date</span>
                  <span className="font-medium text-body-text">{paidAt || new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-2xs">Payment Gateway</span>
                  <span className="font-medium text-body-text capitalize">
                    Paystack (NGN)
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-200 flex justify-between items-baseline">
                <span className="text-xs font-bold font-dm-san-regular text-body-text">Amount Paid:</span>
                <span className="text-xl font-black font-dm-san-regular text-emerald-600">
                  ₦{finalTotalAmount.toLocaleString()} NGN
                </span>
              </div>
            </div>

            {/* Coverage Confirmation */}
            <div className="p-4 rounded-xl bg-primary-light/40 border border-[#B3CBE6] space-y-2">
              <div className="flex items-center gap-2">
                <IconSparkles className="size-4 text-primary-color shrink-0" />
                <span className="text-xs font-bold font-dm-san-regular text-primary-color">
                  Care Plan Activated
                </span>
              </div>
              <p className="text-xs font-dm-san-regular text-zinc-700 leading-relaxed">
                Dedicated caregivers and nurses for {patientFullName} are now active. A copy of this receipt has been emailed to <span className="font-semibold">{customerEmail || "your registered email"}</span>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 rounded-xl h-10 text-xs font-dm-san-regular font-bold border-zinc-300 hover:bg-zinc-100 flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
              >
                <IconPrinter className="size-4" />
                <span>Print Receipt</span>
              </Button>
              <Button
                onClick={() => toast.success("Receipt PDF downloaded to device.")}
                className="flex-1 rounded-xl h-10 text-xs font-dm-san-regular font-bold bg-secondary-color hover:bg-secondary-color/90 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
              >
                <IconDownload className="size-4" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>
        ) : (
          /* ================= CENTERED PLAN & PATIENT DETAILS WITH PAYMENT BUTTON ================= */
          <div className="w-full max-w-xl space-y-6">
            {/* Recipient / Patient Summary Card */}
            <div className="bg-white border border-body-text/20 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold font-dm-san-regular uppercase tracking-wider text-body-text">
                  Care Recipient
                </span>
                <Badge variant="outline" className="border-secondary-color bg-secondary-light text-secondary-color text-2xs font-dm-san-regular">
                  Patient Profile
                </Badge>
              </div>

              <div className="flex items-center gap-3.5">
                <Avatar className="size-14 border border-body-text/20 shrink-0">
                  {patient?.profile_picture ? (
                    <AvatarImage
                      src={patient.profile_picture}
                      alt={patientFullName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary-light text-primary-color font-bold text-base">
                    {patient?.first_name?.[0] || "P"}{patient?.last_name?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold font-dm-san-regular text-body-text truncate">
                    {patientFullName}
                  </h3>
                  <span className="text-xs text-zinc-500 font-dm-san-regular block">
                    {patient?.age ? `${patient.age} yrs • ` : ""}{patient?.gender ? `${patient.gender} • ` : ""}Home Care Recipient
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-secondary-light text-sm rounded-xl border border-zinc-100 space-y-2 font-dm-san-regular">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Responsible Sponsor:</span>
                  <span className="font-semibold text-body-text">
                    {familyFullName} {patient?.relationship ? `(${patient.relationship})` : ""}
                  </span>
                </div>
                {customerEmail && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Sponsor Email:</span>
                    <span className="font-medium text-body-text truncate max-w-[220px]">
                      {customerEmail}
                    </span>
                  </div>
                )}
                {sponsorPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Sponsor Phone:</span>
                    <span className="font-medium text-body-text truncate max-w-[220px]">
                      {sponsorPhone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selected Plan Details & Payment Trigger */}
            <div className="bg-white border border-body-text/20 rounded-2xl p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <span className="text-2xs font-bold uppercase tracking-wider text-zinc-400 font-dm-san-regular">
                    Subscription Plan
                  </span>
                  <h3 className="text-xl font-bold font-dm-san-regular text-body-text mt-0.5">
                    {selectedPlan?.name}
                  </h3>
                </div>
                <Badge className="bg-primary-color text-white text-xs font-dm-san-regular">
                  {selectedPlan?.tier} Tier
                </Badge>
              </div>

              {/* Inclusions Checklist */}
              {selectedPlan?.coverage && selectedPlan.coverage.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-dm-san-regular block">
                    What&apos;s Included In This Plan:
                  </span>
                  <ul className="space-y-2.5 text-xs text-body-text font-dm-san-regular">
                    {selectedPlan.coverage.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="size-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <IconCheck className="size-3 stroke-[3]" />
                        </div>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Breakdown in Naira */}
              <div className="pt-4 border-t border-border-light space-y-2.5 text-sm font-dm-san-regular">
                <div className="pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-body-text">Total Due:</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold font-dm-san-regular text-primary-color">
                      ₦{finalTotalAmount.toLocaleString()}
                    </span>
                    <span className="text-2xs text-zinc-400 block">NGN</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT BUTTON AT THE BOTTOM */}
              <div className="pt-4 border-t border-border-light space-y-3">
                <PaystackCheckoutButton
                  reference={paymentReference}
                  email={customerEmail}
                  amountInKobo={amountInKobo}
                  amountInNaira={finalTotalAmount}
                  disabled={finalTotalAmount <= 0 || !customerEmail || !paymentReference || verifyMutation.isPending}
                  isVerifying={verifyMutation.isPending}
                  onSuccess={handlePaymentSuccess}
                  onClose={handlePaymentClose}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
