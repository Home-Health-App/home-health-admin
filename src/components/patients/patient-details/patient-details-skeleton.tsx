import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientDetailsSkeleton() {
  return (
    <div className="w-full space-y-8 pb-12 animate-pulse">
      {/* Top Header Section (Name + Badges on left, 2 Action Buttons on right) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-56 rounded-md bg-white" />
            <Skeleton className="h-6 w-20 rounded-full bg-white" />
            <Skeleton className="h-6 w-24 rounded-full bg-white" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-36 rounded bg-white" />
            <Skeleton className="h-4 w-20 rounded bg-white" />
            <Skeleton className="h-4 w-28 rounded bg-white" />
            <Skeleton className="h-4 w-24 rounded bg-white" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-full bg-white" />
          <Skeleton className="h-10 w-36 rounded-full bg-white" />
        </div>
      </div>

      {/* Action Shortcut Cards (Daily Logs & AI Reports) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-[8px] shadow-2xs"
          >
            <div className="space-y-2.5">
              <Skeleton className="h-7 w-36 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-60 rounded bg-zinc-100" />
            </div>
            <Skeleton className="size-6 rounded bg-zinc-100 shrink-0" />
          </div>
        ))}
      </div>

      {/* Main Grid: Left Info Card (col-span-2) and Right Sidebar (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Single white container card matching PatientDetailsView) */}
        <div className="lg:col-span-2 space-y-8 p-6 rounded-[8px] bg-white border border-zinc-100">
          {/* Medical Information */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 rounded bg-zinc-100 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
                  <Skeleton className="h-6 w-32 rounded-full bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Current Medications */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 rounded bg-zinc-100" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100 rounded-[8px]"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36 rounded bg-zinc-200/70" />
                    <Skeleton className="h-3 w-24 rounded bg-zinc-100" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-zinc-200/70" />
                </div>
              ))}
            </div>
          </div>

          {/* Special Care Instructions */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-48 rounded bg-zinc-100" />
            <div className="p-5 rounded-[8px] bg-zinc-50 border border-zinc-100 space-y-2.5">
              <Skeleton className="h-4 w-full rounded bg-zinc-100" />
              <Skeleton className="h-4 w-5/6 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-2/3 rounded bg-zinc-100" />
            </div>
          </div>
        </div>

        {/* Right Sidebar (3 separate white cards: Contact Details, Family Members, Assigned Care Giver) */}
        <div className="space-y-8">
          {/* Contact Details */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white border border-zinc-100">
            <Skeleton className="h-6 w-36 rounded bg-zinc-100 mb-2" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5">
                  <Skeleton className="size-6 rounded bg-zinc-100 shrink-0" />
                  <Skeleton className="h-4 w-44 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Family Members */}
          <div className="space-y-4 p-6 bg-white rounded-[8px] border border-zinc-100">
            <Skeleton className="h-6 w-36 rounded bg-zinc-100 mb-2" />
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-40 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-24 rounded bg-zinc-100" />
              </div>
              <Skeleton className="h-9 w-28 rounded-full bg-zinc-100 shrink-0" />
            </div>
          </div>

          {/* Assigned Care Giver */}
          <div className="space-y-4 p-6 rounded-[8px] bg-white border border-zinc-100">
            <Skeleton className="h-6 w-44 rounded bg-zinc-100 mb-2" />
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-full bg-zinc-100 shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
                  <Skeleton className="h-3 w-40 rounded bg-zinc-100" />
                </div>
              </div>
              <div className="flex w-full gap-2">
                <Skeleton className="h-9 flex-1 rounded-full bg-zinc-100" />
                <Skeleton className="h-9 flex-1 rounded-full bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
