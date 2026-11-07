"use client"

import React from "react"
import { DataTable } from "@/components/shared/data-table"
import { columns, LinkedPatient } from "./columns"
import { IconLoader2 } from "@tabler/icons-react"

interface LinkedPatientsTableProps {
  data?: LinkedPatient[]
  isLoading?: boolean
}

export default function LinkedPatientsTable({
  data,
  isLoading = false,
}: LinkedPatientsTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-zinc-200/60 p-8 flex items-center justify-center gap-2 text-body-text/70 text-sm font-dm-san-regular">
        <IconLoader2 className="size-4 animate-spin text-primary-color" />
        <span>Loading linked patients...</span>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={data || []}
      pageSize={10}
      isPaginated={false}
    />
  )
}
