"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useLoginAdmin, useVerifyOtpAdmin } from "@/hooks/auth.hook"
import { useSetAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useSetAtom(authAtom)
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [otp, setOtp] = useState("")

  const loginMutation = useLoginAdmin()
  const otpMutation = useVerifyOtpAdmin()

  // Email validation regex helper
  const isEmailValid = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  // Handle email submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEmailValid(email)) {
      loginMutation.mutate(
        { email },
        {
          onSuccess: () => {
            setStep("otp")
          },
        }
      )
    }
  }

  // Handle OTP form submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      otpMutation.mutate(
        { email, code: otp },
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
    }
  }

  // Is OTP fully filled
  const isOtpComplete = otp.length === 6

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#F1F4F9] overflow-hidden select-none">

      {/* Background Stylized Waves (Matching Image Mockup Curves) */}
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
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 font-dm-san-regular block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="janedoe@gmail.com"
                    value={email}
                    disabled={loginMutation.isPending}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className={`w-full h-11 px-3 rounded-[8px] border border-[#D6D6D6] font-dm-san-regular text-sm focus-visible:ring-0 outline-hidden transition-all placeholder:text-zinc-400 bg-secondary-light ${emailFocused
                        ? "border-[#D6D6D6] text-body-text"
                        : "border-zinc-200 text-body-text"
                      }`}
                  />
                  {loginMutation.error && (
                    <p className="text-xs text-red-500 font-dm-san-regular mt-1.5">
                      {loginMutation.error.response?.data?.message || loginMutation.error.message || "Failed to send verification code."}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isEmailValid(email) || loginMutation.isPending}
                  className={`w-full h-11 rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${isEmailValid(email) && !loginMutation.isPending
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
                    {email}
                  </span>
                  . Enter the code below to log in.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 w-full flex flex-col items-center space-y-6">
                {/* 6 OTP Input Boxes using shadcn InputOTP */}
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => setOtp(val)}
                    disabled={otpMutation.isPending}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                      <InputOTPSlot index={1} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                      <InputOTPSlot index={2} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                      <InputOTPSlot index={3} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                      <InputOTPSlot index={4} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                      <InputOTPSlot index={5} className="w-11 h-11 border border-zinc-200 rounded-lg! border-l! border-r! border-t! border-b! bg-secondary-light font-dm-san-regular font-semibold text-base text-body-text data-[active=true]:border-[#0B1E3F] data-[active=true]:ring-0" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

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
                      setOtp("")
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
                  disabled={!isOtpComplete || otpMutation.isPending}
                  className={`w-full h-11 rounded-full font-dm-san-regular font-semibold text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${isOtpComplete && !otpMutation.isPending
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