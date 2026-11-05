import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CaregiverDetailsSkeleton() {
  return (
    <div className="w-full space-y-8 pb-12 animate-pulse">
      {/* Header Title ("Caregiver Information") */}
      <div>
        <Skeleton className="h-9 w-64 rounded-md bg-white" />
      </div>

      {/* Main Grid: Left Column (lg:col-span-2) and Right Sidebar (lg:col-span-1) matching CaregiverDetailsView */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Grid span 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Card 1: Profile Header Box + Assigned Patients */}
          <div className="bg-white border border-zinc-100 p-6 rounded-[8px] space-y-6">
            {/* Profile Header Box */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-30 rounded-full bg-zinc-100 shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-44 rounded bg-zinc-100" />
                  <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-9 w-32 rounded-full bg-zinc-100" />
                <Skeleton className="h-9 w-32 rounded-full bg-zinc-100" />
              </div>
            </div>

            {/* Assigned Patients */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-36 rounded bg-zinc-100" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-5 bg-zinc-50 border border-zinc-100 rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-36 rounded bg-zinc-200/70" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
                        <Skeleton className="h-4 w-16 rounded bg-zinc-100" />
                        <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <Skeleton className="h-8.5 w-28 rounded-full bg-white border border-zinc-200" />
                      <Skeleton className="h-8.5 w-24 rounded-full bg-white border border-zinc-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Activity Timeline */}
          <div className="space-y-6 bg-white border border-zinc-100 p-6 rounded-[8px]">
            <Skeleton className="h-6 w-44 rounded bg-zinc-100" />
            <div className="space-y-6 pl-3.5 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="size-3.5 rounded-full bg-zinc-200 shrink-0 mt-1" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center gap-4">
                      <Skeleton className="h-4 w-40 rounded bg-zinc-100" />
                      <Skeleton className="h-3 w-28 rounded bg-zinc-100" />
                    </div>
                    <Skeleton className="h-3.5 w-2/3 rounded bg-zinc-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Grid span 1): Contact Details */}
        <div className="space-y-6">
          <div className="space-y-4 bg-white border border-zinc-100 rounded-[8px] h-fit p-6">
            <Skeleton className="h-6 w-36 rounded bg-zinc-100 mb-2" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <Skeleton className="size-6 rounded bg-zinc-100 shrink-0" />
                  <Skeleton className="h-4 w-44 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
