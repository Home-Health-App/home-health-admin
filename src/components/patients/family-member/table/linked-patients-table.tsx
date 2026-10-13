"use client"

import React from "react"
import { DataTable } from "@/components/shared/data-table"
import { columns, LinkedPatient } from "./columns"

export const LINKED_PATIENTS: LinkedPatient[] = [
  {
    id: "1",
    name: "Dean Winchester",
    relationship: "Brother",
    caregiver: "Angel Castiel",
    subscription: "Active",
  },
  {
    id: "2",
    name: "John Winchester",
    relationship: "Father",
    caregiver: "Bobby Singer",
    subscription: "Grace Period",
  },
  {
    id: "3",
    name: "Mary Winchester",
    relationship: "Mother",
    caregiver: "Unassigned",
    subscription: "Expired",
  },
]

interface LinkedPatientsTableProps {
  data?: LinkedPatient[]
}

export default function LinkedPatientsTable({ data }: LinkedPatientsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data && data.length > 0 ? data : LINKED_PATIENTS}
      pageSize={3}
      isPaginated={false}
    />
  )
}
