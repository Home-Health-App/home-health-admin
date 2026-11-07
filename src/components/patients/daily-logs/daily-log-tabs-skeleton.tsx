import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DailyLogTabsSkeleton() {
  return (
    <div className="w-full space-y-6 pb-12 animate-pulse">
      {/* Top Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-44 rounded-md bg-white" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-4 w-32 rounded bg-white" />
          <Skeleton className="h-4 w-36 rounded bg-white" />
          <Skeleton className="h-4 w-20 rounded bg-white" />
        </div>
      </div>

      {/* 8-Tab Triggers Bar inside White Pill */}
      <div className="p-1.5 bg-white inline-flex flex-wrap items-center gap-2 rounded-[8px] border border-zinc-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-9 w-24 rounded-[6px] bg-zinc-100 shrink-0"
          />
        ))}
      </div>

      {/* Outer Card Container matching DailyLogTabsView */}
      <div className="bg-white border border-zinc-200/60 rounded-[8px] p-6 shadow-2xs space-y-6">
        {/* Card Sub-header: Date and Recorded By */}
        <div className="flex justify-between items-center pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded bg-zinc-100" />
            <Skeleton className="h-6 w-36 rounded bg-zinc-100" />
          </div>
          <Skeleton className="h-5 w-44 rounded bg-zinc-100" />
        </div>

        {/* Columns Grid Layout (md:col-span-1 Time Selector + md:col-span-3 Tab Content) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Left Side: Time logs Selector */}
          <div className="md:col-span-1 border border-zinc-200/60 rounded-[8px] p-2 flex flex-col gap-1.5 bg-white">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full flex items-center gap-3.5 px-4.5 py-3 rounded-[8px] bg-zinc-50 border border-zinc-100"
              >
                <Skeleton className="size-6 rounded-full bg-zinc-200/70 shrink-0" />
                <Skeleton className="h-4 w-20 rounded bg-zinc-200/70" />
              </div>
            ))}
          </div>

          {/* Right Side: Tab Contents Panel (Vitals Grid) */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-[8px] bg-zinc-50 border border-zinc-100 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28 rounded bg-zinc-200/70" />
                  <Skeleton className="size-5 rounded bg-zinc-200/70" />
                </div>
                <Skeleton className="h-7 w-24 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-20 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
