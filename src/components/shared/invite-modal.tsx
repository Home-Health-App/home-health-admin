"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSendInvitation } from "@/hooks/invitation.hook"
import { IconCheck, IconX } from "@tabler/icons-react"

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "USER" | "CARE_GIVER"
}

type ModalView = "form" | "success" | "failure"

export default function InviteModal({
  open,
  onOpenChange,
  type,
}: InviteModalProps) {
  const [view, setView] = useState<ModalView>("form")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const { mutate: sendInvite, isPending } = useSendInvitation()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setView("form")
      setFirstName("")
      setLastName("")
      setEmail("")
      setEmailError("")
    }
  }, [open])

  // Simple email validation helper
  const validateEmail = (val: string) => {
    if (!val) {
      return "Email is required"
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(val)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)
    if (emailError) {
      setEmailError(validateEmail(val))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const err = validateEmail(email)
    if (err) {
      setEmailError(err)
      return
    }

    sendInvite(
      { email: email.trim(), type },
      {
        onSuccess: () => {
          setView("success")
        },
        onError: () => {
          setView("failure")
        },
      }
    )
  }

  const appName = type === "USER" ? "family member app" : "caregiver app"
  const fullName = `${firstName.trim()} ${lastName.trim()}` || email

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-6 rounded-2xl gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        
        {/* Form View */}
        {view === "form" && (
          <div className="space-y-6">
            <DialogHeader className="flex flex-row items-center justify-between pb-2">
              <DialogTitle className="text-2xl font-bold font-dm-san-regular text-body-text">
                Send Invitation Link
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 font-dm-san-regular">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-body-text">
                    First Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-11 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-body-text">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-11 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-body-text">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="somiigwe@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailError(validateEmail(email))}
                  className="h-11 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-300 focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400"
                  aria-invalid={!!emailError}
                />
                {emailError && (
                  <p className="text-xs text-red-500 font-normal mt-1">{emailError}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="flex-1 rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 h-11 cursor-pointer transition-colors shadow-none"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || !email || !!emailError}
                  className="flex-1 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-11 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-[#D0DFE7] disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
                >
                  {isPending ? "Sending..." : "Send Invitation Link"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Success View */}
        {view === "success" && (
          <div className="flex flex-col items-center text-center p-4 space-y-5 font-dm-san-regular">
            {/* Green Checkmark Icon */}
            <div className="size-16 rounded-full bg-[#EEFDF4] flex items-center justify-center text-[#22C55E]">
              <IconCheck className="size-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-body-text">
                Your invite is sent
              </h3>
              <p className="text-sm text-zinc-500 font-normal max-w-xs leading-relaxed">
                An email with the invitation link to join the <span className="font-semibold">{appName}</span> has been sent to <span className="font-semibold text-body-text">{fullName}</span>
              </p>
            </div>

            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-11 border-none shadow-none cursor-pointer outline-hidden transition-colors mt-2"
            >
              Close
            </Button>
          </div>
        )}

        {/* Failure View */}
        {view === "failure" && (
          <div className="flex flex-col items-center text-center p-4 space-y-5 font-dm-san-regular">
            {/* Red X Icon */}
            <div className="size-16 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#EF4444]">
              <IconX className="size-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-body-text">
                Failed to send invite
              </h3>
              <p className="text-sm text-zinc-500 font-normal max-w-xs leading-relaxed">
                Failed to send the invitation email to <span className="font-semibold text-body-text">{fullName}</span> for the <span className="font-semibold">{appName}</span>.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => setView("form")}
              className="w-full rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-11 border-none shadow-none cursor-pointer outline-hidden transition-colors mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
