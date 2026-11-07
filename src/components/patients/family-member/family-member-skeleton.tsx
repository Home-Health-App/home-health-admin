import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function FamilyMemberSkeleton() {
  return (
    <div className="w-full space-y-8 pb-12 animate-pulse">
      {/* Header Profile Section with Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56 rounded-md bg-white" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-40 rounded bg-white" />
            <Skeleton className="h-4 w-32 rounded bg-white" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-10 w-36 rounded-full bg-white" />
          <Skeleton className="h-10 w-32 rounded-full bg-white" />
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 flex flex-col gap-4 bg-white border border-zinc-100 rounded-[8px] shadow-2xs"
          >
            <Skeleton className="h-4 w-36 rounded bg-zinc-100" />
            <Skeleton className="h-7 w-20 rounded bg-zinc-100" />
          </div>
        ))}
      </div>

      {/* Main Content Area (lg:col-span-2 Table & Timeline + lg:col-span-1 Contact Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-8">
          {/* Linked Patients Table */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40 rounded bg-white" />
            <div className="border border-zinc-200/60 rounded-2xl overflow-hidden bg-white">
              <div className="h-12 border-b border-zinc-100 bg-zinc-50 px-6 grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-24 rounded bg-zinc-200/70" />
                <Skeleton className="h-4 w-20 rounded bg-zinc-200/70" />
                <Skeleton className="h-4 w-24 rounded bg-zinc-200/70" />
                <Skeleton className="h-4 w-20 rounded bg-zinc-200/70" />
              </div>
              <div className="divide-y divide-zinc-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="py-4 px-6 grid grid-cols-4 gap-4 items-center">
                    <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
                    <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
                    <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
                    <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
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

        {/* Right Side: Contact Details */}
        <div className="space-y-6 bg-white border border-zinc-100 rounded-[8px] h-fit p-6">
          <Skeleton className="h-6 w-36 rounded bg-zinc-100" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <Skeleton className="size-6 rounded bg-zinc-100 shrink-0" />
                <Skeleton className="h-4 w-44 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
