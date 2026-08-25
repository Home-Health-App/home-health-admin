
"use client"

import React from "react"
import { useParams } from "next/navigation"
import CaregiverDetailsView from "@/components/caregivers/caregiver-details-view"

export default function CaregiverDetailsPage() {
  const params = useParams()
  const caregiverId = params.caregiverId as string

  return <CaregiverDetailsView caregiverId={caregiverId} />
}
