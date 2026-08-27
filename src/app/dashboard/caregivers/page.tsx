"use client"

import React, { Suspense } from "react"
import CaregiversListView from "@/components/caregivers/caregivers-list-view"
import PatientLoader from "@/components/patients/patients-list/loader"
import { useSuspenseGetUsers } from "@/hooks/user.hook"
import { useSuspenseGetInvitations } from "@/hooks/invitation.hook"

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

  return (
    <CaregiversListView
      usersData={usersData}
      invitationsData={invitationsData}
    />
  )
}

export default function CaregiversPage() {
  return (
    <Suspense fallback={<PatientLoader />}>
      <CaregiversDataContainer />
    </Suspense>
  )
}