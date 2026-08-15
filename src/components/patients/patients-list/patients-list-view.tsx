"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconDownload, IconPdf, IconFileDownload } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MOCK_PATIENTS } from "../mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/shared/data-table"

export default function PatientsView() {
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [globalFilter, setGlobalFilter] = useState<string>("")

  // Filter mock data by status first, before passing it to TanStack DataTable
  const filteredData = useMemo(() => {
    return MOCK_PATIENTS.filter((patient) => {
      if (statusFilter === "All") return true
      return patient.status === statusFilter
    })
  }, [statusFilter])

  return (
    <div className="w-full pb-8">
      {/* Top Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-900">
          Patient Directory
        </h1>
        <p className="text-zinc-500 font-sans mt-1 text-sm">
          Manage and monitor all active and inactive patient records.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-8 mb-4">
        {/* Search Field */}
        <div className="relative h-14 w-full sm:w-110">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-6 text-body-text opacity-40" />
          <Input
            type="text"
            placeholder="Search Patients"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 pr-4 h-full rounded-full border border-[#A1A1A1] shadow-none font-sans text-sm focus-visible:border-[#999999] focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
          />
        </div>

        {/* Filters and Export button */}
        <div className="flex flex-wrap gap-4 items-center h-9 self-start sm:self-auto">
          {/* Status buttons */}
          <div className="flex items-center gap-2 h-full">
            <span className="text-sm font-bold text-body-text font-dm-san-regular select-none">
              Status
            </span>
            <div className="flex bg-white p-1 rounded-[8px] border border-zinc-100">
              {["All", "Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`text-sm font-normal px-3 py-1 rounded-md transition-all cursor-pointer outline-hidden ${
                    statusFilter === tab
                      ? "bg-secondary-color text-white shadow-xs"
                      : "text-body-text hover:text-black hover:bg-zinc-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Export CSV button */}
          <Button
            variant="outline"
            className="rounded-full border border-secondary-color bg-transparent shadow-none font-sans font-normal text-xs text-body-text flex items-center gap-1.5 px-4.5 h-8.5 hover:bg-zinc-50 cursor-pointer outline-hidden"
          >
            <IconFileDownload className="size-4 text-secondary-color font-bold" />
            <span className="text-secondary-color">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Directory Table component */}
      <DataTable
        columns={columns}
        data={filteredData}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        pageSize={6}
      />
    </div>
  )
}
