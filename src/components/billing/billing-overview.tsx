"use client"

import React, { useState, useMemo } from "react"
import { IconChevronRight, IconUsers, IconSearch, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"
import { getBillingColumns } from "./columns"
import { useRouter } from "next/navigation"
import InviteModal from "@/components/modal/invite-modal"
import Link from "next/link"
import { useGetAdminPayments } from "@/hooks/billing.hook"
import { AdminPaymentItem } from "@/types/billing.type"

interface BillingOverviewProps {
  onSelectPatient: (patientId: string) => void
  onManagePlans?: () => void
}

export default function BillingOverview({
  onSelectPatient,
}: BillingOverviewProps) {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState("30 Days")
  const [selectedTier, setSelectedTier] = useState("All Tiers")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Fetch real payments from /payment/admin
  const { data: paymentsResponse, isPending: isPaymentsPending } = useGetAdminPayments()
  const payments: AdminPaymentItem[] = paymentsResponse?.data || []

  // Filter list
  const filteredBilling = useMemo(() => {
    return payments.filter((item) => {
      // Tier match
      const matchesTier = selectedTier === "All Tiers" || item.plan?.tier === selectedTier

      // Category match
      const categoryKey = item.plan?.category || ""
      const matchesCategory =
        selectedCategory === "All Categories" ||
        categoryKey.toLowerCase().includes(selectedCategory.toLowerCase().replace(/ care/g, "").replace(/_/g, " ").trim())

      // Status match
      const statusUpper = (item.status || "").toUpperCase()
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        (selectedStatus === "Pending" && statusUpper === "PENDING") ||
        (selectedStatus === "Active" && ["SUCCESS", "PAID", "ACTIVE"].includes(statusUpper)) ||
        (selectedStatus === "Expired" && ["EXPIRED", "FAILED"].includes(statusUpper))

      // Search match
      const search = searchQuery.trim().toLowerCase()
      const patientName = `${item.patient?.first_name || ""} ${item.patient?.last_name || ""}`.toLowerCase()
      const familyName = `${item.user?.first_name || ""} ${item.user?.last_name || ""}`.toLowerCase()
      const email = (item.user?.email || "").toLowerCase()
      const matchesSearch =
        !search ||
        patientName.includes(search) ||
        familyName.includes(search) ||
        email.includes(search)

      return matchesTier && matchesCategory && matchesStatus && matchesSearch
    })
  }, [payments, selectedTier, selectedCategory, selectedStatus, searchQuery])

  const columns = useMemo(() => {
    return getBillingColumns({ onSelectPatient })
  }, [onSelectPatient])

  const handleInviteFamily = () => {
    setIsInviteOpen(true)
  }

  const isEmpty = !isPaymentsPending && payments.length === 0

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Billing Overview
          </h1>
          <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
            Manage patient care subscriptions, billing history, and family members.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <Button
            onClick={() => router.push("/dashboard/billing/manage-plans")}
            className="flex h-9.5 items-center gap-1.5 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden"
          >
            Manage Subscription Plans
          </Button>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Revenue */}
        <div className="bg-primary-light border border-zinc-200/50 rounded-[8px] p-4 shadow-3xs flex flex-col justify-between min-h-30">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold font-dm-san-regular text-body-text">
              Revenue
            </span>
            <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
              <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text w-fit border border-[#2B2B2B] rounded-[8px] bg-white shadow-none focus:ring-0">
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
        <div className="bg-primary-light border border-border-light rounded-[8px] p-4 shadow-3xs flex flex-col justify-between min-h-30">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold font-dm-san-regular text-body-text">
              Refunds
            </span>
            <Select value={timeframe} onValueChange={(val) => setTimeframe(val!)}>
              <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text w-fit border border-[#2B2B2B] rounded-[8px] bg-white shadow-none focus:ring-0">
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
            <Link href={"/dashboard/billing/refunds"}>
              <IconChevronRight className="size-5 text-body-text" />
            </Link>
          </div>
        </div>

        {/* Card 3: Billing Health */}
        <div className="bg-primary-light border border-border-light rounded-[8px] p-4 shadow-3xs flex flex-col justify-between min-h-30">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold font-dm-san-regular text-body-text">
              Billing Health
            </span>
          </div>
          <div className="grid grid-cols-3 text-start mt-3 pt-1">
            <div className="space-y-1.5">
              <div className="text-2xl font-semibold font-dm-san-regular text-body-text">
                {isEmpty ? "0" : "1000"}
              </div>
              <span className="text-sm font-normal font-dm-san-regular text-body-text">
                Active
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl font-semibold font-dm-san-regular text-error">
                {isEmpty ? "0" : "6"}
              </div>
              <span className="text-sm font-normal font-dm-san-regular text-error">
                Expired
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-2xl font-semibold font-dm-san-regular text-body-text">
                {isEmpty ? "0" : "12"}
              </div>
              <span className="text-sm font-normal font-dm-san-regular text-body-text">
                Grace Period
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Billing Table Pane */}
      {isPaymentsPending ? (
        <div className="bg-white border border-zinc-200/80 rounded-[8px] p-16 flex flex-col items-center justify-center gap-3">
          <IconLoader2 className="size-8 text-primary-color animate-spin" />
          <span className="text-xs font-dm-san-regular text-zinc-500">
            Loading billing records...
          </span>
        </div>
      ) : !isEmpty ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3">
            <div className="relative w-full lg:w-72">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search patient, family member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs font-dm-san-regular bg-white border-zinc-200 rounded-lg shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-auto">
              {/* Tiers Select */}
              <Select value={selectedTier} onValueChange={(val) => setSelectedTier(val!)}>
                <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text w-fit border border-[#2B2B2B] rounded-[8px] bg-white shadow-none focus:ring-0">
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
                <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text w-fit border border-[#2B2B2B] rounded-[8px] bg-white shadow-none focus:ring-0">
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
                <SelectTrigger className="h-8 text-2xs font-normal font-dm-san-regular text-body-text w-fit border border-[#2B2B2B] rounded-[8px] bg-white shadow-none focus:ring-0">
                  <SelectValue placeholder="Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="All Statuses">All Statuses</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Active">Active / Paid</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Pending">Pending</SelectItem>
                  <SelectItem className="font-dm-san-regular font-normal text-xs" value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={filteredBilling}
            pageSize={10}
            isPaginated={true}
            onRowClick={(row) => onSelectPatient(row.patient_id)}
          />
        </div>
      ) : (
        /* Empty Payments state */
        <div className="flex flex-col items-center justify-center py-28 text-center bg-white border border-zinc-200/60 rounded-[8px] shadow-3xs font-dm-san-regular">
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconUsers className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-body-text mb-2 font-dm-san-regular">
            No Payment Records Found
          </h2>
          <p className="text-sm font-normal text-zinc-500 max-w-md mb-6 leading-relaxed font-dm-san-regular px-6">
            No billing transactions or subscriptions have been recorded yet. Once family members activate care plans, they will appear here.
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

