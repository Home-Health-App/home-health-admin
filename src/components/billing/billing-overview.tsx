"use client"

import React, { useState, useMemo } from "react"
import { IconChevronRight, IconUsers, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"
import { getBillingColumns } from "./columns"
import { useRouter } from "next/navigation"
import InviteModal from "@/components/shared/invite-modal"

export interface BillingItem {
  id: string
  patient: string
  category: string
  tier: string
  status: "Active" | "Expired" | "Grace Period"
  renewalDate: string
}

interface BillingOverviewProps {
  onSelectPatient: (patientName: string) => void
  onManagePlans: () => void
  billingItems?: BillingItem[]
}

const MOCK_BILLING: BillingItem[] = [
  // {
  //   id: "12345678",
  //   patient: "Dean Winchester",
  //   category: "Elderly Care",
  //   tier: "Bronze",
  //   status: "Active",
  //   renewalDate: "Aug. 5 2026",
  // },
  // {
  //   id: "87654321",
  //   patient: "John Winchester",
  //   category: "Special Health",
  //   tier: "Diamond",
  //   status: "Active",
  //   renewalDate: "Aug. 5 2026",
  // },
  // {
  //   id: "11223344",
  //   patient: "Mary Winchester",
  //   category: "Pediatric",
  //   tier: "Gold",
  //   status: "Grace Period",
  //   renewalDate: "Aug. 5 2026",
  // },
  // {
  //   id: "55667788",
  //   patient: "Jody Mills",
  //   category: "Post-surgery",
  //   tier: "Silver",
  //   status: "Active",
  //   renewalDate: "Aug. 5 2026",
  // },
  // {
  //   id: "99001122",
  //   patient: "Bubby Mane",
  //   category: "Pre & Post Natal",
  //   tier: "Diamond",
  //   status: "Expired",
  //   renewalDate: "Aug. 5 2026",
  // },
]

export default function BillingOverview({
  onSelectPatient,
  onManagePlans,
  billingItems = MOCK_BILLING,
}: BillingOverviewProps) {
  const [timeframe, setTimeframe] = useState("30 Days")
  const [selectedTier, setSelectedTier] = useState("All Tiers")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  const router = useRouter()
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const isEmpty = billingItems.length === 0

  // Filter list
  const filteredBilling = useMemo(() => {
    if (isEmpty) return []
    return billingItems.filter((item) => {
      const matchesTier = selectedTier === "All Tiers" || item.tier === selectedTier
      const matchesCategory = selectedCategory === "All Categories" || item.category.toLowerCase().includes(selectedCategory.toLowerCase().replace(" care", "").split(" ")[0])
      const matchesStatus = selectedStatus === "All Statuses" || item.status === selectedStatus
      return matchesTier && matchesCategory && matchesStatus
    })
  }, [billingItems, isEmpty, selectedTier, selectedCategory, selectedStatus])

  const columns = useMemo(() => {
    return getBillingColumns({ onSelectPatient })
  }, [onSelectPatient])

  const handleInviteFamily = () => {
    setIsInviteOpen(true)
  }

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Billing Overview
          </h1>
          <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
            Manage family members and their access to patient records.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button
            onClick={() => router.push("/dashboard/billing/manage-plans")}
            className="flex h-9.5 items-center gap-1.5 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden"
          >
            Manage Subscription plans
          </Button>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-[#648FCC]/10 border border-zinc-200/50 rounded-[8px] p-6 shadow-3xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold font-dm-san-regular text-body-text">
              Revenue
            </span>
            <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
              <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text border border-zinc-300 rounded-[6px] bg-white w-20 shadow-none focus:ring-0">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="30 Days">30 days</SelectItem>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-2xl font-bold font-dm-san-regular text-body-text mt-3">
            {isEmpty ? "$0" : "$42,500"}
          </div>
        </div>

        {/* Card 2: Refunds */}
        <div className="bg-[#648FCC]/10 border border-zinc-200/50 rounded-[8px] p-6 shadow-3xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold font-dm-san-regular text-body-text">
              Refunds
            </span>
            <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
              <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text border border-zinc-300 rounded-[6px] bg-white w-20 shadow-none focus:ring-0">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="30 Days">30 days</SelectItem>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Time">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-2xl font-bold font-dm-san-regular text-body-text">
              {isEmpty ? "$0" : "$350"}
            </span>
            <IconChevronRight className="size-5 text-zinc-400" />
          </div>
        </div>

        {/* Card 3: Billing Health */}
        <div className="bg-[#648FCC]/10 border border-zinc-200/50 rounded-[8px] p-6 shadow-3xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold font-dm-san-regular text-body-text">
              Billing Health
            </span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-zinc-200/80 text-center mt-3 pt-1">
            <div>
              <div className="text-lg font-bold font-dm-san-regular text-body-text">
                {isEmpty ? "0" : "1000"}
              </div>
              <span className="text-3xs font-normal font-dm-san-regular text-zinc-400">
                Active
              </span>
            </div>
            <div>
              <div className="text-lg font-bold font-dm-san-regular text-[#C93B3B]">
                {isEmpty ? "0" : "6"}
              </div>
              <span className="text-3xs font-normal font-dm-san-regular text-zinc-400">
                Expired
              </span>
            </div>
            <div>
              <div className="text-lg font-bold font-dm-san-regular text-body-text">
                {isEmpty ? "0" : "12"}
              </div>
              <span className="text-3xs font-normal font-dm-san-regular text-zinc-400">
                Grace Period
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Billing Table Pane */}
      {!isEmpty ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-3">
            <h2 className="text-2xl font-semibold font-dm-san-regular text-body-text">
              Billing
            </h2>

            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* Timeframe Select */}
              <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
                <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[110px] shadow-none">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="30 Days">30 Days</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Time">All Time</SelectItem>
                </SelectContent>
              </Select>

              {/* Tiers Select */}
              <Select value={selectedTier} onValueChange={(val) => setSelectedTier(val!)}>
                <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[110px] shadow-none">
                  <SelectValue placeholder="Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Tiers">All Tiers</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Bronze">Bronze</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Silver">Silver</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Gold">Gold</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>

              {/* Categories Select */}
              <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val!)}>
                <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[140px] shadow-none">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Categories">All Categories</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Elderly">Elderly Care</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Special">Special Health</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Pediatric">Pediatric</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Post-surgery">Post-surgery</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Pre">Pre & Post Natal</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Select */}
              <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val!)}>
                <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[120px] shadow-none">
                  <SelectValue placeholder="Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Statuses">All Statuses</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Active">Active</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Expired">Expired</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Grace Period">Grace Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredBilling}
            pageSize={5}
            isPaginated={true}
            onRowClick={(row) => onSelectPatient(row.id)}
          />
        </div>
      ) : (
        /* Empty Payments state (Image 1 layout) */
        <div className="flex flex-col items-center justify-center py-28 text-center bg-white border border-zinc-200/60 rounded-[8px] shadow-3xs font-dm-san-regular">
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconUsers className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-body-text mb-2 font-dm-san-regular">
            No Payment has been made yet
          </h2>
          <p className="text-sm font-normal text-zinc-500 max-w-md mb-6 leading-relaxed font-dm-san-regular px-6">
            You haven't invited any family members yet, so no payments have been made. Once you invite them and they begin making payments, you'll see the details here.
          </p>
          <Button
            onClick={handleInviteFamily}
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-6.5 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Invite Family Member
          </Button>
        </div>
      )}

      <InviteModal
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        type="USER"
      />
    </div>
  )
}
