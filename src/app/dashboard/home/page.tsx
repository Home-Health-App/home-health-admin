"use client"

import React, { Suspense } from "react"
import HomeView from "@/components/home/home-view"
import HomeLoader from "@/components/home/loader"
import { useSuspenseGetAdminAnalytics } from "@/hooks/analytic.hook"
import { CONTENT_STATE_DATA } from "@/components/home/mock-data"

function HomeDataContainer() {
  const { data: response } = useSuspenseGetAdminAnalytics()

  if (!response?.data) return null

  // Blend the real-time API values with the mock dashboard details
  const dashboardData = {
    kpis: {
      totalPatients: response.data.totalPatients.toString(),
      totalCaregivers: response.data.totalCaregivers.toString(),
      totalRevenue: `$${(response.data.totalRevenue / 1000).toFixed(0)}k`,
      expiredSubscriptions: response.data.totalExpiredPatient.toString(),
    },
    patientGrowth: CONTENT_STATE_DATA.patientGrowth,
    revenueOverview: CONTENT_STATE_DATA.revenueOverview,
    notifications: CONTENT_STATE_DATA.notifications,
  }

  return <HomeView data={dashboardData} />
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <HomeDataContainer />
    </Suspense>
  )
}