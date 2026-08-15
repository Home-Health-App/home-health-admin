"use client"

import React, { useState, useMemo } from "react"
import { DataTable } from "@/components/shared/data-table"
import { getAdminUsersColumns } from "./columns"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
}

const ADMIN_USERS: AdminUser[] = [
  { id: "1", name: "Pope Lee", email: "popelee@gmail.com", role: "Super Admin", lastActive: "2 Mins ago" },
  { id: "2", name: "Pope Lee", email: "popelee@gmail.com", role: "Admin 1", lastActive: "2 Mins ago" },
  { id: "3", name: "Pope Lee", email: "popelee@gmail.com", role: "Admin 2", lastActive: "2 Mins ago" },
  { id: "4", name: "Pope Lee", email: "popelee@gmail.com", role: "Admin 3", lastActive: "2 Mins ago" },
  { id: "5", name: "Pope Lee", email: "popelee@gmail.com", role: "Admin 1", lastActive: "2 Mins ago" },
  { id: "6", name: "Pope Lee", email: "popelee@gmail.com", role: "Admin 1", lastActive: "2 Mins ago" },
]

export default function AdminUsersTab() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleToggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const handleAction = (action: string, user: AdminUser) => {
    alert(`${action} on user: ${user.name} (${user.role})`)
    setActiveDropdown(null)
  }

  const handleCloseDropdown = () => {
    setActiveDropdown(null)
  }

  const columns = useMemo(() => {
    return getAdminUsersColumns({
      activeDropdown,
      onToggleDropdown: handleToggleDropdown,
      onAction: handleAction,
      onCloseDropdown: handleCloseDropdown,
    })
  }, [activeDropdown])

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={ADMIN_USERS}
        isPaginated={false}
      />
    </div>
  )
}
