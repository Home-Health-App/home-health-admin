import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DailyLogsListSkeleton() {
  return (
    <div className="w-full space-y-6 pb-8 flex flex-col animate-pulse">
      {/* Top Header Section */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-44 rounded-md bg-white" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-4 w-32 rounded bg-white" />
          <Skeleton className="h-4 w-36 rounded bg-white" />
          <Skeleton className="h-4 w-20 rounded bg-white" />
        </div>
      </div>

      {/* 2-Column Data Table (Date & Caregiver matching DailyLogsListView) */}
      <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white">
        <div className="h-12 border-b border-zinc-100 bg-zinc-50 px-6 grid grid-cols-2 gap-4 items-center">
          <Skeleton className="h-4 w-20 rounded bg-zinc-200/70" />
          <Skeleton className="h-4 w-28 rounded bg-zinc-200/70" />
        </div>

        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-4 py-4 px-6 items-center"
            >
              <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-40 rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-32 rounded bg-white" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8.5 rounded-full bg-white" />
          <Skeleton className="h-8.5 w-24 rounded-full bg-white" />
          <Skeleton className="size-8.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  )
}
