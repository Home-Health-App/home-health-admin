import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6 w-full pb-12 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 rounded-md bg-white" />
        <Skeleton className="h-5 w-80 max-w-full rounded-md bg-white" />
      </div>

      {/* 2-Column Vertical Tabs Layout */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        {/* Left Tabs Sidebar (w-80) */}
        <div className="flex flex-col gap-1.5 w-full md:w-80 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-[8px] bg-white" />
          ))}
        </div>

        {/* Right Workspace Form Card */}
        <Card className="flex-1 w-full border border-zinc-200/60 shadow-2xs bg-white p-8 rounded-[8px] space-y-6">
          <Skeleton className="h-6 w-44 rounded bg-zinc-100" />

          {/* Avatar Upload Placeholder */}
          <div className="flex items-center gap-4 py-2">
            <Skeleton className="size-20 rounded-full bg-zinc-100" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-32 rounded-lg bg-zinc-100" />
              <Skeleton className="h-3 w-40 rounded bg-zinc-100" />
            </div>
          </div>

          {/* Form Input Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
                <Skeleton className="h-11 w-full rounded-lg bg-zinc-100" />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <Skeleton className="h-10 w-36 rounded-full bg-zinc-100" />
          </div>
        </Card>
      </div>
    </div>
  )
}
