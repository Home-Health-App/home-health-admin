"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "../ui/button"
import InviteModal from "@/components/modal/invite-modal"
import { AdminAnalyticType } from "@/types/analytic.type"
import { useGetAdminGraphsAnalytics } from "@/hooks/analytic.hook"
import { useGetAdminNotifications } from "@/hooks/notification.hook"
import { NOTIFICATION_CATEGORY_LABELS } from "@/types/notification.type"
import { formatNotificationTime } from "@/libs/helper"
import { cn } from "@/libs/utils"

type HomeViewProps = {
  analytics: AdminAnalyticType
}

const getCurrencySymbol = (currency?: string) => {
  if (currency === "USD") return "$"
  return "₦"
}

const formatCompactCurrency = (amount: number, currency?: string) => {
  const symbol = getCurrencySymbol(currency)
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""

  if (abs >= 1_000_000) {
    const val = abs / 1_000_000
    return `${sign}${symbol}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`
  }
  if (abs >= 1_000) {
    const val = abs / 1_000
    return `${sign}${symbol}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}k`
  }
  return `${sign}${symbol}${abs.toLocaleString()}`
}

const formatFullCurrency = (amount: number, currency?: string) => {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${amount.toLocaleString()}`
}

export default function HomeView({ analytics }: HomeViewProps) {
  const currentYear = new Date().getFullYear()
  const yearOptions = useMemo(
    () => [currentYear, currentYear - 1, currentYear - 2],
    [currentYear]
  )

  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteType, setInviteType] = useState<"USER" | "CARE_GIVER">("USER")
  const [monthsFilter, setMonthsFilter] = useState<string>("6")
  const [yearFilter, setYearFilter] = useState<string>(String(currentYear))
  const [currencyFilter, setCurrencyFilter] = useState<"ALL" | "NGN" | "USD">("ALL")

  const {
    data: graphsResponse,
    isLoading: isGraphsLoading,
    isFetching: isGraphsFetching,
  } = useGetAdminGraphsAnalytics({
    months: Number(monthsFilter),
    year: Number(yearFilter),
    ...(currencyFilter !== "ALL" ? { currency: currencyFilter } : {}),
  })

  const { data: notificationsData, isLoading: isNotificationsLoading } =
    useGetAdminNotifications({ limit: 4 })
  const notifications = notificationsData?.data || []

  const patientGrowthSeries = useMemo(() => {
    const rawSeries = graphsResponse?.data?.patientGrowth?.series ?? []
    const includeYear = rawSeries.length > 12
    return rawSeries.map((point) => ({
      name: includeYear
        ? `${point.month} '${String(point.year).slice(-2)}`
        : point.month,
      fullLabel: `${point.month} ${point.year}`,
      patients: point.totalPatients,
      newPatients: point.newPatients,
    }))
  }, [graphsResponse])

  const revenueOverviewSeries = useMemo(() => {
    const rawQuarters = graphsResponse?.data?.revenueOverview?.quarters ?? []
    return rawQuarters.map((q) => ({
      name: q.quarter,
      Revenue: q.revenue,
      Refunds: q.refunds,
    }))
  }, [graphsResponse])

  const activeCurrency = graphsResponse?.data?.revenueOverview?.currency ?? currencyFilter
  const hasPatientGrowth = patientGrowthSeries.some(
    (point) => point.patients > 0 || point.newPatients > 0
  )
  const hasRevenueOverview = revenueOverviewSeries.some(
    (point) => point.Revenue > 0 || point.Refunds > 0
  )
  const hasRefunds = revenueOverviewSeries.some((point) => point.Refunds > 0)
  const hasNotifications = notifications.length > 0

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Top Header Section */}
      <div>
        <h1 className="text-4xl tracking-tight font-dm-san-regular font-semibold text-body-text">
          Dashboard Overview
        </h1>
        <p className="text-body-text font-dm-san-medium mt-2 text-sm">
          Real-time clinical and financial status.
        </p>
      </div>

      {/* KPI metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Patients */}
        <Card className="border-none shadow-none bg-primary-light rounded-[8px] flex flex-col justify-between py-6 px-6">
          <div className="flex flex-col gap-4">
            <span className="text-body-text font-sans text-sm font-semibold">
              Total Patients
            </span>
            <div className="text-2xl font-semibold text-body-text font-dm-san-regular tracking-tight">
              {analytics.totalPatients.toLocaleString()}
            </div>
          </div>
        </Card>

        {/* Total Caregivers */}
        <Card className="border-none shadow-none bg-primary-light rounded-[8px] flex flex-col justify-between py-6 px-6">
          <div className="flex flex-col gap-4">
            <span className="text-body-text font-sans text-sm font-semibold">
              Total Caregivers
            </span>
            <div className="text-2xl font-semibold text-body-text font-dm-san-regular tracking-tight">
              {analytics.totalCaregivers.toLocaleString()}
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="border-none shadow-none bg-primary-light rounded-[8px] flex flex-col justify-between py-6 px-6">
          <div className="flex flex-col gap-4">
            <span className="text-body-text font-sans text-sm font-semibold">
              Total Revenue
            </span>
            <div className="text-2xl font-semibold text-body-text font-dm-san-regular tracking-tight">
              {formatCompactCurrency(analytics.totalRevenue)}
            </div>
          </div>
        </Card>

        {/* Expired Subscriptions */}
        <Card className="border-none shadow-none bg-primary-light rounded-[8px] flex flex-col justify-between py-6 px-6">
          <div className="flex flex-col gap-4">
            <span className="text-body-text font-sans text-sm font-semibold">
              Expired Subscriptions
            </span>
            <div className="text-2xl font-semibold text-body-text font-dm-san-regular tracking-tight">
              {analytics.totalExpiredPatient.toLocaleString()}
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Layout: Patient Growth & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Growth Card */}
        <Card className="border-none shadow-2xs bg-white p-6 rounded-[8px] lg:col-span-2 flex flex-col justify-between min-h-105">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-body-text font-sans">
              Patient Growth
            </h2>
            <Select
              value={monthsFilter}
              onValueChange={(val) => {
                if (val) setMonthsFilter(val)
              }}
            >
              <SelectTrigger className="w-31.25 font-sans font-medium text-sm text-body-text bg-white border border-zinc-200 shadow-none">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">1 Year</SelectItem>
                <SelectItem value="24">2 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isGraphsLoading ? (
            <div className="h-64 flex items-end gap-4 pt-6 px-2 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton
                    className="w-full rounded-t-md bg-zinc-100"
                    style={{ height: `${30 + ((i * 17) % 55)}%` }}
                  />
                  <Skeleton className="h-3 w-8 rounded-sm bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : hasPatientGrowth ? (
            <div
              className={cn(
                "w-full flex-1 min-h-75 transition-opacity",
                isGraphsFetching && "opacity-60"
              )}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={patientGrowthSeries}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="patientColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3AC485" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3AC485" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tick={{ fill: "#71717a", fontSize: 13, fontFamily: "sans-serif" }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    tick={{ fill: "#71717a", fontSize: 13, fontFamily: "sans-serif" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload
                        return (
                          <div className="border border-active-border bg-active-btn font-dm-san-regular p-4 rounded-[8px] shadow-lg">
                            <p className="text-body-text font-normal text-sm mb-2">
                              {item.fullLabel}
                            </p>
                            <p className="text-body-text font-normal text-base">
                              Total Patients{" "}
                              <span className="font-bold">
                                {item.patients.toLocaleString()}
                              </span>
                            </p>
                            <p className="text-body-text/80 font-normal text-xs mt-1">
                              New Patients{" "}
                              <span className="font-semibold">
                                +{item.newPatients.toLocaleString()}
                              </span>
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#3AC485"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#patientColor)"
                    activeDot={{ r: 6, fill: "#3AC485", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-2">
              <div className="text-base font-bold text-body-text font-sans">
                No data available yet
              </div>
              <div className="text-sm text-body-text font-sans max-w-xs">
                Data will appear once patients are onboarded
              </div>
            </div>
          )}
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-none shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-105">
          <div>
            <h2 className="text-lg font-bold text-body-text font-sans mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              {/* Invite Family Member */}
              <Button
                onClick={() => {
                  setInviteType("USER")
                  setIsInviteOpen(true)
                }}
                className="w-full flex items-center justify-start gap-3 pl-4 bg-pending-border hover:bg-pending-border/75 text-primary-color h-14.5 rounded-[8px] border-2 border-dashed border-primary-color transition-all outline-none cursor-pointer"
              >
                <IconPlus className="size-5" />
                <span className="font-semibold font-dm-san-regular text-sm tracking-wider">
                  Invite Family Member
                </span>
              </Button>

              {/* Invite Caregiver */}
              <Button
                onClick={() => {
                  setInviteType("CARE_GIVER")
                  setIsInviteOpen(true)
                }}
                className="w-full flex items-center justify-start gap-3 pl-4 bg-pending-btn hover:bg-pending-btn text-body-text font-semibold h-14.5 rounded-[8px] border-2 border-dashed border-primary-color transition-all outline-none cursor-pointer"
              >
                <IconPlus className="size-5 text-body-text" />
                <span className="font-semibold font-dm-san-regular text-sm tracking-wider">
                  Invite Caregiver
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Layout: Revenue Overview & Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview */}
        <Card className="border-none shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-115">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <h2 className="text-2xl font-medium text-body-text font-dm-san-regular">
              Revenue Overview
            </h2>
            <div className="flex items-center gap-2">
              <Select
                value={currencyFilter}
                onValueChange={(val) => {
                  if (val === "ALL" || val === "NGN" || val === "USD") {
                    setCurrencyFilter(val)
                  }
                }}
              >
                <SelectTrigger className="w-24 font-sans font-medium text-xs text-body-text bg-white border border-zinc-200 shadow-none">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={yearFilter}
                onValueChange={(val) => {
                  if (val) setYearFilter(val)
                }}
              >
                <SelectTrigger className="w-24 font-sans font-medium text-xs text-body-text bg-white border border-zinc-200 shadow-none">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((yr) => (
                    <SelectItem key={yr} value={String(yr)}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isGraphsLoading ? (
            <div className="h-72 flex items-end gap-6 pt-6 px-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <Skeleton
                    className="w-8 rounded-t-md bg-zinc-100"
                    style={{ height: `${40 + i * 15}%` }}
                  />
                  <Skeleton className="h-3 w-8 rounded-sm bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : hasRevenueOverview ? (
            <div
              className={cn(
                "w-full flex-1 min-h-75 transition-opacity",
                isGraphsFetching && "opacity-60"
              )}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueOverviewSeries}
                  margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                  barGap={8}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    tick={{ fill: "#71717a", fontSize: 13, fontFamily: "sans-serif" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                    tickFormatter={(value) =>
                      formatCompactCurrency(Number(value), activeCurrency)
                    }
                    tick={{ fill: "#71717a", fontSize: 13, fontFamily: "sans-serif" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="border border-zinc-200 bg-white p-3 rounded-xl shadow-md font-sans">
                            <p className="text-zinc-500 text-xs mb-1">
                              {label} {yearFilter}
                            </p>
                            {payload.map((item, idx) => (
                              <p
                                key={idx}
                                className="text-sm font-semibold text-body-text"
                              >
                                <span
                                  className="inline-block size-2 rounded-full mr-2"
                                  style={{ backgroundColor: item.color }}
                                />
                                {item.name}:{" "}
                                <span className="font-bold">
                                  {formatFullCurrency(
                                    Number(item.value ?? 0),
                                    activeCurrency
                                  )}
                                </span>
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    align="left"
                    height={40}
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{
                      paddingBottom: 20,
                      marginLeft: 20,
                      fontFamily: "sans-serif",
                      fontSize: 13,
                      color: "#71717a",
                    }}
                  />
                  <Bar
                    dataKey="Revenue"
                    fill="#648FCC"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  {hasRefunds && (
                    <Bar
                      dataKey="Refunds"
                      fill="#F0C630"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-2">
              <div className="text-base font-bold text-body-text font-sans">
                No revenue data yet
              </div>
            </div>
          )}
        </Card>

        {/* Recent Notifications */}
        <Card className="border-none shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-115">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-body-text font-dm-san-regular">
              Recent Notifications
            </h2>
            <Link
              href="/dashboard/notifications"
              className="text-xs font-bold text-body-text font-sans hover:underline cursor-pointer"
            >
              View All
            </Link>
          </div>

          {isNotificationsLoading ? (
            <div className="flex-1 flex flex-col gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-zinc-50 border border-zinc-100 p-4 rounded-[8px] space-y-3 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-40 rounded bg-zinc-200/70" />
                    <Skeleton className="h-5 w-20 rounded-full bg-zinc-200/70" />
                  </div>
                  <Skeleton className="h-4 w-full rounded bg-zinc-100" />
                  <Skeleton className="h-4 w-2/3 rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : hasNotifications ? (
            <div className="flex-1 flex flex-col gap-4">
              {notifications.map((item) => (
                <Link
                  key={item.id}
                  href="/dashboard/notifications"
                  className={cn(
                    "bg-secondary-light hover:bg-secondary-light/90 transition-colors p-4 rounded-[8px] flex justify-between items-start gap-4 cursor-pointer",
                    !item.is_read
                      ? "border-l-2 border-primary-color"
                      : "border-l-2 border-transparent"
                  )}
                >
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-body-text font-dm-san-regular text-base">
                        {item.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-secondary-color bg-secondary-light text-secondary-color font-dm-san-regular font-medium px-2 py-1 text-xs rounded-full shadow-none"
                      >
                        {NOTIFICATION_CATEGORY_LABELS[item.category] ||
                          item.category}
                      </Badge>
                    </div>
                    <p className="text-body-text font-dm-san-regular text-sm line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  <span className="text-body-text font-dm-san-regular text-xs pt-1 select-none font-normal shrink-0">
                    {formatNotificationTime(item.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-2">
              <div className="text-base font-bold text-body-text font-sans">
                No activity recorded yet
              </div>
            </div>
          )}
        </Card>
      </div>

      <InviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        type={inviteType}
      />
    </div>
  )
}
