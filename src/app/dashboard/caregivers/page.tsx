"use client"

import React, { Suspense } from "react"
import CaregiversListView from "@/components/caregivers/caregivers-list-view"
import CaregiversListSkeleton from "@/components/caregivers/caregivers-list-skeleton"
import { useSuspenseGetUsers } from "@/hooks/user.hook"
import { useSuspenseGetInvitations } from "@/hooks/invitation.hook"
import { useSuspenseGetCareGiverAnalytics } from "@/hooks/analytic.hook"

function CaregiversDataContainer() {
  const { data: usersData } = useSuspenseGetUsers({
    type: "CARE_GIVER",
    limit: 100,
  })

  const { data: invitationsData } = useSuspenseGetInvitations({
    type: "CARE_GIVER",
    status: "PENDING",
    limit: 100,
  })

  const { data: analyticsData } = useSuspenseGetCareGiverAnalytics()

  return (
    <CaregiversListView
      usersData={usersData}
      invitationsData={invitationsData}
      analyticsData={analyticsData?.data}
    />
  )
}

export default function CaregiversPage() {
  return (
    <Suspense fallback={<CaregiversListSkeleton />}>
      <CaregiversDataContainer />
    </Suspense>
  )
}
