"use client"

import  { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useSendInvitation } from "@/hooks/invitation.hook"
import { useForm } from "@/hooks/use-form"
import { IconCheck, IconX } from "@tabler/icons-react"
import { z } from "zod/v4"
import { cn } from "@/libs/utils"

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "USER" | "CARE_GIVER"
}

type ModalView = "form" | "success" | "failure"

const inviteFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
})

export default function InviteModal({
  open,
  onOpenChange,
  type,
}: InviteModalProps) {
  const [view, setView] = useState<ModalView>("form")

  const { mutate: sendInvite, isPending } = useSendInvitation()

  // Form Hook
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    schema: inviteFormSchema,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  // Watch names for dynamic success/failure cards
  const watchedValues = watch()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setView("form")
      reset()
    }
  }, [open, reset])

  const onSubmit = handleSubmit((values) => {
    sendInvite(
      {
        email: values.email.trim(),
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        phone: values.phone.trim(),
        type,
      },
      {
        onSuccess: () => {
          setView("success")
        },
        onError: () => {
          setView("failure")
        },
      }
    )
  })

  const appName = type === "USER" ? "family member app" : "caregiver app"
  const fullName = `${(watchedValues.firstName || "").trim()} ${(watchedValues.lastName || "").trim()}`.trim() || watchedValues.email

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        
        {/* Form View */}
        {view === "form" && (
          <div className="space-y-6">
            <DialogHeader className="flex flex-row items-center justify-between pb-2">
              <DialogTitle className="text-2xl font-bold font-dm-san-regular text-body-text">
                Send Invitation Link
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-5 font-dm-san-regular">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <Field>
                  <FieldLabel className="text-xs font-semibold text-body-text">
                    First Name
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Jane"
                    {...register("firstName")}
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden", errors.firstName ? "border-error" : "border-zinc-200")}
                  />
                  <FieldError errors={[errors.firstName]} />
                </Field>

                {/* Last Name */}
                <Field>
                  <FieldLabel className="text-xs font-semibold text-body-text">
                    Last Name
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden", errors.lastName ? "border-error" : "border-zinc-200")}
                  />
                  <FieldError errors={[errors.lastName]} />
                </Field>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Email
                </FieldLabel>
                <Input
                  type="email"
                  placeholder="somiigwe@gmail.com"
                  {...register("email")}
                  className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden", errors.email ? "border-error" : "border-zinc-200")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              {/* Phone Number */}
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Phone Number
                </FieldLabel>
                <Input
                  type="tel"
                  placeholder="+234700000000"
                  {...register("phone")}
                  className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden", errors.phone ? "border-error" : "border-zinc-200")}
                />
                <FieldError errors={[errors.phone]} />
              </Field>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="flex-1 rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 h-12 cursor-pointer transition-colors shadow-none"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || !isValid}
                  className="flex-1 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-[#D0DFE7] disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
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
              className="w-full rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors mt-2"
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
              className="w-full rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
