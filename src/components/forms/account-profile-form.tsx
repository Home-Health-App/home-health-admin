"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { useUpdateAdminUser } from "@/hooks/admin.hook"
import { toast } from "sonner"
import { IconLoader2 } from "@tabler/icons-react"

export default function AccountProfileForm() {
  const [auth, setAuth] = useAtom(authAtom)
  const currentAdmin = auth?.admin

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<string>("MALE")
  const [country, setCountry] = useState("Nigeria")
  const [state, setState] = useState("Lagos")
  const [address, setAddress] = useState("")

  const { mutate: updateAdmin, isPending } = useUpdateAdminUser()

  useEffect(() => {
    if (currentAdmin) {
      setFirstName(currentAdmin.first_name || "")
      setLastName(currentAdmin.last_name || "")
      setEmail(currentAdmin.email || "")
      setGender(currentAdmin.gender || "MALE")
      setCountry(currentAdmin.country || "Nigeria")
      setState(currentAdmin.state || "Lagos")
      setAddress(currentAdmin.address || "")
    }
  }, [currentAdmin])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentAdmin?.id) {
      toast.error("Admin user session not found.")
      return
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required.")
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    updateAdmin(
      {
        id: currentAdmin.id,
        payload: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          country: country.trim() || "Nigeria",
          state: state.trim() || "Lagos",
          address: address.trim(),
          gender: gender || "MALE",
        },
      },
      {
        onSuccess: (response) => {
          toast.success("Account profile updated successfully!")
          const updatedData = response?.data
          if (updatedData) {
            setAuth((prev) => {
              if (!prev) return null
              return {
                ...prev,
                admin: {
                  ...prev.admin,
                  ...updatedData,
                  role: (updatedData.role as any) || prev.admin.role,
                },
              }
            })
          }
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to update account profile."
          toast.error(msg)
        },
      }
    )
  }

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0

  return (
    <div className="space-y-6 w-full font-dm-san-regular">
      <div className="space-y-1">
        <h2 className="text-[22px] font-medium text-body-text">
          Account Profile
        </h2>
        <p className="text-sm font-normal text-body-text">
          Manage your personal information and account details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Email Address */}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Gender */}
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

          {/* Country */}
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

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isPending || !isFormValid}
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-8 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-[#D0DFE7] disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
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
  )
}

