"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconChevronDown, IconUsers } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { columns, CaregiverItem } from "./columns"
import { DataTable } from "@/components/shared/data-table"

const MOCK_CAREGIVERS: CaregiverItem[] = [
  {
    id: "1",
    name: "Angel Castiel",
    email: "angelcastiel@gmail.com",
    status: "Active",
    invitation: "Accepted",
    assignment: "Unassigned",
  },
  {
    id: "2",
    name: "Rowena MacLeod",
    email: "rowenamacleod@gmail.com",
    status: "Active",
    invitation: "Accepted",
    assignment: "Assigned",
  },
  {
    id: "3",
    name: "Jody Mills",
    email: "jodymills@gmail.com",
    status: "Inactive",
    invitation: "Pending",
    assignment: "Pending onboard...",
  },
  {
    id: "4",
    name: "Charlie Bradbury",
    email: "charliebadbury@gmail.com",
    status: "Active",
    invitation: "Accepted",
    assignment: "Assigned",
  },
  {
    id: "5",
    name: "Bobby Singer",
    email: "bobbysinger@gmail.com",
    status: "Suspended",
    invitation: "Accepted",
    assignment: "Unassigned (Sus)",
  },
]

export default function CaregiversListView() {
  const [globalFilter, setGlobalFilter] = useState<string>("")

  // Filter based on search input
  const filteredData = useMemo(() => {
    return MOCK_CAREGIVERS.filter((item) => {
      return (
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.email.toLowerCase().includes(globalFilter.toLowerCase())
      )
    })
  }, [globalFilter])

  const isEmpty = filteredData.length === 0

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Caregiver Directory
          </h1>
          <p className="text-body-text font-dm-san-regular font-normal mt-1 text-sm">
            Manage caregiver accounts, assignments, and onboarding status.
          </p>
        </div>

        {/* Invite Caregiver button */}
        <Button className="rounded-full bg-primary-color hover:bg-primary-color text-white font-dm-san-regular font-semibold text-sm px-6 h-9.5 cursor-pointer outline-hidden border-none shadow-none self-start sm:self-auto">
          Invite Caregiver
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Caregivers */}
        <div className="p-6 bg-primary-light rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Total Caregivers
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {isEmpty ? 0 : 100}
          </span>
        </div>

        {/* Pending Invitations */}
        <div className="p-6 bg-primary-light border rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Pending Invitations
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {isEmpty ? 0 : 15}
          </span>
        </div>

        {/* Suspended Accounts */}
        <div className="p-6 bg-primary-light rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Suspended Accounts
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {isEmpty ? 0 : 4}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        {/* Search Field */}
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-body-text opacity-40" />
          <Input
            type="text"
            placeholder="Search Caregivers"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 h-9.5 rounded-full border border-zinc-200 shadow-none font-sans text-sm focus-visible:border-zinc-300 focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Button
            variant="outline"
            className="rounded-lg border border-zinc-200 bg-white font-sans font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 shadow-none"
          >
            <span>All Status</span>
            <IconChevronDown className="size-4 opacity-75 text-body-text" />
          </Button>

          <Button
            variant="outline"
            className="rounded-lg border border-zinc-200 bg-white font-sans font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 shadow-none"
          >
            <span>Assignment</span>
            <IconChevronDown className="size-4 opacity-75 text-body-text" />
          </Button>

          <Button
            variant="outline"
            className="rounded-lg border border-zinc-200 bg-white font-sans font-semibold text-xs text-body-text flex items-center gap-1.5 px-4 h-9.5 shadow-none"
          >
            <span>Invitation</span>
            <IconChevronDown className="size-4 opacity-75 text-body-text" />
          </Button>
        </div>
      </div>

      {/* Listing Content: Empty State vs populated DataTable */}
      {isEmpty ? (
        <div className="border border-zinc-200/60 rounded-2xl bg-white p-16 flex flex-col items-center justify-center text-center gap-6 shadow-2xs">
          <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-full text-zinc-800">
            <IconUsers className="size-10 opacity-70" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-dm-san-medium font-bold text-zinc-950 text-xl">
              No Caregivers invited yet
            </h3>
            <p className="text-zinc-500 font-sans text-sm max-w-sm leading-relaxed">
              You have not invited any caregiver. They will appear here when you add them
            </p>
          </div>
          <Button className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-sm px-6 h-9.5 border-none shadow-none cursor-pointer outline-hidden">
            Invite Caregiver
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pageSize={6}
        />
      )}
    </div>
  )
}
