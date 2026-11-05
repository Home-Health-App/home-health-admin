import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function BillingDetailSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Back button and title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
        <Skeleton className="h-8 w-60 rounded-md bg-zinc-100" />
      </div>

      {/* 2 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4">
          <Skeleton className="h-5 w-36 rounded bg-zinc-100" />
          <div className="space-y-2.5 pt-1">
            <Skeleton className="h-4 w-48 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-36 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-52 rounded bg-zinc-100" />
          </div>
        </Card>

        <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4">
          <Skeleton className="h-5 w-44 rounded bg-zinc-100" />
          <div className="space-y-2.5 pt-1">
            <Skeleton className="h-7 w-28 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-40 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
          </div>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4">
        <Skeleton className="h-5 w-36 rounded bg-zinc-100" />
        <div className="border border-zinc-200/60 rounded-xl overflow-hidden">
          <div className="h-11 border-b border-zinc-200/60 bg-zinc-50 px-4 flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-16 rounded bg-zinc-100" />
          </div>
          <div className="divide-y divide-zinc-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-3 px-4 flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
                <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
                <Skeleton className="size-8 rounded-md bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
