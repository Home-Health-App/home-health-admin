import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function AiReportsListSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Header & Back Button */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
        <Skeleton className="h-9 w-44 rounded-md bg-zinc-100" />
        <Skeleton className="h-5 w-80 max-w-full rounded-md bg-zinc-100" />
      </div>

      {/* Grid of AI Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="border-none shadow-2xs bg-white p-6 rounded-[8px] space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32 rounded bg-zinc-100" />
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
              </div>
              <Skeleton className="h-4 w-44 rounded bg-zinc-100" />
              <div className="p-3 rounded-lg bg-zinc-50 space-y-2">
                <Skeleton className="h-3 w-28 rounded bg-zinc-100" />
                <Skeleton className="h-4 w-full rounded bg-zinc-100" />
              </div>
            </div>
            <Skeleton className="h-9.5 w-full rounded-full bg-zinc-100" />
          </Card>
        ))}
      </div>
    </div>
  )
}
