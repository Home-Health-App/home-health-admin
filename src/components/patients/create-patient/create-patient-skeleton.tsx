import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function CreatePatientSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto pb-24 space-y-6 animate-pulse">
      {/* Title */}
      <div className="mb-6">
        <Skeleton className="h-9 w-48 rounded-md bg-white" />
      </div>

      {/* Stepper Progress Bar (3 steps matching PatientStepper) */}
      <div className="flex items-center justify-center gap-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full bg-white shrink-0" />
            <Skeleton className="h-4 w-28 rounded bg-white hidden sm:block" />
            {i < 2 && <Skeleton className="h-0.5 w-16 bg-white hidden md:block" />}
          </div>
        ))}
      </div>

      {/* Step 1 Form Card Container */}
      <Card className="border border-zinc-100 shadow-2xs bg-white p-6 sm:p-8 rounded-[8px] space-y-8">
        {/* Centered Profile Picture Upload Circle */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="size-24 rounded-full bg-zinc-100" />
          <Skeleton className="h-3.5 w-32 rounded bg-zinc-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
              <Skeleton className="h-12 w-full rounded-lg bg-zinc-100" />
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center pt-6 border-t border-zinc-100">
          <Skeleton className="h-11 w-36 rounded-full bg-zinc-100" />
        </div>
      </Card>
    </div>
  )
}
