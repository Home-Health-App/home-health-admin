"use client"

import React, { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [otpFocusedIndex, setOtpFocusedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Email validation regex helper
  const isEmailValid = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  // Handle email submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEmailValid(email)) {
      setStep("otp")
    }
  }

  // Handle OTP digit input changes
  const handleOtpChange = (val: string, index: number) => {
    // Only allow single digit
    const digit = val.replace(/[^0-9]/g, "").slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-advance focus to next input if filled
    if (digit !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace navigation inside OTP fields
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Handle OTP form submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const enteredCode = otp.join("")
    if (enteredCode.length === 6) {
      setIsLoading(true)
      // Simulate API roundtrip then redirect
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard/home")
      }, 1500)
    }
  }

  // Is OTP fully filled
  const isOtpComplete = otp.every((digit) => digit !== "")

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

      {/* Main Content (Z-Index above background waves) */}
      <div className="relative z-10 w-full max-w-147.5 flex flex-col items-center gap-18 px-4">
        
        {/* LOGO */}
        <h1 className="text-2xl font-bold font-sans tracking-[0.2em] text-[#0A101D] uppercase">
          Logo
        </h1>

        {/* Card Body */}
        <div className="w-full bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs">
          
          {step === "email" ? (
            /* STEP 1: WELCOME BACK (EMAIL ENTRY) */
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-bold font-sans text-zinc-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-zinc-500 font-sans">
                  Login to your admin portal
                </p>
              </div>

              {/* Email Input Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 font-sans block">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="janedoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full h-11 px-3 rounded-[8px] border border-[#D6D6D6] font-dm-san-regular text-sm focus-visible:ring-0 outline-hidden transition-all placeholder:text-zinc-400 bg-secondary-light ${
                    emailFocused
                      ? "border-[#D6D6D6] text-[#080807]"
                      : "border-zinc-200 text-[#6F6F6F]"
                  }`}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isEmailValid(email)}
                className={`w-full h-11 rounded-full font-dm-san-regular font-semibold tracking-wide text-sm transition-all border-none outline-hidden cursor-pointer shadow-none ${
                  isEmailValid(email)
                    ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
                    : "bg-primary-light text-[#080807] pointer-events-none"
                }`}
              >
                Get Code
              </Button>
            </form>
          ) : (
            /* STEP 2: ENTER CODE (OTP ENTRY) */
            <form onSubmit={handleOtpSubmit} className="flex flex-col  items-center space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-sans text-zinc-900 tracking-tight">
                  Enter Code
                </h2>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed max-w-[320px] mx-auto">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-zinc-700">{email}</span>.
                  Enter the code below to log in.
                </p>
              </div>

              {/* 6 OTP Input Boxes */}
              <div className="flex justify-between items-center gap-2 py-2 w-75">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onFocus={() => setOtpFocusedIndex(i)}
                    onBlur={() => setOtpFocusedIndex(null)}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className={`w-12 h-12 rounded-[8px] text-center font-sans font-semibold text-base border focus-visible:ring-0 outline-hidden transition-all bg-zinc-50/50 ${
                      otpFocusedIndex === i
                        ? "border-[#0B1E3F] text-zinc-900 shadow-2xs"
                        : "border-zinc-200 text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Resend Code Option */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    // Reset OTP entries and go back
                    setOtp(Array(6).fill(""))
                    otpRefs.current[0]?.focus()
                  }}
                  className="text-sm font-semibold text-primary-color hover:underline cursor-pointer font-dm-san-regular"
                >
                  Resend Code
                </button>
              </div>

              {/* Log In Button */}
              <Button
                type="submit"
                disabled={!isOtpComplete || isLoading}
                className={`w-full h-11 rounded-full font-sans font-semibold text-sm transition-all border-none outline-hidden cursor-pointer shadow-none flex items-center justify-center gap-2 ${
                  isOtpComplete
                    ? "bg-[#0B1E3F] hover:bg-[#1B335B] text-white"
                    : "bg-[#D1E0F3] text-[#7A98C2] opacity-70 pointer-events-none"
                }`}
              >
                {isLoading ? (
                  <div className="size-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}