"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isPending?: boolean
  variant?: "danger" | "primary"
}

export default function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isPending = false,
  variant = "primary",
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[400px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        <div className="space-y-6 font-dm-san-regular">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-body-text">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm font-normal text-zinc-500 mt-2 leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:bg-secondary-color/10 h-12 cursor-pointer transition-colors shadow-none"
            >
              {cancelText}
            </Button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={
                variant === "danger"
                  ? "flex-1 rounded-full bg-error hover:bg-error/90 text-white font-dm-san-regular font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors"
                  : "flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors"
              }
            >
              {isPending ? "Processing..." : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface useConfirmationState {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: "danger" | "primary"
}

export const useConfirmation = () => {
  const [state, setState] = useState<{
    open: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    variant?: "danger" | "primary"
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const confirm = (config: useConfirmationState) => {
    setState({
      ...config,
      open: true,
    })
  }

  const close = () => {
    setState((prev) => ({ ...prev, open: false }))
  }

  return {
    state,
    confirm,
    close,
  }
}
