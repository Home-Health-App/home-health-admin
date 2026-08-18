import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loader() {
  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Title & Subtitle skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 rounded-md bg-white" />
        <Skeleton className="h-5 w-80 rounded-md bg-white" />
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl bg-white" />
        ))}
      </div>

      {/* Middle Grid: Patient Growth & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Growth (Chart Area) */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-96 w-full rounded-xl bg-white" />
        </div>

        {/* Quick Actions Card */}
        <div className="space-y-4">
          <Skeleton className="h-96 w-full rounded-xl bg-white" />
        </div>
      </div>

      {/* Bottom Grid: Revenue Overview & Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview */}
        <div className="space-y-4">
          <Skeleton className="h-112.5 w-full rounded-xl bg-white" />
        </div>

        {/* Recent Notifications */}
        <div className="space-y-4">
          <Skeleton className="h-112.5 w-full rounded-xl bg-white" />
        </div>
      </div>
    </div>
  )
}
