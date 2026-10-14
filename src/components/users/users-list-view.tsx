"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconChevronDown, IconUsers } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { columns, UserItem } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { useSendInvitation } from "@/hooks/invitation.hook"
import InviteModal from "@/components/modal/invite-modal"
import UserDetailsModal from "@/components/modal/user-details-modal"
import { PaginatedResponse } from "@/types/response.type"
import { UserType } from "@/types/user.type"
import { InvitationType } from "@/types/invitation.type"
import { toast } from "sonner"

interface UsersListViewProps {
  usersData?: PaginatedResponse<UserType[]>
  invitationsData?: PaginatedResponse<InvitationType[]>
}

export default function UsersListView({
  usersData,
  invitationsData,
}: UsersListViewProps) {
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>("All Status")
  const [assignmentFilter, setAssignmentFilter] = useState<string>("All Assignments")
  const [invitationFilter, setInvitationFilter] = useState<string>("All Invitations")

  const { mutate: sendInvite } = useSendInvitation()

  const handleViewProfile = (user: UserItem) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleResendInvitation = (email: string) => {
    sendInvite(
      { email, type: "USER" },
      {
        onSuccess: () => {
          toast.success("Invitation link resent successfully!")
        },
        onError: () => {
          toast.error("Failed to resend invitation link.")
        },
      }
    )
  }

  const fullInvitationData = useMemo(() => {
    if (!selectedUser) return null
    return invitationsData?.data?.find((i) => i.id === selectedUser.id) || null
  }, [invitationsData, selectedUser])

  // Map and combine API responses
  const registeredUsers = useMemo(() => {
    if (!usersData?.data) return []
    return usersData.data.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      profile_picture: user.profile_picture || null,
      status: user.isSuspended ? ("Suspended" as const) : ("Active" as const),
      invitation: "Accepted" as const,
      assignment: user.isSuspended
        ? ("Unassigned (Sus)" as const)
        : (user._count?.assignments && user._count.assignments > 0 ? ("Assigned" as const) : ("Unassigned" as const)),
      isSuspended: user.isSuspended,
    }))
  }, [usersData])

  const pendingInvitations = useMemo(() => {
    if (!invitationsData?.data) return []
    return invitationsData.data.map((inv) => ({
      id: inv.id,
      name: "-",
      email: inv.email,
      profile_picture: null,
      status: "Inactive" as const,
      invitation: "Pending" as const,
      assignment: "Pending onboard..." as const,
      isSuspended: false,
    }))
  }, [invitationsData])

  // Combine and apply local search + select filters
  const filteredData = useMemo(() => {
    return [...registeredUsers, ...pendingInvitations].filter((item) => {
      // 1. Search text filter (local)
      const matchesSearch =
        !globalFilter ||
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.email.toLowerCase().includes(globalFilter.toLowerCase())

      // 2. Status filter
      const matchesStatus =
        statusFilter === "All Status" || item.status === statusFilter

      // 3. Assignment filter
      const matchesAssignment =
        assignmentFilter === "All Assignments" || item.assignment === assignmentFilter

      // 4. Invitation filter
      const matchesInvitation =
        invitationFilter === "All Invitations" || item.invitation === invitationFilter

      return matchesSearch && matchesStatus && matchesAssignment && matchesInvitation
    })
  }, [registeredUsers, pendingInvitations, globalFilter, statusFilter, assignmentFilter, invitationFilter])

  const totalUsersCount = usersData?.pagination?.total ?? registeredUsers.length
  const pendingInvitationsCount = invitationsData?.pagination?.total ?? pendingInvitations.length
  const suspendedCount = registeredUsers.filter(u => u.isSuspended).length

  const isEmpty = filteredData.length === 0

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            User Directory
          </h1>
          <p className="text-body-text font-dm-san-regular font-normal mt-1 text-sm">
            Manage user accounts, assignments, and onboarding status.
          </p>
        </div>

        {/* Invite User button */}
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="rounded-full bg-primary-color hover:bg-primary-color text-white font-dm-san-regular font-semibold text-sm px-6 h-9.5 cursor-pointer outline-hidden border-none shadow-none self-start sm:self-auto"
        >
          Invite User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="p-6 bg-primary-light rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Total Users
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {totalUsersCount}
          </span>
        </div>

        {/* Pending Invitations */}
        <div className="p-6 bg-primary-light border rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Pending Invitations
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {pendingInvitationsCount}
          </span>
        </div>

        {/* Suspended Accounts */}
        <div className="p-6 bg-primary-light rounded-[8px] shadow-2xs space-y-2.5">
          <span className="text-base font-semibold text-body-text font-dm-san-regular block">
            Suspended Accounts
          </span>
          <span className="text-2xl font-semibold font-dm-san-medium text-body-text block">
            {suspendedCount}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        {/* Search Field */}
        <div className="relative h-14 w-full sm:w-110">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-6 text-body-text opacity-40" />
          <Input
            type="text"
            placeholder="Search Patients"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 pr-4 h-full rounded-full border border-[#A1A1A1] shadow-none font-sans text-sm focus-visible:border-[#999999] focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "All Status")}>
            <SelectTrigger className="w-[125px] h-9.5 px-3 rounded-lg border border-zinc-200 bg-white font-sans font-semibold text-xs text-body-text flex items-center justify-between shadow-none cursor-pointer focus:ring-0 focus:border-zinc-300">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-zinc-200 shadow-sm rounded-md p-1 min-w-[125px]">
              <SelectItem value="All Status" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">All Status</SelectItem>
              <SelectItem value="Active" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">Active</SelectItem>
              <SelectItem value="Inactive" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">Inactive</SelectItem>
              <SelectItem value="Suspended" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">Suspended</SelectItem>
            </SelectContent>
          </Select>

          {/* Invitation Filter */}
          <Select value={invitationFilter} onValueChange={(val) => setInvitationFilter(val || "All Invitations")}>
            <SelectTrigger className="w-33.75 h-9.5 px-3 rounded-lg border border-zinc-200 bg-white font-sans font-semibold text-xs text-body-text flex items-center justify-between shadow-none cursor-pointer focus:ring-0 focus:border-zinc-300">
              <SelectValue placeholder="All Invitations" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-zinc-200 shadow-sm rounded-md p-1 min-w-[135px]">
              <SelectItem value="All Invitations" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">All Invitations</SelectItem>
              <SelectItem value="Accepted" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">Accepted</SelectItem>
              <SelectItem value="Pending" className="font-sans text-xs rounded-sm hover:bg-zinc-100 cursor-pointer">Pending</SelectItem>
            </SelectContent>
          </Select>
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
              No Users invited yet
            </h3>
            <p className="text-zinc-500 font-sans text-sm max-w-sm leading-relaxed">
              You have not invited any user. They will appear here when you add them
            </p>
          </div>
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-sans font-semibold text-sm px-6 h-9.5 border-none shadow-none cursor-pointer outline-hidden"
          >
            Invite User
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pageSize={6}
          meta={{
            onViewProfile: handleViewProfile,
            onResendInvitation: handleResendInvitation,
          }}
        />
      )}

      <InviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        type="USER"
      />

      <UserDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        userId={selectedUser?.invitation === "Accepted" ? selectedUser.id : null}
        invitation={selectedUser?.invitation === "Pending" ? fullInvitationData : null}
      />
    </div>
  )
}
