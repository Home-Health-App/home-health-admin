import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function AuditLogsTableSkeleton() {
  return (
    <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white animate-pulse">
      <div className="h-12 border-b border-zinc-200/60 bg-zinc-50 px-6 flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
        <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
        <Skeleton className="h-4 w-36 rounded bg-zinc-100 hidden sm:block" />
        <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
      </div>

      <div className="divide-y divide-zinc-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 items-center"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full bg-zinc-100 shrink-0" />
              <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
            </div>
            <div>
              <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
            </div>
            <Skeleton className="h-4 w-48 rounded bg-zinc-100 hidden sm:block" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuditLogsSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-40 rounded-md bg-zinc-100" />
        <Skeleton className="h-5 w-80 max-w-full rounded-md bg-zinc-100" />
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Skeleton className="h-14 w-full md:w-110 rounded-full bg-zinc-100" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9.5 w-28 rounded-lg bg-zinc-100" />
          <Skeleton className="h-9.5 w-36 rounded-lg bg-zinc-100" />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white">
        <div className="h-12 border-b border-zinc-200/60 bg-zinc-50 px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-36 rounded bg-zinc-100 hidden sm:block" />
          <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
        </div>

        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 items-center"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
              </div>
              <div>
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
              </div>
              <Skeleton className="h-4 w-48 rounded bg-zinc-100 hidden sm:block" />
              <div className="flex justify-end">
                <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full bg-zinc-100" />
          <Skeleton className="h-8 w-20 rounded-full bg-zinc-100" />
          <Skeleton className="size-8 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  )
}
