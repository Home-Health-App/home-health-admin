import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function PlansListSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Header and Add Plan Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
          <Skeleton className="h-9 w-52 rounded-md bg-zinc-100" />
          <Skeleton className="h-5 w-72 max-w-full rounded-md bg-zinc-100" />
        </div>
        <Skeleton className="h-9.5 w-36 rounded-full bg-zinc-100" />
      </div>

      {/* Grid of 3 Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-28 rounded bg-zinc-100" />
                <Skeleton className="h-6 w-16 rounded-full bg-zinc-100" />
              </div>
              <Skeleton className="h-8 w-32 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-full rounded bg-zinc-100" />
              <div className="space-y-2 pt-2 border-t border-zinc-100">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded-full bg-zinc-100 shrink-0" />
                    <Skeleton className="h-3.5 w-48 rounded bg-zinc-100" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
              <Skeleton className="h-9 flex-1 rounded-full bg-zinc-100" />
              <Skeleton className="h-9 w-20 rounded-full bg-zinc-100" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
