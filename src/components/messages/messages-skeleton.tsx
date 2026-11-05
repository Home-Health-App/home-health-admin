import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesSkeleton() {
  return (
    <div className="flex h-[calc(100vh-9.5rem)] w-full flex-1 p-0 pb-10 animate-pulse">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[8px]">
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[360px_minmax(0,1fr)] gap-4">
          {/* LEFT PANEL — Conversations Sidebar */}
          <aside className="flex min-h-0 flex-col">
            {/* Inbox Title + New Message Button */}
            <div className="flex shrink-0 items-center justify-between px-6 py-6">
              <Skeleton className="h-9 w-28 rounded-md bg-white" />
              <Skeleton className="h-9.5 w-32 rounded-full bg-white" />
            </div>

            {/* Search Input bar */}
            <div className="px-5">
              <Skeleton className="h-10.5 w-full rounded-full bg-white" />
            </div>

            {/* Read / Unread Tabs */}
            <div className="px-5 pt-4 pb-3">
              <div className="bg-white p-1 h-9 rounded-lg flex w-fit gap-1">
                <Skeleton className="h-7 w-16 rounded-md bg-zinc-100" />
                <Skeleton className="h-7 w-24 rounded-md bg-zinc-100" />
              </div>
            </div>

            {/* Scrollable Conversation Cards List */}
            <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full p-4 rounded-[8px] border border-zinc-200/80 bg-white space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <Skeleton className="h-4 w-32 rounded bg-zinc-100" />
                    <Skeleton className="h-3 w-12 rounded bg-zinc-100" />
                  </div>
                  <Skeleton className="h-3.5 w-48 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT PANEL — Active Chat Area */}
          <div className="hidden md:flex flex-1 flex-col justify-between bg-white rounded-[8px] border border-zinc-200/60 overflow-hidden">
            {/* Chat Header */}
            <div className="h-16 border-b border-zinc-100 px-6 flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-36 rounded bg-zinc-100" />
                <Skeleton className="h-3 w-24 rounded bg-zinc-100" />
              </div>
              <Skeleton className="size-8 rounded-md bg-zinc-100" />
            </div>

            {/* Message Thread Bubbles */}
            <div className="flex-1 p-6 space-y-4 overflow-hidden">
              <div className="flex items-start gap-2 max-w-md">
                <div className="space-y-1">
                  <Skeleton className="h-12 w-64 rounded-2xl rounded-tl-sm bg-zinc-100" />
                  <Skeleton className="h-2.5 w-12 rounded bg-zinc-100" />
                </div>
              </div>

              <div className="flex items-start justify-end gap-2 ml-auto max-w-md">
                <div className="space-y-1 flex flex-col items-end">
                  <Skeleton className="h-14 w-72 rounded-2xl rounded-tr-sm bg-zinc-100" />
                  <Skeleton className="h-2.5 w-12 rounded bg-zinc-100" />
                </div>
              </div>

              <div className="flex items-start gap-2 max-w-md">
                <div className="space-y-1">
                  <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-sm bg-zinc-100" />
                  <Skeleton className="h-2.5 w-12 rounded bg-zinc-100" />
                </div>
              </div>
            </div>

            {/* Message Input Bottom Tray */}
            <div className="p-4 border-t border-zinc-100 bg-white flex items-center gap-3">
              <Skeleton className="h-12 flex-1 rounded-full bg-zinc-100" />
              <Skeleton className="size-12 rounded-full bg-zinc-100 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
