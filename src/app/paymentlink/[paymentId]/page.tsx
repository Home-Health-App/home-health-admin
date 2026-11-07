"use client"

import React, { Suspense } from "react"
import { useParams } from "next/navigation"
import PaymentCheckoutView from "@/components/public-payment/payment-checkout-view"
import { IconLoader2 } from "@tabler/icons-react"

function CheckoutLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-secondary-light gap-3">
      <IconLoader2 className="size-8 text-primary-color animate-spin" />
      <span className="text-sm font-dm-san-regular text-body-text/70">
        Loading secure checkout...
      </span>
    </div>
  )
}

export default function PublicPaymentPage() {
  const params = useParams()
  const paymentId = params.paymentId as string

  return (
    <Suspense fallback={<CheckoutLoading />}>
      <PaymentCheckoutView paymentId={paymentId} />
    </Suspense>
  )
}
