"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { useLoginAdmin, useVerifyOtpAdmin } from "@/hooks/auth.hook"
import { useForm } from "@/hooks/use-form"
import { loginSchema, verifyOtpSchema } from "@/schemas/auth.schema"
import { useSetAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { Controller } from "react-hook-form"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useSetAtom(authAtom)
  const [step, setStep] = useState<"email" | "otp">("email")

  const loginMutation = useLoginAdmin()
  const otpMutation = useVerifyOtpAdmin()

  // Focus states for input styling
  const [emailFocused, setEmailFocused] = useState(false)

  // Hooks for form management
  const emailForm = useForm({
    schema: loginSchema,
    defaultValues: { email: "" },
  })

  const otpForm = useForm({
    schema: verifyOtpSchema,
    defaultValues: { email: "", code: "" },
  })

  // Handle email submit
  const handleEmailSubmit = emailForm.handleSubmit((values) => {
    loginMutation.mutate(
      { email: values.email },
      {
        onSuccess: () => {
          otpForm.setValue("email", values.email)
          setStep("otp")
        },
      }
    )
  })

  // Handle OTP form submission
  const handleOtpSubmit = otpForm.handleSubmit((values) => {
    otpMutation.mutate(
      { email: values.email, code: values.code },
      {
        onSuccess: (res) => {
          if (res.data) {
            setAuth(res.data)
            if (res.data.access_token) {
              localStorage.setItem("access_token", res.data.access_token)
            }
          }
          router.push("/dashboard/home")
        },
      }
    )
  })

  const enteredEmail = otpForm.getValues("email")

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#F1F4F9] overflow-hidden select-none">

      {/* Background Stylized Waves */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img
          src="/auth-bg.png"
          alt=""
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-147.5 flex flex-col items-center gap-18 px-4">

        {/* LOGO */}
        <h1 className="text-2xl font-bold tracking-[0.2em] text-[#0A101D] uppercase font-dm-san-regular">
          Logo
        </h1>

        {/* Card Body */}
        <Card className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs font-dm-san-regular">

          {step === "email" ? (
            /* STEP 1: WELCOME BACK (EMAIL ENTRY) */
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <CardHeader className="text-center space-y-2 mb-6 p-0">
                <CardTitle className="text-2xl font-bold tracking-tight text-body-text font-dm-san-regular">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 font-dm-san-regular font-normal">
                  Login to your admin portal
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-6">
                {/* Email Input Field */}
                <Field>
                  <FieldLabel className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                    Email
                  </FieldLabel>
                  <Input
                    type="email"
                    placeholder="janedoe@gmail.com"
                    disabled={loginMutation.isPending}
                    {...emailForm.register("email")}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className={`w-full !h-12 px-3 rounded-[8px] border font-dm-san-regular text-sm focus-visible:ring-0 outline-hidden transition-all placeholder:text-zinc-400 bg-secondary-light ${
                      emailForm.formState.errors.email
                        ? "border-error text-body-text"
                        : emailFocused
                        ? "border-primary-color text-body-text"
                        : "border-zinc-200 text-body-text"
                    }`}
                  />
                  <FieldError errors={[emailForm.formState.errors.email]} />
                  {loginMutation.error && !emailForm.formState.errors.email && (
                    <p className="text-xs text-red-500 font-dm-san-regular mt-1.5">
                      {loginMutation.error.response?.data?.message || loginMutation.error.message || "Failed to send verification code."}
                    </p>
                  )}
                </Field>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!emailForm.formState.isValid || loginMutation.isPending}
                  className={`w-full !h-12 rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${
                    emailForm.formState.isValid && !loginMutation.isPending
                      ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
                      : "bg-primary-light text-body-text pointer-events-none"
                  }`}
                >
                  {loginMutation.isPending ? (
                    <div className="size-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Get Code"
                  )}
                </Button>
              </CardContent>
            </form>
          ) : (
            /* STEP 2: ENTER CODE (OTP ENTRY) */
            <form onSubmit={handleOtpSubmit} className="flex flex-col items-center space-y-6">
              <CardHeader className="flex w-full flex-col items-center space-y-2 p-0 text-center">
                <CardTitle className="font-dm-san-regular text-2xl font-bold leading-tight tracking-tight text-body-text">
                  Enter Code
                </CardTitle>

                <CardDescription className="max-w-[320px] font-dm-san-regular text-xs font-normal leading-5 text-zinc-500">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-zinc-700">
                    {enteredEmail}
                  </span>
                  . Enter the code below to log in.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 w-full flex flex-col items-center space-y-6">
                {/* 6 OTP Input Boxes */}
                <Field className="flex flex-col items-center justify-center py-2 gap-2">
                  <Controller
                    name="code"
                    control={otpForm.control}
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={otpMutation.isPending}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                          <InputOTPSlot index={1} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                          <InputOTPSlot index={2} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                          <InputOTPSlot index={3} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                          <InputOTPSlot index={4} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                          <InputOTPSlot index={5} className="w-12 !h-12 border border-primary-color rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-primary-color data-[active=true]:ring-0" />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                  <FieldError errors={[otpForm.formState.errors.code]} />
                </Field>

                {otpMutation.error && (
                  <p className="text-xs text-red-500 font-dm-san-regular text-center">
                    {otpMutation.error.response?.data?.message || otpMutation.error.message || "Invalid verification code."}
                  </p>
                )}

                {/* Resend Code Option */}
                <div className="text-center">
                  <button
                    type="button"
                    disabled={otpMutation.isPending}
                    onClick={() => {
                      otpForm.reset()
                      setStep("email")
                    }}
                    className="text-sm font-semibold text-primary-color hover:underline cursor-pointer font-dm-san-regular disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>

                {/* Log In Button */}
                <Button
                  type="submit"
                  disabled={!otpForm.formState.isValid || otpMutation.isPending}
                  className={`w-full !h-12 rounded-full font-dm-san-regular font-semibold text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${
                    otpForm.formState.isValid && !otpMutation.isPending
                      ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
                      : "bg-[#D1E0F3] text-[#7A98C2] opacity-70 pointer-events-none"
                  }`}
                >
                  {otpMutation.isPending ? (
                    <div className="size-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </Button>
              </CardContent>
            </form>
          )}

        </Card>

      </div>
    </div>
  )
}