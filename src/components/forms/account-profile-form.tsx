"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useForm } from "@/hooks/use-form"
import { z } from "zod/v4"
import { cn } from "@/libs/utils"

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
})

export default function AccountProfileForm() {
  // Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    schema: profileFormSchema,
    defaultValues: {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe@gmail.com",
    },
  })

  const onSubmit = handleSubmit((values) => {
    alert(`Profile saved successfully!\nName: ${values.firstName} ${values.lastName}\nEmail: ${values.email}`)
  })

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1">
        <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text">
          Account Profile
        </h2>
        <p className="text-sm font-normal font-dm-san-regular text-body-text">
          Manage your personal information
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* First Name */}
          <Field>
            <FieldLabel className="text-sm font-normal text-[#2B2B2B] font-dm-san-regular">
              First Name
            </FieldLabel>
            <Input
              type="text"
              {...register("firstName")}
              className={cn("h-11! px-4 rounded-[8px] border font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text focus:outline-hidden", errors.firstName ? "border-error" : "border-primary-color/30")}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          {/* Last Name */}
          <Field>
            <FieldLabel className="text-sm font-normal text-[#2B2B2B] font-dm-san-regular">
              Last Name
            </FieldLabel>
            <Input
              type="text"
              {...register("lastName")}
              className={cn("h-11! px-4 rounded-[8px] border font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text focus:outline-hidden", errors.lastName ? "border-error" : "border-primary-color/30")}
            />
            <FieldError errors={[errors.lastName]} />
          </Field>
        </div>

        {/* Email Address */}
        <Field>
          <FieldLabel className="text-sm font-normal text-[#2B2B2B] font-dm-san-regular">
            Email Address
          </FieldLabel>
          <Input
            type="email"
            {...register("email")}
            className={cn("h-11! px-4 rounded-[8px] border font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text focus:outline-hidden", errors.email ? "border-error" : "border-primary-color/30")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={!isValid}
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
