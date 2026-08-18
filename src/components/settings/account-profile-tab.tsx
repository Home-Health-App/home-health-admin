"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AccountProfileTab() {
  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@gmail.com",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Profile saved successfully!")
  }

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-1">
        <h2 className="text-[22px] font-medium font-dm-san-regular text-body-text">
          Account Profile
        </h2>
        <p className="text-sm font-normal font-dm-san-regular text-body-text">
          Manage your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 font-dm-san-regular">
            <label className="text-sm font-normal text-[#2B2B2B]">
              First Name
            </label>
            <Input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="h-11 px-4 rounded-[8px] border border-primary-color/30 font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
            />
          </div>

          <div className="space-y-1.5 font-dm-san-regular">
            <label className="text-sm font-normal text-[#2B2B2B]">
              Last Name
            </label>
            <Input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="h-11 px-4 rounded-[8px] border border-primary-color/30 font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
            />
          </div>
        </div>

        <div className="space-y-1.5 font-dm-san-regular">
          <label className="text-sm font-normal text-[#2B2B2B]">
            Email Address
          </label>
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="h-11 px-4 rounded-[8px] border border-primary-color/30 font-dm-san-regular text-base font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-6 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
