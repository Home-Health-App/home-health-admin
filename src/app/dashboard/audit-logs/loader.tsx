import React from "react"

export default function AuditLogPageLoader() {
  return (
    <div className="w-full space-y-6 pb-12 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-zinc-200/70 rounded-md" />
        <div className="h-4 w-64 bg-zinc-100 rounded-md" />
      </div>
      <div className="flex justify-between items-center gap-4">
        <div className="h-10 w-80 bg-white border border-zinc-100 rounded-full" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-white border border-zinc-100 rounded-[8px]" />
          <div className="h-10 w-36 bg-white border border-zinc-100 rounded-[8px]" />
          <div className="h-10 w-36 bg-white border border-zinc-100 rounded-[8px]" />
        </div>
      </div>
      <div className="h-96 w-full bg-white rounded-[8px] border border-zinc-100" />
    </div>
  )
}
