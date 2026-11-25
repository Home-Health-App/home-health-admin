"use client"

import React, { Suspense } from "react"
import HomeView from "@/components/home/home-view"
import HomeSkeleton from "@/components/home/home-skeleton"
import { useSuspenseGetAdminAnalytics } from "@/hooks/analytic.hook"

function HomeDataContainer() {
  const { data: response } = useSuspenseGetAdminAnalytics()

  if (!response?.data) return null

  return <HomeView analytics={response.data} />
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeDataContainer />
    </Suspense>
  )
}
