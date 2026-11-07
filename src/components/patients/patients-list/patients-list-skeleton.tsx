import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientsListSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-48 rounded-md bg-white" />
        <Skeleton className="h-5 w-80 max-w-full rounded-md bg-white" />
      </div>

      {/* Control bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        {/* Search placeholder */}
        <Skeleton className="h-14 w-full sm:w-110 rounded-full bg-white" />

        {/* Filters and export placeholder */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <Skeleton className="h-9.5 w-32 rounded-lg bg-white" />
          <Skeleton className="h-9.5 w-36 rounded-lg bg-white" />
          <Skeleton className="h-9.5 w-28 rounded-full bg-white" />
        </div>
      </div>

      {/* Table skeleton (6 columns: Patient Name, Family Member, Caregiver, Subscription, Status, Action) */}
      <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white">
        {/* Table header bar */}
        <div className="h-12 border-b border-zinc-100 bg-zinc-50 px-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center">
          <Skeleton className="h-4 w-28 rounded bg-zinc-200/70" />
          <Skeleton className="h-4 w-28 rounded bg-zinc-200/70 hidden sm:block" />
          <Skeleton className="h-4 w-28 rounded bg-zinc-200/70 hidden md:block" />
          <div className="hidden md:flex justify-center">
            <Skeleton className="h-4 w-24 rounded bg-zinc-200/70" />
          </div>
          <div className="hidden sm:flex justify-center">
            <Skeleton className="h-4 w-20 rounded bg-zinc-200/70" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-4 w-12 rounded bg-zinc-200/70" />
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 py-4 px-6 items-center"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
              </div>
              <div className="hidden sm:flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-full bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
              </div>
              <div className="hidden md:flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-full bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
              </div>
              <div className="hidden md:flex justify-center">
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
              </div>
              <div className="hidden sm:flex justify-center">
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="size-8 rounded-md bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
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
