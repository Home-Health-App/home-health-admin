"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface DeleteNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending?: boolean
}

export default function DeleteNotificationModal({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: DeleteNotificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[420px] p-8 rounded-[16px] bg-white border-none shadow-2xl outline-hidden select-none"
      >
        <div className="flex flex-col items-center text-center space-y-6 font-dm-san-regular">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-950 font-sans tracking-tight">
              Delete Notification
            </h2>
            <p className="text-sm text-zinc-600 font-normal leading-relaxed">
              Are you sure you want to delete this notification?
            </p>
            <p className="text-xs text-[#C43A3A] font-normal pt-1">
              This cannot be undone
            </p>
          </div>

          <div className="flex items-center gap-4 w-full pt-2">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 rounded-full bg-warning-border hover:bg-[#B02F2F] text-white font-dm-san-regular font-semibold text-sm py-3 cursor-pointer border-none shadow-none outline-hidden transition-colors disabled:opacity-50"
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 rounded-full border border-[#4F73B8] bg-white font-dm-san-regular font-semibold text-sm text-[#4F73B8] hover:bg-[#EEF2F6] py-3 cursor-pointer transition-colors shadow-none outline-hidden disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
