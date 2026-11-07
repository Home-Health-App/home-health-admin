"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"

export default function DashboardRootPage() {
  const router = useRouter()
  const { defaultRoute, isLoading } = usePermissions()

  useEffect(() => {
    if (!isLoading && defaultRoute) {
      router.replace(defaultRoute)
    }
  }, [defaultRoute, isLoading, router])

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-3 select-none">
      <div className="size-8 rounded-full border-4 border-zinc-200 border-t-primary-color animate-spin" />
      <p className="text-sm font-medium text-body-text/70 font-dm-san-regular">
        Loading dashboard...
      </p>
    </div>
  )
}
