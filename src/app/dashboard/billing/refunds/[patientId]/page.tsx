"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Deprecated in favor of static /refund-details route
export default function DeprecatedRefundDetailPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard/billing")
  }, [router])

  return null
}
