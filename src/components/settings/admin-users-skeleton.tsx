import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUsersSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {/* Search Bar */}
      <Skeleton className="h-14 w-full sm:w-110 rounded-full bg-zinc-100" />

      {/* Table Skeleton */}
      <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white">
        <div className="h-12 border-b border-zinc-200/60 bg-zinc-50 px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-32 rounded bg-zinc-100 hidden sm:block" />
          <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-12 rounded bg-zinc-100" />
        </div>

        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 items-center"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
              </div>
              <Skeleton className="h-4 w-36 rounded bg-zinc-100 hidden sm:block" />
              <div className="flex justify-center">
                <Skeleton className="h-6 w-24 rounded-full bg-zinc-100" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="size-8 rounded-md bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
