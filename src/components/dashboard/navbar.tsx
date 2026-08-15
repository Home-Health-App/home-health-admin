"use client"

import React from "react"
import { IconBell, IconMessageCircle } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export default function Navbar() {
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
          <span className="absolute top-0.5 right-0.5 size-4 bg-[#C43A3A] text-white rounded-full flex items-center justify-center text-[9px] font-sans font-bold leading-none ring-2 ring-white select-none">
            2
          </span>
        </Link>

        <Link
          href="/dashboard/notifications"
          className="p-1.5 hover:bg-zinc-50 rounded-md transition-colors cursor-pointer outline-hidden relative group"
          title="Notifications"
        >
          <IconBell size={24} className="text-body-text opacity-85" />
          <span className="absolute top-0.5 right-0.5 size-4 bg-[#C43A3A] text-white rounded-full flex items-center justify-center text-[9px] font-sans font-bold leading-none ring-2 ring-white select-none">
            4
          </span>
        </Link>

        {/* User Profile Section */}
        <div className="flex items-center gap-2.5">
          <Avatar size="lg" className="border-2 border-primary-color size-9.5">
            <AvatarImage
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
              alt="Jane Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-dm-san-medium font-bold text-primary-color text-sm">
              Jane Doe
            </span>
            <Badge
              variant="outline"
              className="border-secondary-color bg-[#EEF2F6] text-primary-color font-sans font-medium px-2.5 py-0.5 text-2xs rounded-full shadow-none select-none"
            >
              Super Admin
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}