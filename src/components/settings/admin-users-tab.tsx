"use client"

import React, { useState, useMemo } from "react"
import { DataTable } from "@/components/shared/data-table"
import { getAdminUsersColumns } from "./columns"
import { useGetAdmins } from "@/hooks/admin.hook"
import { Button } from "@/components/ui/button"
import CreateAdminModal from "@/components/modal/create-admin-modal"
import ChangeAdminRoleModal from "@/components/modal/change-admin-role-modal"
import { AdminUserType } from "@/types/admin.type"
import { IconLoader2, IconUsers } from "@tabler/icons-react"

export default function AdminUsersTab() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAdminForRole, setSelectedAdminForRole] = useState<AdminUserType | null>(null)
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)

  // Fetch admin users
  const { data: adminsResponse, isLoading } = useGetAdmins()

  // Handle response data format (could be PaginatedResponse or GeneralResponse)
  const admins: AdminUserType[] = Array.isArray(adminsResponse?.data)
    ? (adminsResponse.data as AdminUserType[])
    : []

  const handleToggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const handleAction = (action: string, user: AdminUserType) => {
    setActiveDropdown(null)
    if (action === "Edit Admin" || action === "Change Role") {
      setSelectedAdminForRole(user)
      setIsChangeRoleModalOpen(true)
    }
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
    <div className="space-y-6 font-dm-san-regular">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-body-text">
            Admin Users
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Manage admin accounts, access permissions, and roles.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden self-start sm:self-end transition-colors"
        >
          Create Admin User
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-200/60">
          <IconLoader2 className="size-7 text-primary-color animate-spin" />
          <p className="text-sm text-zinc-500">Loading admin users...</p>
        </div>
      ) : admins.length === 0 ? (
        <div className="border border-zinc-200/60 rounded-2xl bg-white p-12 text-center text-zinc-400 text-sm space-y-3">
          <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <IconUsers className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-zinc-700">No Admin Users Found</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Click &quot;Create Admin User&quot; to add the first admin account.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          isPaginated={false}
        />
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Change Admin Role Modal */}
      <ChangeAdminRoleModal
        open={isChangeRoleModalOpen}
        onOpenChange={setIsChangeRoleModalOpen}
        admin={selectedAdminForRole}
      />
    </div>
  )
}


