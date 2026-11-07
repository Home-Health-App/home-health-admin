"use client"

import React, { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { usePermissions } from "@/hooks/use-permissions"
import { toast } from "sonner"

interface PermissionGuardProps {
  children: React.ReactNode
}

export default function PermissionGuard({ children }: PermissionGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { canAccessRoute, defaultRoute, isLoading } = usePermissions()

  const isAllowed = canAccessRoute(pathname)
  const isRedirectingRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      if (!isRedirectingRef.current) {
        isRedirectingRef.current = true
        toast.error("Access restricted: Redirected to your authorized dashboard.")
        router.replace(defaultRoute)
      }
    } else {
      isRedirectingRef.current = false
    }
  }, [isAllowed, isLoading, defaultRoute, router, pathname])

  // Zero-visibility: do not render unauthorized DOM under any circumstance
  if (!isAllowed) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-3 select-none">
        <div className="size-8 rounded-full border-4 border-zinc-200 border-t-primary-color animate-spin" />
        <p className="text-sm font-medium text-body-text/70 font-dm-san-regular">
          Redirecting to authorized dashboard...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
