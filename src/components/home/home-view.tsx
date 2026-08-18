"use client"

import React, { useState } from "react"
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { CONTENT_STATE_DATA } from "./mock-data"
import { Button } from "../ui/button"
import InviteModal from "@/components/shared/invite-modal"

export default function HomeView() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteType, setInviteType] = useState<"USER" | "CARE_GIVER">("USER")

  // To test empty states, you can swap CONTENT_STATE_DATA with EMPTY_STATE_DATA
  const data = CONTENT_STATE_DATA

  // Determine availability of data lists
  const hasPatientGrowth = data.patientGrowth && data.patientGrowth.length > 0
  const hasRevenueOverview = data.revenueOverview && data.revenueOverview.length > 0
  const hasNotifications = data.notifications && data.notifications.length > 0

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
              {data.kpis.totalPatients}
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
              {data.kpis.totalCaregivers}
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
              {data.kpis.totalRevenue}
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
              {data.kpis.expiredSubscriptions}
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
            {hasPatientGrowth && (
              <Select defaultValue="6-months">
                <SelectTrigger className="w-31.25 font-sans font-medium text-sm text-body-text bg-white border border-zinc-200 shadow-none">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {hasPatientGrowth ? (
            <div className="w-full flex-1 min-h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.patientGrowth}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="patientColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                    domain={[900, 1300]}
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
                            <p className="text-[#080807] font-normal text-sm mb-3">{item.name}</p>
                            <p className="text-[#080807] font-normal text-base">
                              Total Patients <span className="font-bold">{item.labelVal}</span>
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
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#patientColor)"
                    activeDot={{ r: 6, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
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
                <span className="font-semibold font-dm-san-regular text-sm tracking-wider">Invite Family Member</span>
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
                <span className="font-semibold font-dm-san-regular text-sm tracking-wider">Invite Caregiver</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Layout: Revenue Overview & Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Overview */}
        <Card className="border-none shadow-none bg-white p-6 rounded-[8px] flex flex-col justify-between min-h-115">
          <div>
            <h2 className="text-2xl font-medium text-body-text font-dm-san-regular mb-6">
              Revenue Overview
            </h2>
          </div>

          {hasRevenueOverview ? (
            <div className="w-full flex-1 min-h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.revenueOverview}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
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
                    tickFormatter={(value) => `$${value}k`}
                    tick={{ fill: "#71717a", fontSize: 13, fontFamily: "sans-serif" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="border border-zinc-200 bg-white p-3 rounded-xl shadow-md font-sans">
                            <p className="text-zinc-500 text-xs mb-1">Quarterly Values</p>
                            {payload.map((item, idx) => (
                              <p key={idx} className="text-sm font-semibold text-body-text">
                                <span
                                  className="inline-block size-2 rounded-full mr-2"
                                  style={{ backgroundColor: item.color }}
                                />
                                {item.name}: <span className="font-bold">${item.value}k</span>
                              </p>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    position='insideTopLeft'
                    align="left"
                    height={40}
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{
                      paddingBottom: 20,
                      marginLeft: 20,
                      marginBottom: 60,
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
                  <Bar
                    dataKey="Refunds"
                    fill="#F0C630"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
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
            {hasNotifications && (
              <button className="text-xs font-bold text-body-text font-sans hover:underline cursor-pointer">
                View All
              </button>
            )}
          </div>

          {hasNotifications ? (
            <div className="flex-1 flex flex-col gap-4">
              {data.notifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-secondary-light hover:bg-secondary-light/90 transition-colors p-4 rounded-[8px] flex justify-between items-start gap-4 border-l-2 border-primary-color"
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
                        {item.label}
                      </Badge>
                    </div>
                    <p className="text-body-text font-dm-san-regular text-sm line-clamp-2">
                      {item.snippet}
                    </p>
                  </div>
                  <span className="text-body-text font-dm-san-regular text-xs pt-1 select-none font-normal">
                    {item.time}
                  </span>
                </div>
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
