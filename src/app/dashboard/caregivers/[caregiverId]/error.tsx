"use client"

import React, { useEffect } from "react"
import { IconUserOff, IconRotate } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function CaregiverErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    if ((error as any)?.response?.status !== 404) {
      console.error("Caregiver Details Error:", error)
    }
  }, [error])

  // Retrieve axios or standard error message matching backend error payload
  const backendMessage = (error as any)?.response?.data?.message || error.message || "User not found"

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-120 w-full border border-primary-light rounded-2xl bg-white p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-6 shadow-2xs font-dm-san-regular">
        {/* User Off Icon */}
        <div className="p-4 bg-warning-btn border border-warning-border rounded-full text-error">
          <IconUserOff className="size-12 opacity-80" />
        </div>

        {/* Error Headings */}
        <div className="space-y-2">
          <h3 className="font-dm-san-medium font-bold text-heading-text text-2xl">
            Caregiver Not Found
          </h3>
          <p className="text-body-text/70 font-sans text-sm max-w-sm leading-relaxed">
            {backendMessage === "User not found"
              ? "The caregiver account you are looking for does not exist or has not been onboarded yet."
              : backendMessage}
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          {/* Try Again */}
          <Button
            onClick={() => reset()}
            className="flex-1 rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:bg-secondary-light/50 h-11 cursor-pointer transition-colors shadow-none flex items-center justify-center gap-2"
          >
            <IconRotate className="size-4" />
            Try Again
          </Button>

          {/* Go Home */}
          <Link
            href="/dashboard/home"
            className="flex-1 inline-flex items-center justify-center rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs h-11 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Go Home
          </Link>
        </div>

        {/* Back link */}
        <Link
          href="/dashboard/caregivers"
          className="text-xs font-bold text-zinc-400 hover:text-body-text transition-colors mt-2"
        >
          Back to Caregivers Directory
        </Link>
      </div>
    </div>
  )
}
