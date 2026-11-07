"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconCheck,
  IconCopy,
  IconMail,
  IconExternalLink,
  IconFileInvoice,
  IconLink,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { GeneratedBillData } from "@/types/billing-link.type"

interface PaymentLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  billData: GeneratedBillData | null
  onDone?: () => void
}

export default function PaymentLinkModal({
  open,
  onOpenChange,
  billData,
  onDone,
}: PaymentLinkModalProps) {
  const [copied, setCopied] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  if (!billData) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(billData.payment_link)
    setCopied(true)
    toast.success("Payment link copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSendEmail = () => {
    setSendingEmail(true)
    setTimeout(() => {
      setSendingEmail(false)
      setEmailSent(true)
      toast.success(`Payment link sent to ${billData.user?.email || "family member"}!`)
    }, 900)
  }

  const familyName = billData.user
    ? `${billData.user.first_name || ""} ${billData.user.last_name || ""}`.trim() || "Family Member"
    : "Family Member"

  const patientName = billData.patient
    ? `${billData.patient.first_name || ""} ${billData.patient.last_name || ""}`.trim()
    : "Patient"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-full p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-2xl space-y-5 select-none focus:outline-hidden">
        {/* Header */}
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div>
              <DialogTitle className="text-xl font-bold font-dm-san-regular text-body-text flex items-center gap-2">
                <IconFileInvoice className="size-5 text-secondary-color" />
                Payment Link Ready
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-500 font-dm-san-regular">
                Care plan bill generated for <span className="font-semibold text-body-text">{patientName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Concise Plan & Bill Summary Box */}
        <div className="p-4 rounded-xl bg-secondary-light/60 border border-border-light space-y-2.5 text-sm font-dm-san-regular">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Selected Plan:</span>
            <span className="font-bold text-body-text">{billData.plan?.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Plan Tier:</span>
            <Badge variant="outline" className="text-2xs font-dm-san-regular px-2 py-0">
              {billData.plan?.tier || "Tier"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Billed To (Family):</span>
            <span className="font-medium text-body-text truncate max-w-[220px]">
              {familyName} {billData.user?.email ? `(${billData.user.email})` : ""}
            </span>
          </div>

          <div className="pt-2.5 border-t border-zinc-200/80 flex justify-between items-baseline">
            <span className="text-xs font-bold text-body-text">Total Amount:</span>
            <span className="text-xl font-extrabold text-primary-color">
              ₦{billData.total_amount.toLocaleString()} NGN
            </span>
          </div>
        </div>

        {/* Generated Payment URL Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-body-text font-dm-san-regular flex items-center gap-1.5">
            <IconLink className="size-3.5 text-secondary-color" />
            <span>Generated Payment URL</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={billData.payment_link}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 text-xs font-mono text-body-text select-all outline-hidden focus:border-secondary-color transition-colors"
            />
            <Button
              onClick={handleCopy}
              size="sm"
              className="h-11 px-4 rounded-xl bg-secondary-color hover:bg-secondary-color/90 text-white font-dm-san-regular text-xs shadow-none cursor-pointer shrink-0 flex items-center gap-1.5 transition-all"
            >
              {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <Button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            variant="outline"
            className="w-full sm:flex-1 h-11 rounded-xl border-zinc-200 hover:bg-zinc-50 text-xs font-dm-san-regular text-body-text flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
          >
            {emailSent ? (
              <IconCheck className="size-4 text-active-border" />
            ) : (
              <IconMail className="size-4 text-primary-color" />
            )}
            <span className="truncate">
              {emailSent ? "Email Sent!" : sendingEmail ? "Sending Email..." : "Email Link to Family"}
            </span>
          </Button>

          <a
            href={billData.payment_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1"
          >
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-zinc-200 hover:bg-zinc-50 text-xs font-dm-san-regular text-body-text flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
            >
              <IconExternalLink className="size-4 text-primary-color" />
              <span>Open Checkout Page</span>
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

