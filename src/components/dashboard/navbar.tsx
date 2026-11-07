"use client"

import React from "react"
import { IconBell, IconMessageCircle } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { useAtomValue } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { useGetAdminNotifications } from "@/hooks/notification.hook"

export default function Navbar() {
  const auth = useAtomValue(authAtom)
  const admin = (auth as any)?.admin || (auth as any)?.user || auth
  const adminId = admin?.id

  const { data: notificationsData } = useGetAdminNotifications(
    { is_read: false },
    { enabled: !!adminId }
  )

  const unreadCount =
    notificationsData?.pagination?.total ??
    (Array.isArray(notificationsData?.data)
      ? notificationsData.data.filter((n) => !n.is_read).length
      : 0)

  const adminName =
    admin?.first_name || admin?.last_name
      ? `${admin.first_name || ""} ${admin.last_name || ""}`.trim()
      : admin?.name || "Super Admin"

  const rawRole =
    typeof admin?.role === "string"
      ? admin.role
      : admin?.role?.name || (auth as any)?.role || "Super Admin"

  const adminRole =
    rawRole
      ?.replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Super Admin"

  const initials =
    admin?.first_name || admin?.last_name
      ? `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`.toUpperCase()
      : adminName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "SA"

  return (
    <header className="py-5 w-full bg-white border-b border-zinc-200/50 px-12 flex items-center justify-between">
      {/* Reusable Shared Breadcrumbs */}
      <Breadcrumbs />

      {/* Profile Actions Container */}
      <div className="flex items-center gap-5">
        <Link
          href="/dashboard/messages"
          className="p-1.5 hover:bg-zinc-50 rounded-md transition-colors cursor-pointer outline-hidden relative group"
          title="Messages"
        >
          <IconMessageCircle size={24} className="text-body-text opacity-85" />
        </Link>

        <Link
          href="/dashboard/notifications"
          className="p-1.5 hover:bg-zinc-50 rounded-md transition-colors cursor-pointer outline-hidden relative group"
          title="Notifications"
        >
          <IconBell size={24} className="text-body-text opacity-85" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-error text-white rounded-full flex items-center justify-center text-[9px] font-sans font-bold leading-none ring-2 ring-white select-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Section */}
        <div className="flex items-center gap-2.5">
          <Avatar size="lg" className="border border-primary-color size-9.5">
            {admin?.profile_picture ? (
              <AvatarImage
                src={admin.profile_picture}
                alt={adminName}
              />
            ) : null}
            <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-dm-san-medium font-bold text-primary-color text-sm">
              {adminName}
            </span>
            <Badge
              variant="outline"
              className="border-secondary-color bg-secondary-light text-primary-color font-sans font-medium px-2.5 py-0.5 text-2xs rounded-full shadow-none select-none capitalize"
            >
              {adminRole}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}