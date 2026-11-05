import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function HomeSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Page Title & Subtitle */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-56 rounded-md bg-white" />
        <Skeleton className="h-5 w-72 max-w-full rounded-md bg-white" />
      </div>

      {/* KPI Metrics Cards (4 cards) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border border-zinc-100 shadow-none bg-white rounded-[8px] flex flex-col justify-between py-6 px-6"
          >
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-28 rounded-md bg-zinc-100" />
              <Skeleton className="h-8 w-20 rounded-md bg-zinc-100" />
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Layout: Patient Growth (2 cols) & Quick Actions (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Growth Card */}
        <Card className="border border-zinc-100 shadow-2xs bg-white p-6 rounded-[8px] lg:col-span-2 flex flex-col justify-between min-h-105">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-36 rounded-md bg-zinc-100" />
              <Skeleton className="h-9 w-31.25 rounded-md bg-zinc-100" />
            </div>
            {/* Area Chart Placeholder */}
            <div className="h-64 flex items-end gap-4 pt-6 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton
                    className="w-full rounded-t-md bg-zinc-100"
                    style={{ height: `${30 + ((i * 17) % 55)}%` }}
                  />
                  <Skeleton className="h-3 w-8 rounded-sm bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions Card (2 dashed buttons matching HomeView) */}
        <Card className="border border-zinc-100 shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-105">
          <div>
            <Skeleton className="h-6 w-32 rounded-md bg-zinc-100 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full flex items-center gap-3 pl-4 h-14.5 rounded-[8px] bg-zinc-50 border-2 border-dashed border-zinc-200"
                >
                  <Skeleton className="size-5 rounded-full bg-zinc-200/70" />
                  <Skeleton className="h-4 w-40 rounded-md bg-zinc-200/70" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Layout: Revenue Overview (1 col) & Recent Notifications (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview Card */}
        <Card className="border border-zinc-100 shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-115">
          <div>
            <Skeleton className="h-7 w-44 rounded-md bg-zinc-100 mb-6" />
            {/* Bar Chart Placeholder */}
            <div className="h-72 flex items-end gap-6 pt-6 px-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton
                    className="w-8 rounded-t-md bg-zinc-100"
                    style={{ height: `${40 + i * 15}%` }}
                  />
                  <Skeleton className="h-3 w-8 rounded-sm bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Notifications Card */}
        <Card className="border border-zinc-100 shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-115">
          <div>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-7 w-48 rounded-md bg-zinc-100" />
              <Skeleton className="h-4 w-14 rounded-md bg-zinc-100" />
            </div>
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-50 border border-zinc-100 p-4 rounded-[8px] flex justify-between items-start gap-4"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-40 rounded bg-zinc-200/70" />
                      <Skeleton className="h-5 w-20 rounded-full bg-zinc-200/70" />
                    </div>
                    <Skeleton className="h-4 w-full rounded bg-zinc-100" />
                    <Skeleton className="h-4 w-2/3 rounded bg-zinc-100" />
                  </div>
                  <Skeleton className="h-3 w-14 rounded bg-zinc-100 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
