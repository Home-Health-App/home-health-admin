import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function BillingTableSkeleton() {
  return (
    <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white animate-pulse">
      <div className="h-12 border-b border-zinc-200/60 bg-zinc-50 px-6 flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
        <Skeleton className="h-4 w-24 rounded bg-zinc-100 hidden sm:block" />
        <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
        <Skeleton className="h-4 w-24 rounded bg-zinc-100 hidden md:block" />
        <Skeleton className="h-4 w-12 rounded bg-zinc-100" />
      </div>

      <div className="divide-y divide-zinc-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4 px-6 items-center"
          >
            <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
            <Skeleton className="h-4 w-28 rounded bg-zinc-100 hidden sm:block" />
            <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
            <div className="flex justify-center hidden md:flex">
              <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="size-8 rounded-md bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BillingOverviewSkeleton() {
  return (
    <div className="space-y-6 w-full pb-8 animate-pulse">
      {/* Header and Manage Plans Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-56 rounded-md bg-zinc-100" />
          <Skeleton className="h-5 w-80 max-w-full rounded-md bg-zinc-100 mt-2" />
        </div>
        <Skeleton className="h-9.5 w-52 rounded-full bg-zinc-100" />
      </div>

      {/* 2 Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Revenue Card */}
        <Card className="border-none shadow-2xs bg-white border border-zinc-100 rounded-[8px] p-6 space-y-2.5 min-h-32 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24 rounded bg-zinc-100" />
            <Skeleton className="h-8 w-24 rounded-lg bg-zinc-100" />
          </div>
          <Skeleton className="h-8 w-32 rounded bg-zinc-100" />
        </Card>

        {/* Billing Health Card */}
        <Card className="border-none shadow-2xs bg-white border border-zinc-100 rounded-[8px] p-6 space-y-2.5 min-h-32 flex flex-col justify-between">
          <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
          <div className="grid grid-cols-3 gap-4 pt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-6 w-16 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-20 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <Skeleton className="h-14 w-full lg:w-110 rounded-full bg-zinc-100" />
        <div className="flex items-center gap-2.5 flex-wrap">
          <Skeleton className="h-9.5 w-24 rounded-lg bg-zinc-100" />
          <Skeleton className="h-9.5 w-28 rounded-lg bg-zinc-100" />
          <Skeleton className="h-9.5 w-24 rounded-lg bg-zinc-100" />
        </div>
      </div>

      {/* Payments Records Table */}
      <div className="border border-zinc-200/60 rounded-2xl overflow-hidden shadow-2xs bg-white">
        <div className="h-12 border-b border-zinc-200/60 bg-zinc-50 px-6 flex items-center justify-between">
          <Skeleton className="h-4 w-28 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-24 rounded bg-zinc-100 hidden sm:block" />
          <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
          <Skeleton className="h-4 w-24 rounded bg-zinc-100 hidden md:block" />
          <Skeleton className="h-4 w-12 rounded bg-zinc-100" />
        </div>

        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 py-4 px-6 items-center"
            >
              <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
              <Skeleton className="h-4 w-28 rounded bg-zinc-100 hidden sm:block" />
              <Skeleton className="h-4 w-20 rounded bg-zinc-100" />
              <div className="flex justify-center hidden md:flex">
                <Skeleton className="h-6 w-20 rounded-full bg-zinc-100" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="size-8 rounded-md bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full bg-zinc-100" />
          <Skeleton className="h-8 w-20 rounded-full bg-zinc-100" />
          <Skeleton className="size-8 rounded-full bg-zinc-100" />
        </div>
      </div>
    </div>
  )
}
