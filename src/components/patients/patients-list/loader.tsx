import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientLoader() {
  return (
    <div className="space-y-6 w-full pb-8">
      {/* Title & Subtitle skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 rounded-md animate-pulse bg-white" />
        <Skeleton className="h-5 w-80 rounded-md animate-pulse bg-white" />
      </div>

      {/* Control bar skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        {/* Search placeholder */}
        <Skeleton className="h-14 w-full sm:w-114 rounded-full animate-pulse bg-white" />
        
        {/* Filters and export placeholder */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8.5 w-10 rounded-md animate-pulse bg-white" />
            <Skeleton className="h-8.5 w-40 rounded-lg animate-pulse bg-white" />
          </div>
          <Skeleton className="h-8.5 w-28 rounded-full animate-pulse bg-white" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="border border-white rounded-2xl overflow-hidden shadow-2xs">
        {/* Table header bar */}
        <Skeleton className="h-12.5 w-full rounded-none bg-white animate-pulse" />
        
        {/* Table rows grid list */}
        <div className="divide-y divide-white">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 py-4 px-6 items-center"
            >
              <Skeleton className="h-5 w-3/4 rounded-md animate-pulse bg-white" />
              <Skeleton className="h-5 w-2/3 rounded-md animate-pulse bg-white" />
              <Skeleton className="h-5 w-1/2 rounded-md animate-pulse bg-white" />
              <div className="flex justify-center">
                <Skeleton className="h-6.5 w-20 rounded-full animate-pulse bg-white" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-6.5 w-20 rounded-full animate-pulse bg-white" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-5.5 w-6 rounded-md animate-pulse bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-32 animate-pulse" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.5 w-8.5 rounded-full animate-pulse bg-white" />
          <Skeleton className="h-8.5 w-24 rounded-full animate-pulse bg-white" />
          <Skeleton className="h-8.5 w-8.5 rounded-full animate-pulse bg-white" />
        </div>
      </div>
    </div>
  )
}
