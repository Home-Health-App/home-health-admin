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
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useGetAdminRoles } from "@/hooks/admin-role.hook"
import { useCreateAdminUser } from "@/hooks/admin.hook"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"

interface CreateAdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateAdminModal({
  open,
  onOpenChange,
}: CreateAdminModalProps) {
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

  // Create admin mutation
  const { mutate: createAdmin, isPending } = useCreateAdminUser()

  useEffect(() => {
    if (open) {
      setFirstName("")
      setLastName("")
      setEmail("")
      setGender("MALE")
      setRoleId(roles[0]?.id || "")
      setCountry("Nigeria")
      setState("Lagos")
      setAddress("")
    }
  }, [open, roles])

  // Select first role by default when roles load
  useEffect(() => {
    if (roles.length > 0 && !roleId) {
      setRoleId(roles[0].id)
    }
  }, [roles, roleId])

  const selectedRole = roles.find((r) => r.id === roleId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName.trim()) {
      toast.error("First name is required.")
      return
    }
    if (!lastName.trim()) {
      toast.error("Last name is required.")
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }
    if (!roleId) {
      toast.error("Please select an admin role.")
      return
    }
    if (!address.trim()) {
      toast.error("Address is required.")
      return
    }

    createAdmin(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        country: country.trim() || "Nigeria",
        state: state.trim() || "Lagos",
        address: address.trim(),
        gender: gender || "MALE",
        role_id: roleId,
      },
      {
        onSuccess: () => {
          toast.success("Admin user created successfully!")
          onOpenChange(false)
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to create admin user."
          toast.error(msg)
        },
      }
    )
  }

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    roleId.length > 0 &&
    address.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-6 rounded-[8px] gap-0 outline-hidden border-none shadow-xl bg-white select-none max-h-[90vh] overflow-y-auto">
        <div className="space-y-6 font-dm-san-regular">
          <DialogHeader className="flex flex-row items-center justify-between pb-2">
            <DialogTitle className="text-2xl font-bold text-body-text">
              Create Admin User
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  First Name
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="e.g. John"
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
                  placeholder="e.g. Doe"
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
                placeholder="e.g. admin@homehealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
              />
            </Field>

            {/* Role & Gender */}
            <div className="grid grid-cols-2 gap-4">
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
                      {gender.toLowerCase()}
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
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  Country
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="e.g. Nigeria"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>

              <Field>
                <FieldLabel className="text-xs font-semibold text-body-text">
                  State
                </FieldLabel>
                <Input
                  type="text"
                  placeholder="e.g. Lagos"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
                />
              </Field>
            </div>

            {/* Address */}
            <Field>
              <FieldLabel className="text-xs font-semibold text-body-text">
                Address
              </FieldLabel>
              <Input
                type="text"
                placeholder="e.g. 123 Admin Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="!h-12 px-4 rounded-[8px] border border-zinc-200 font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-zinc-50 w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden"
              />
            </Field>

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
                disabled={isPending || !isFormValid}
                className="flex-1 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-semibold text-xs h-12 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-primary-light disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <IconLoader2 className="size-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Create Admin User"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
