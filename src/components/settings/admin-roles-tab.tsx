"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  useGetAdminRoles,
  useUpdateAdminRole,
  useDeleteAdminRole,
} from "@/hooks/admin-role.hook"
import { Permission } from "@/types/auth.type"
import AddRoleModal from "@/components/modal/add-role-modal"
import ConfirmationModal, { useConfirmation } from "@/components/modal/confirmation-modal"
import { toast } from "sonner"

const ALL_PERMISSIONS: Permission[] = [
  "Admins",
  "Users",
  "Overview",
  "Patients",
  "Plans",
  "Finance",
  "Caregivers",
]

export default function AdminRolesTab() {
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch roles
  const { data: rolesResponse, isPending: loadingRoles } = useGetAdminRoles()
  const { mutate: updateRole, isPending: updatingRole } = useUpdateAdminRole()
  const { mutate: deleteRole, isPending: deletingRole } = useDeleteAdminRole()

  const roles = rolesResponse?.data || []

  // Confirmation Modal state
  const { state: confirmState, confirm, close: closeConfirm } = useConfirmation()

  // Select first role by default
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id)
    }
  }, [roles, selectedRoleId])

  const activeRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || null
  }, [roles, selectedRoleId])

  // Sync permissions when active role changes
  useEffect(() => {
    if (activeRole) {
      setSelectedPermissions(activeRole.permissions)
    }
  }, [activeRole])

  const handleTogglePermission = (perm: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    if (!activeRole) return false
    const s1 = new Set(activeRole.permissions)
    const s2 = new Set(selectedPermissions)
    if (s1.size !== s2.size) return true
    for (const item of s1) {
      if (!s2.has(item)) return true
    }
    return false
  }, [activeRole, selectedPermissions])

  const handleUpdateRole = () => {
    if (!activeRole) return
    updateRole(
      {
        id: activeRole.id,
        payload: {
          name: activeRole.name,
          permissions: selectedPermissions,
        },
      },
      {
        onSuccess: () => {
          toast.success("Admin role permissions updated successfully!")
        },
        onError: () => {
          toast.error("Failed to update admin role.")
        },
      }
    )
  }

  const handleDeleteRole = () => {
    if (!activeRole) return
    confirm({
      title: "Delete Admin Role",
      description: `Are you sure you want to delete the "${activeRole.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}" admin role? This cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => {
        deleteRole(activeRole.id, {
          onSuccess: () => {
            toast.success("Admin role deleted successfully!")
            setSelectedRoleId("") // Force default selection
            closeConfirm()
          },
          onError: () => {
            toast.error("Failed to delete admin role.")
          },
        })
      },
    })
  }

  if (loadingRoles) {
    return (
      <div className="space-y-6 animate-pulse font-dm-san-regular">
        <div className="h-6 bg-zinc-200/70 rounded w-1/4" />
        <div className="h-8 bg-zinc-100 rounded w-1/2" />
        <div className="h-40 bg-white border border-zinc-100 rounded-2xl w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 font-dm-san-regular">
      {/* Top Roles Pill Selector and Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3 flex-1">
          <h3 className="text-sm font-normal text-body-text">
            Admin Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const isActive = selectedRoleId === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`px-4 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer select-none border border-transparent ${
                    isActive
                      ? "bg-secondary-color text-white font-normal shadow-xs"
                      : "text-body-text hover:text-heading-text bg-transparent"
                  }`}
                >
                  {role.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              )
            })}
          </div>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-semibold text-xs px-5 py-2.5 h-10 border-none shadow-none cursor-pointer outline-hidden self-start sm:self-end transition-colors"
        >
          Add New Admin Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <div className="border border-zinc-200/60 rounded-2xl bg-white p-12 text-center text-zinc-400 italic text-sm">
          No admin roles defined yet. Click "Add New Admin Role" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Permissions Grid Layout mimicking custom DataTable */}
          <div className="border border-zinc-200/60 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <div className="grid grid-cols-2 bg-zinc-50 border-b border-zinc-200/60 px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div>Sections</div>
              <div className="text-center">Access</div>
            </div>
            <div className="divide-y divide-zinc-200/60">
              {ALL_PERMISSIONS.map((perm) => {
                const isChecked = selectedPermissions.includes(perm)
                return (
                  <div key={perm} className="grid grid-cols-2 px-6 py-4 items-center">
                    <div className="text-sm font-normal text-body-text">{perm}</div>
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm)}
                        className="size-5 rounded-[4px] border border-zinc-300 accent-primary-color cursor-pointer"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-between items-center pt-4">
            {activeRole && activeRole.name !== "super_admin" ? (
              <Button
                onClick={handleDeleteRole}
                disabled={updatingRole || deletingRole}
                variant="ghost"
                className="text-error hover:text-error/80 font-semibold text-sm cursor-pointer h-auto bg-transparent shadow-none border-none hover:bg-transparent"
              >
                Delete Role
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={handleUpdateRole}
              disabled={!hasChanges || updatingRole || deletingRole}
              className="rounded-full bg-primary-color hover:bg-primary-color/90 text-sm text-white font-semibold px-8 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:opacity-50"
            >
              {updatingRole ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddRoleModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <ConfirmationModal
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) closeConfirm()
        }}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        variant={confirmState.variant}
        isPending={deletingRole}
      />
    </div>
  )
}
