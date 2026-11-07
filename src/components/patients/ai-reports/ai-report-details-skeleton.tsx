import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function AiReportDetailsSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Header with Back, Title & Download button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
          <Skeleton className="h-8 w-64 rounded-md bg-zinc-100" />
          <Skeleton className="h-4 w-40 rounded bg-zinc-100" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full bg-zinc-100" />
      </div>

      {/* Score & Key Findings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4">
          <Skeleton className="h-5 w-32 rounded bg-zinc-100" />
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <Skeleton className="size-32 rounded-full bg-zinc-100" />
            <Skeleton className="h-6 w-24 rounded-full bg-zinc-100" />
          </div>
        </Card>

        <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] lg:col-span-2 space-y-4">
          <Skeleton className="h-5 w-40 rounded bg-zinc-100" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-zinc-50 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-full rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Adherence & Vital Trends Card */}
      <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-48 rounded bg-zinc-100" />
          <Skeleton className="h-8 w-24 rounded-lg bg-zinc-100" />
        </div>
        <div className="h-64 flex items-end gap-6 pt-6 px-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                className="w-full rounded-t-md bg-zinc-100"
                style={{ height: `${35 + ((i * 19) % 55)}%` }}
              />
              <Skeleton className="h-3 w-8 rounded-sm bg-zinc-100" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
