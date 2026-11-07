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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useGetAdminRoles } from "@/hooks/admin-role.hook"
import { useUpdateAdminUser } from "@/hooks/admin.hook"
import { AdminUserType } from "@/types/admin.type"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"

interface ChangeAdminRoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin: AdminUserType | null
}

export default function ChangeAdminRoleModal({
  open,
  onOpenChange,
  admin,
}: ChangeAdminRoleModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<string>("MALE")
  const [roleId, setRoleId] = useState("")
  const [country, setCountry] = useState("Nigeria")
  const [state, setState] = useState("Lagos")
  const [address, setAddress] = useState("")

  // Fetch admin roles
  const { data: rolesResponse, isPending: loadingRoles } = useGetAdminRoles()
  const roles = rolesResponse?.data || []

  // Update admin mutation
  const { mutate: updateAdmin, isPending } = useUpdateAdminUser()

  useEffect(() => {
    if (open && admin) {
      setFirstName(admin.first_name || "")
      setLastName(admin.last_name || "")
      setEmail(admin.email || "")
      setGender(admin.gender || "MALE")
      setRoleId(admin.role_id || admin.role?.id || "")
      setCountry(admin.country || "Nigeria")
      setState(admin.state || "Lagos")
      setAddress(admin.address || "")
    }
  }, [open, admin])

  const selectedRole = roles.find((r) => r.id === roleId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!admin?.id) return

    if (!roleId) {
      toast.error("Please select an admin role.")
      return
    }

    updateAdmin(
      {
        id: admin.id,
        payload: {
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          email: email.trim() || undefined,
          country: country.trim() || undefined,
          state: state.trim() || undefined,
          address: address.trim() || undefined,
          gender: gender || undefined,
          role_id: roleId,
        },
      },
      {
        onSuccess: () => {
          toast.success("Admin user updated successfully!")
          onOpenChange(false)
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to update admin user."
          toast.error(msg)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 font-dm-san-regular">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-2xl font-bold text-body-text">
              Edit Admin User
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Select */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text">
                Admin Role
              </FieldLabel>
              <Select value={roleId} onValueChange={(val) => setRoleId(val || "")}>
                <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-200 bg-zinc-50 text-left font-normal flex items-center justify-between text-body-text shadow-none hover:bg-zinc-50 font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden">
                  {selectedRole ? (
                    <span className="flex-1 text-left font-dm-san-regular text-sm text-body-text truncate">
                      {selectedRole.name
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ) : (
                    <span className="flex-1 text-left font-dm-san-regular text-sm text-zinc-400">
                      {loadingRoles ? "Loading roles..." : "Select Role"}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.id}
                      className="font-dm-san-regular font-normal text-sm py-2 px-3 hover:bg-zinc-50 cursor-pointer"
                    >
                      <span className="font-medium text-body-text">
                        {role.name
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  First Name
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Last Name
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>
            </div>

            {/* Email */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text">
                Email Address
              </FieldLabel>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
              />
            </Field>

            {/* Gender, Country & State */}
            <div className="grid grid-cols-2 gap-4">
              {/* Gender Select */}
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Gender
                </FieldLabel>
                <Select
                  value={gender}
                  onValueChange={(val) => setGender(val || "MALE")}
                >
                  <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-200 bg-zinc-50 text-left font-normal flex items-center justify-between text-body-text shadow-none hover:bg-zinc-50 font-dm-san-regular text-sm cursor-pointer focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden">
                    <span className="flex-1 text-left font-dm-san-regular text-sm text-body-text capitalize">
                      {gender ? gender.toLowerCase() : "Select Gender"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
                    <SelectItem
                      value="MALE"
                      className="font-dm-san-regular font-normal text-sm py-2 px-3 hover:bg-zinc-50 cursor-pointer"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      value="FEMALE"
                      className="font-dm-san-regular font-normal text-sm py-2 px-3 hover:bg-zinc-50 cursor-pointer"
                    >
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {/* State */}
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  State
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>
            </div>

            {/* Country & Address */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Country
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Address
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>
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
                disabled={isPending || !roleId}
                className="flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-primary-light disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <IconLoader2 className="size-4 animate-spin" />
                    Saving Changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
