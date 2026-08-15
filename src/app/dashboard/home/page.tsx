import React, { Suspense } from "react"
import HomeView from "@/components/home/home-view"
import HomeLoader from "@/components/home/loader"

// Simulates a 3-second data fetch delay to trigger Suspense fallback
async function DelayedHomeView() {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return <HomeView />
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <DelayedHomeView />
    </Suspense>
  )
}