"use client"

import React, { useState, useMemo } from "react"
import { DataTable } from "@/components/shared/data-table"
import { getAdminUsersColumns } from "./columns"
import { useGetAdmins } from "@/hooks/admin.hook"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CreateAdminModal from "@/components/modal/create-admin-modal"
import ChangeAdminRoleModal from "@/components/modal/change-admin-role-modal"
import { AdminUserType } from "@/types/admin.type"
import { IconLoader2, IconUsers, IconSearch } from "@tabler/icons-react"

export default function AdminUsersTab() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAdminForRole, setSelectedAdminForRole] = useState<AdminUserType | null>(null)
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Fetch admin users
  const { data: adminsResponse, isLoading } = useGetAdmins()

  // Handle response data format (could be PaginatedResponse or GeneralResponse)
  const admins: AdminUserType[] = Array.isArray(adminsResponse?.data)
    ? (adminsResponse.data as AdminUserType[])
    : []

  const filteredAdmins = useMemo(() => {
    if (!search.trim()) return admins
    const s = search.toLowerCase().trim()
    return admins.filter((a) => {
      const fullName = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase()
      const email = (a.email || "").toLowerCase()
      const roleName = (typeof a.role === "string" ? a.role : a.role?.name || "").toLowerCase()
      return fullName.includes(s) || email.includes(s) || roleName.includes(s)
    })
  }, [admins, search])

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
          <h3 className="text-xl font-semibold text-heading-text">
            Admin Users
          </h3>
          <p className="text-xs text-body-text/70 mt-1">
            Manage admin accounts, access permissions, and roles.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden self-start sm:self-end transition-colors"
        >
          Create Admin User
        </Button>
      </div>

      {/* Canonical Search Input Bar */}
      <div className="relative h-14 w-full sm:w-110">
        <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-6 text-body-text opacity-40" />
        <Input
          type="text"
          placeholder="Search Admin Users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 pr-4 h-full rounded-full border border-[#A1A1A1] shadow-none font-sans text-sm focus-visible:border-[#999999] focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-zinc-200/60">
          <IconLoader2 className="size-7 text-primary-color animate-spin" />
          <p className="text-sm text-body-text/70">Loading admin users...</p>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="border border-zinc-200/60 rounded-2xl bg-white p-12 text-center text-zinc-400 text-sm space-y-3">
          <div className="size-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <IconUsers className="size-6" />
          </div>
          <div>
            <p className="font-semibold text-heading-text">No Admin Users Found</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {search.trim()
                ? "No admin accounts match your search filter."
                : 'Click "Create Admin User" to add the first admin account.'}
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredAdmins}
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
