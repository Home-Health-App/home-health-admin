"use client"

import React, { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { useUpdateAdminUser } from "@/hooks/admin.hook"
import { useUploadFile } from "@/hooks/upload.hook"
import { toast } from "sonner"
import { IconLoader2, IconPencil, IconMinus } from "@tabler/icons-react"

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
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateAdmin, isPending: isUpdatingAdmin } = useUpdateAdminUser()
  const { mutate: uploadFile, isPending: isUploadingFile } = useUploadFile()

  useEffect(() => {
    if (currentAdmin) {
      setFirstName(currentAdmin.first_name || "")
      setLastName(currentAdmin.last_name || "")
      setEmail(currentAdmin.email || "")
      setGender(currentAdmin.gender || "MALE")
      setCountry(currentAdmin.country || "Nigeria")
      setState(currentAdmin.state || "Lagos")
      setAddress(currentAdmin.address || "")
      setProfilePicUrl(currentAdmin.profile_picture || null)
    }
  }, [currentAdmin])

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.")
      return
    }

    if (!currentAdmin?.id) {
      toast.error("Admin user session not found.")
      return
    }

    uploadFile(file, {
      onSuccess: (uploadRes) => {
        const uploadedUrl = uploadRes?.data?.url
        if (!uploadedUrl) {
          toast.error("Failed to retrieve uploaded image URL.")
          return
        }

        setProfilePicUrl(uploadedUrl)

        // Automatically update admin profile on server via PUT /admin-auth/{id}
        updateAdmin(
          {
            id: currentAdmin.id,
            payload: {
              first_name: firstName.trim() || currentAdmin.first_name,
              last_name: lastName.trim() || currentAdmin.last_name,
              email: email.trim() || currentAdmin.email,
              country: country.trim() || currentAdmin.country || "Nigeria",
              state: state.trim() || currentAdmin.state || "Lagos",
              address: address.trim() || currentAdmin.address || "",
              gender: gender || currentAdmin.gender || "MALE",
              profile_picture: uploadedUrl,
            },
          },
          {
            onSuccess: (adminRes) => {
              toast.success("Profile photo updated successfully!")
              const updatedData = adminRes?.data
              if (updatedData) {
                setAuth((prev) => {
                  if (!prev) return null
                  return {
                    ...prev,
                    admin: {
                      ...prev.admin,
                      ...updatedData,
                      role: (updatedData.role as any) || prev.admin?.role,
                    },
                  }
                })
              }
            },
            onError: (err: any) => {
              const msg =
                err?.response?.data?.message ||
                "Failed to update admin profile picture."
              toast.error(msg)
            },
          }
        )
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to upload image."
        toast.error(msg)
      },
    })

    if (e.target) {
      e.target.value = ""
    }
  }

  const handleRemovePhoto = () => {
    if (!currentAdmin?.id) {
      toast.error("Admin user session not found.")
      return
    }

    setProfilePicUrl(null)

    // Update admin profile on server via PUT /admin-auth/{id}
    updateAdmin(
      {
        id: currentAdmin.id,
        payload: {
          first_name: firstName.trim() || currentAdmin.first_name,
          last_name: lastName.trim() || currentAdmin.last_name,
          email: email.trim() || currentAdmin.email,
          country: country.trim() || currentAdmin.country || "Nigeria",
          state: state.trim() || currentAdmin.state || "Lagos",
          address: address.trim() || currentAdmin.address || "",
          gender: gender || currentAdmin.gender || "MALE",
          profile_picture: null,
        },
      },
      {
        onSuccess: (adminRes) => {
          toast.success("Profile photo removed successfully!")
          const updatedData = adminRes?.data
          if (updatedData) {
            setAuth((prev) => {
              if (!prev) return null
              return {
                ...prev,
                admin: {
                  ...prev.admin,
                  ...updatedData,
                  role: (updatedData.role as any) || prev.admin?.role,
                },
              }
            })
          }
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || "Failed to remove profile photo."
          toast.error(msg)
        },
      }
    )
  }

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
          profile_picture: profilePicUrl,
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

  const initials =
    firstName || lastName
      ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
      : currentAdmin?.first_name || currentAdmin?.last_name
      ? `${currentAdmin?.first_name?.[0] || ""}${currentAdmin?.last_name?.[0] || ""}`.toUpperCase()
      : "AD"

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

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Profile Picture Upload Section (Clean Centralized without Card Design) */}
        <div className="flex flex-col items-center justify-center gap-2.5 pb-2">
          <div className="relative group">
            <Avatar
              className="size-24 border-2 border-zinc-200/80 shadow-2xs cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePicUrl ? (
                <AvatarImage
                  src={profilePicUrl}
                  alt={`${firstName} ${lastName}`}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-primary-light text-primary-color font-semibold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isUploadingFile && (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <IconLoader2 className="size-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Action Icons: Edit & Minus */}
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isUploadingFile || isUpdatingAdmin}
              onClick={() => fileInputRef.current?.click()}
              title={profilePicUrl ? "Change Photo" : "Upload Photo"}
              aria-label="Upload or change photo"
              className="size-8.5 rounded-full border-zinc-200 bg-white text-primary-color hover:bg-zinc-100 shadow-2xs cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isUploadingFile ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconPencil className="size-4" />
              )}
            </Button>

            {profilePicUrl && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isUploadingFile || isUpdatingAdmin}
                onClick={handleRemovePhoto}
                title="Remove Photo"
                aria-label="Remove photo"
                className="size-8.5 rounded-full border-zinc-200 bg-white text-red-600 hover:text-red-700 hover:bg-warning-btn shadow-2xs cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <IconMinus className="size-4 stroke-[2.5]" />
              </Button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />
        </div>
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
            disabled={isUpdatingAdmin || isUploadingFile || !isFormValid}
            className="rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs px-8 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors disabled:bg-primary-light disabled:text-white disabled:opacity-100 disabled:cursor-not-allowed"
          >
            {isUpdatingAdmin ? (
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

