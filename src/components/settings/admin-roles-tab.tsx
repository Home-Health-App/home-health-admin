"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { getAdminRolesColumns } from "./columns"

const ROLES = ["Super Admin", "Admin 1", "Admin 2", "Admin 3"]

export interface PermissionItem {
  section: string
  hasAccess: boolean
}

const PERMISSION_SECTIONS: PermissionItem[] = [
  { section: "Manage Caregivers", hasAccess: true },
  { section: "Manage Family Users", hasAccess: true },
  { section: "Manage Patients", hasAccess: true },
  { section: "Assign Caregivers", hasAccess: true },
  { section: "View Payments", hasAccess: true },
  { section: "Send Invites", hasAccess: true },
  { section: "Suspend Accounts", hasAccess: true },
  { section: "Manage Subscriptions", hasAccess: true },
  { section: "View Reports", hasAccess: true },
]

export default function AdminRolesTab() {
  const [selectedRole, setSelectedRole] = useState("Super Admin")

  const handleAddNewRole = () => {
    alert("Add New Admin Role triggered")
  }

  const columns = useMemo(() => {
    return getAdminRolesColumns()
  }, [])

  return (
    <div className="space-y-6">
      {/* Top Roles Pill Selector and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3 flex-1">
          <h3 className="text-sm font-normal text-body-text font-dm-san-regular">
            Admin Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => {
              const isActive = selectedRole === role
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-1.5 rounded-[6px] text-xs font-dm-san-regular transition-all cursor-pointer select-none border border-transparent ${
                    isActive
                      ? "bg-[#648FCC] text-white font-normal shadow-xs"
                      : "text-body-text hover:text-zinc-800 bg-transparent"
                  }`}
                >
                  {role}
                </button>
              )
            })}
          </div>
        </div>

        <Button
          onClick={handleAddNewRole}
          className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden self-start sm:self-end transition-colors"
        >
          Add New Admin Role
        </Button>
      </div>

      {/* Permissions Checkbox Table using shared DataTable */}
      <DataTable
        columns={columns}
        data={PERMISSION_SECTIONS}
        isPaginated={false}
      />
    </div>
  )
}
