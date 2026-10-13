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

const ROLE_NAME_MAP: Record<string, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  "super-admin": "Super Admin",
  superadmin: "Super Admin",
}

export default function Navbar() {
  const auth = useAtomValue(authAtom)
  const admin = auth?.admin
  const adminId = admin?.id

  const { data: notificationsData } = useGetAdminNotifications(
    {
      // user_id: adminId,
      is_read: false,
    },
    { enabled: !!adminId }
  )

  const unreadCount =
    notificationsData?.pagination?.total ??
    (Array.isArray(notificationsData?.data)
      ? notificationsData.data.filter((n) => !n.is_read).length
      : 0)

  const adminName = admin
    ? `${admin.first_name || ""} ${admin.last_name || ""}`.trim() || "Admin"
    : "Admin"

  const adminInitials = admin
    ? `${admin.first_name?.[0] || ""}${admin.last_name?.[0] || ""}`.toUpperCase() || "AD"
    : "AD"

  const rawRole = admin?.role?.name || "admin"
  const normalizedRole = rawRole.toLowerCase().trim()
  const roleName = ROLE_NAME_MAP[normalizedRole] || rawRole.replace(/_/g, " ").toUpperCase()

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
            <AvatarImage
              src={
                admin?.profile_picture ||
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
              }
              alt={adminName}
            />
            <AvatarFallback>{adminInitials}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-dm-san-medium font-bold text-primary-color text-sm">
              {adminName}
            </span>
            <Badge
              variant="outline"
              className="border-secondary-color bg-secondary-light text-primary-color font-sans font-medium px-2.5 py-0.5 text-2xs rounded-full shadow-none select-none"
            >
              {roleName}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}