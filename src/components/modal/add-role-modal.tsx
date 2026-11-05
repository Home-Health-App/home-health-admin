"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { useCreateAdminRole } from "@/hooks/admin-role.hook"
import { Permission } from "@/types/auth.type"
import { toast } from "sonner"

interface AddRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ALL_PERMISSIONS: Permission[] = [
  "Admins",
  "Users",
  "Overview",
  "Patients",
  "Plans",
  "Finance",
  "Caregivers",
]

export default function AddRoleModal({ open, onOpenChange }: AddRoleModalProps) {
  const [name, setName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])

  const { mutate: createRole, isPending } = useCreateAdminRole()

  useEffect(() => {
    if (open) {
      setName("")
      setSelectedPermissions([])
    }
  }, [open])

  const handleTogglePermission = (perm: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Role name is required.")
      return
    }

    createRole(
      {
        name: name.trim(),
        permissions: selectedPermissions,
      },
      {
        onSuccess: () => {
          toast.success("Admin role created successfully!")
          onOpenChange(false)
        },
        onError: () => {
          toast.error("Failed to create admin role.")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none">
        <div className="space-y-6 font-dm-san-regular">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-2xl font-bold text-body-text">
              Add New Admin Role
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Name */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text">
                Role Name
              </FieldLabel>
              <Input
                type="text"
                placeholder="e.g. Finance Admin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
              />
            </Field>

            {/* Permissions list */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-body-text block">
                Assign Permissions
              </span>
              <div className="border border-zinc-200/60 rounded-[8px] bg-zinc-50 p-4 space-y-3 max-h-60 overflow-y-auto">
                {ALL_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm)
                  return (
                    <label
                      key={perm}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <span className="text-sm font-normal text-body-text">
                        {perm}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm)}
                        className="size-5 rounded-[4px] border border-zinc-300 accent-primary-color cursor-pointer"
                      />
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 rounded-full border border-secondary-color bg-white font-semibold text-xs text-secondary-color hover:bg-secondary-color/10 h-12 cursor-pointer transition-colors shadow-none"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending || !name.trim()}
                className="flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-primary-light disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating..." : "Create Role"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
