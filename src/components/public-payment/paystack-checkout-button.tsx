"use client"

import React from "react"
import { usePaystackPayment } from "react-paystack"
import { Button } from "@/components/ui/button"
import { IconLock, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export interface PaystackCheckoutButtonProps {
  reference: string
  email: string
  amountInKobo: number
  amountInNaira: number
  disabled?: boolean
  isVerifying?: boolean
  className?: string
  onSuccess: (response: any) => void
  onClose?: () => void
}

export default function PaystackCheckoutButton({
  reference,
  email,
  amountInKobo,
  amountInNaira,
  disabled = false,
  isVerifying = false,
  className,
  onSuccess,
  onClose,
}: PaystackCheckoutButtonProps) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!

  const initializePayment = usePaystackPayment({
    publicKey,
    email: (email || "").trim(),
    amount: amountInKobo,
    reference,
    currency: "NGN",
  })

  const config = {
    reference,
    email,
    amount: amountInKobo,
    currency: "NGN" as const
  }

  const handlePayClick = () => {
    if (!publicKey) {
      toast.error("Paystack public key is not configured.")
      return
    }

    if (!email || !email.includes("@")) {
      toast.error("A valid customer email is required to proceed.")
      return
    }

    if (!reference) {
      toast.error("Payment reference ID is missing.")
      return
    }

    if (!amountInKobo || amountInKobo <= 0) {
      toast.error("Invalid payment amount.")
      return
    }

    try {
      initializePayment({
        onSuccess: (res: any) => onSuccess(res),
        onClose: () => {
          if (onClose) onClose()
        },
        config
      })
    } catch (err: any) {
      console.error("Paystack initialization error:", err)
      toast.error(err?.message || "Could not launch Paystack checkout.")
    }
  }

  return (
    <Button
      type="button"
      onClick={handlePayClick}
      disabled={disabled || isVerifying || !email || !reference || amountInKobo <= 0}
      className={
        className ||
        "w-full h-12 rounded-full bg-secondary-color hover:bg-secondary-color/90 text-white font-dm-san-regular font-bold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {isVerifying ? (
        <>
          <IconLoader2 className="size-4 animate-spin" />
          <span>Verifying Payment...</span>
        </>
      ) : (
        <>
          <IconLock className="size-4" />
          <span>Pay ₦{amountInNaira.toLocaleString()}</span>
        </>
      )}
    </Button>
  )
}
