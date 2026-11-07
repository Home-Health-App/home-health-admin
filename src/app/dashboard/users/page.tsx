"use client"

import React, { Suspense } from "react"
import UsersListView from "@/components/users/users-list-view"
import UsersListSkeleton from "@/components/users/users-list-skeleton"
import { useSuspenseGetUsers } from "@/hooks/user.hook"
import { useSuspenseGetInvitations } from "@/hooks/invitation.hook"

function UsersDataContainer() {
  const { data: usersData } = useSuspenseGetUsers({
    type: "USER",
    limit: 100,
  })

  const { data: invitationsData } = useSuspenseGetInvitations({
    type: "USER",
    status: "PENDING",
    limit: 100,
  })

  return (
    <UsersListView
      usersData={usersData}
      invitationsData={invitationsData}
    />
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersListSkeleton />}>
      <UsersDataContainer />
    </Suspense>
  )
}
