"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserType } from "@/types/user.type"
import { InvitationType } from "@/types/invitation.type"
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar, IconUserCheck } from "@tabler/icons-react"

import { useGetUserById } from "@/hooks/user.hook"

interface UserDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  invitation: InvitationType | null
}

export default function UserDetailsModal({
  open,
  onOpenChange,
  userId,
  invitation,
}: UserDetailsModalProps) {
  // Query user by id dynamically when modal is open and userId is present
  const { data: userResponse, isPending } = useGetUserById(userId || "", open && !!userId)
  const user = userResponse?.data || null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-"
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const isRegistered = !!userId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white text-body-text select-none font-dm-san-regular">
        <DialogHeader className="pb-4 border-b border-zinc-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold font-dm-san-regular text-body-text">
            {isRegistered ? "User Profile Details" : "Pending Invitation Details"}
          </DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="size-8 rounded-full border-4 border-zinc-200 border-t-[#0B1E3F] animate-spin" />
            <p className="text-sm font-normal text-zinc-500 font-dm-san-regular">
              Loading profile details...
            </p>
          </div>
        ) : isRegistered && user ? (
          <div className="pt-6 space-y-6">
            {/* Top summary row */}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                <IconUser className="size-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold leading-none">
                  {user.first_name} {user.last_name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-[#EEFDF4] text-[#22C55E] border-[#DCFCE7] text-xs font-semibold px-2 py-0.5 rounded-full shadow-none"
                  >
                    Registered
                  </Badge>
                  {user.isSuspended ? (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-500 border-red-200 text-xs font-semibold px-2 py-0.5 rounded-full shadow-none"
                    >
                      Suspended
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-active-btn text-active-border border-active-border text-xs font-semibold px-2 py-0.5 rounded-full shadow-none"
                    >
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Info lists */}
            <div className="grid grid-cols-1 gap-4 py-2 text-sm">
              {/* Contact Info */}
              <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact details</h4>
                <div className="flex items-center gap-3">
                  <IconMail className="size-4 text-zinc-400 shrink-0" />
                  <span className="font-medium text-body-text">{user.email || "-"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <IconPhone className="size-4 text-zinc-400 shrink-0" />
                  <span className="font-medium text-body-text">{user.phone || "-"}</span>
                </div>
              </div>

              {/* Account properties */}
              <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">User attributes</h4>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div className="space-y-0.5">
                    <span className="text-xs text-zinc-500 block">Gender</span>
                    <span className="font-medium text-body-text block capitalize">{user.gender?.toLowerCase() || "-"}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-zinc-500 block">Date of Birth</span>
                    <span className="font-medium text-body-text block">{formatDate(user.date_of_birth)}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-zinc-500 block">Role Type</span>
                    <span className="font-medium text-body-text block">Family Member</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs text-zinc-500 block">Registered on</span>
                    <span className="font-medium text-body-text block">{formatDate(user.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location details</h4>
                <div className="flex items-start gap-3">
                  <IconMapPin className="size-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-medium text-body-text block">{user.address || "-"}</span>
                    <span className="text-xs text-zinc-500 block">{user.state || "-"}, {user.country || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Statistics details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg text-center space-y-1">
                  <span className="text-xs text-zinc-500 block">Linked Patients</span>
                  <span className="text-2xl font-bold text-body-text block">{user._count?.patients ?? 0}</span>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg text-center space-y-1">
                  <span className="text-xs text-zinc-500 block">Emergency Contacts</span>
                  <span className="text-2xl font-bold text-body-text block">{user._count?.emergencyContacts ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        ) : invitation ? (
          <div className="pt-6 space-y-6 no-scrollbar max-h-[52vh] overflow-y-auto">
            {/* Top summary row */}
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                <IconMail className="size-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold leading-none truncate max-w-70">
                  {invitation.email}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-warning-btn text-warning-border border-warning-border text-xs font-semibold px-2 py-0.5 rounded-full shadow-none"
                  >
                    Pending Onboard
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-zinc-50 text-zinc-500 border-zinc-200 text-xs font-semibold px-2 py-0.5 rounded-full shadow-none"
                  >
                    Role: Family Member
                  </Badge>
                </div>
              </div>
            </div>

            {/* Details blocks */}
            <div className="grid grid-cols-1 gap-4 py-2 text-sm">
              <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Invitation properties</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Security Invitation Code</span>
                    <span className="font-semibold text-body-text select-text bg-zinc-100 px-2 py-0.5 rounded">{invitation.code}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Invitation Sent on</span>
                    <span className="font-medium text-body-text">{formatDate(invitation.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-1">
                    <span className="text-zinc-500">Link Expiry Date</span>
                    <span className="font-medium text-red-500">{formatDate(invitation.expiresAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No profile data selected.
          </div>
        )}
        {/* Actions */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-semibold text-sm h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
