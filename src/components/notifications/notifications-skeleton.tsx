import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificationCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[12px] p-6 shadow-2xs border border-zinc-200/60 space-y-3"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-56 rounded-md bg-zinc-100" />
            <Skeleton className="size-6 rounded-md bg-zinc-100" />
          </div>
          <Skeleton className="h-4 w-32 rounded-md bg-zinc-100" />
          <Skeleton className="h-4 w-full rounded-md bg-zinc-100" />
          <Skeleton className="h-4 w-3/4 rounded-md bg-zinc-100" />
        </div>
      ))}
    </div>
  )
}

export default function NotificationsSkeleton() {
  return (
    <div className="w-full space-y-6 pb-12 animate-pulse">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-56 rounded-md bg-white" />
        <Skeleton className="h-5 w-64 max-w-full rounded-md bg-white" />
      </div>

      {/* 2-Column Layout matching NotificationsView */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column Sidebar (Vertical Tabs & Filter checkboxes) */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          {/* 2 Vertical Tab Options */}
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="h-12 w-full rounded-[8px] bg-white" />
            <Skeleton className="h-12 w-full rounded-[8px] bg-white" />
          </div>

          <div className="h-px bg-zinc-200/60 my-2" />

          {/* Filter Categories List */}
          <div className="space-y-4 px-1">
            <Skeleton className="h-5 w-44 rounded bg-white" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="size-7 rounded-[8px] bg-white shrink-0" />
                  <Skeleton className="h-4 w-32 rounded bg-white" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Contents Workspace */}
        <div className="flex-1 w-full pt-8 space-y-4">
          <NotificationCardsSkeleton count={4} />
        </div>
      </div>
    </div>
  )
}
