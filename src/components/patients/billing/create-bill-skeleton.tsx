import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreateBillSkeleton() {
  return (
    <div className="w-full space-y-7 pb-16 animate-pulse">
      {/* Top Header */}
      <div>
        <Skeleton className="h-9 w-56 rounded-md bg-white" />
      </div>

      {/* Patient & Family Overview Cards (2 cards side-by-side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="p-5 sm:p-6 bg-white border border-zinc-200/80 rounded-2xl space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full bg-zinc-100 shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-36 rounded bg-zinc-100" />
                  <Skeleton className="h-3.5 w-24 rounded bg-zinc-100" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
              <Skeleton className="h-4 w-36 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Category Tabs (6 category pills) */}
      <div className="w-full pt-1">
        <div className="inline-flex bg-white p-1 rounded-lg border border-zinc-200/60 gap-1 shadow-2xs flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-md bg-zinc-100" />
          ))}
        </div>
      </div>

      {/* Main Layout: Left Side (Plans Cards, col-span-8) & Right Side (Payment Link Summary, col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Horizontal Plan Cards */}
        <div className="lg:col-span-8 min-w-0 max-w-full overflow-hidden">
          <div className="flex flex-nowrap gap-6 pb-4 pt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[300px] sm:w-[320px] shrink-0 p-6 flex flex-col justify-between min-h-[460px] rounded-[8px] bg-white border border-zinc-200/80 shadow-2xs"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24 rounded bg-zinc-100" />
                    <Skeleton className="h-8 w-36 rounded bg-zinc-100" />
                    <Skeleton className="h-4 w-44 rounded bg-zinc-100" />
                  </div>
                  <div className="space-y-2.5 pt-3 border-t border-zinc-100">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded bg-zinc-100 shrink-0" />
                        <Skeleton className="h-3.5 w-full rounded bg-zinc-100" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-5 mt-4 border-t border-zinc-100">
                  <Skeleton className="h-9 w-full rounded-full bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Payment Link Summary Card */}
        <div className="lg:col-span-4 min-w-0 max-w-full">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="border-b border-zinc-100 pb-3.5">
              <Skeleton className="h-6 w-48 rounded bg-zinc-100" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
                  <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
                </div>
              ))}
              <div className="pt-3.5 border-t border-zinc-100 flex justify-between items-center">
                <Skeleton className="h-5 w-20 rounded bg-zinc-100" />
                <Skeleton className="h-7 w-32 rounded bg-zinc-100" />
              </div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1.5">
              <Skeleton className="h-3 w-28 rounded bg-zinc-200/70" />
              <Skeleton className="h-4 w-36 rounded bg-zinc-100" />
              <Skeleton className="h-3 w-44 rounded bg-zinc-100" />
            </div>
            <Skeleton className="h-11 w-full rounded-full bg-zinc-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
