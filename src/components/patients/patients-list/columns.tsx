"use client"

import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { PatientType } from "@/types/patient.type"

export interface PatientItem {
  id: string
  name: string
  familyMember: string
  familyMemberId?: string
  caregiver: string
  subscription: string
  status: "Active" | "Inactive" | "Suspended"
  rawPatient: PatientType
}

export const columns: ColumnDef<PatientItem>[] = [
  {
    accessorKey: "name",
    header: "Patient Name",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="font-dm-san-medium font-semibold text-body-text text-sm">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "familyMember",
    header: "Family Member",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-body-text text-sm font-sans">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "caregiver",
    header: "Caregiver",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      return (
        <span
          className={`text-sm font-sans ${
            val === "Unassigned" ? "text-zinc-400 italic" : "text-body-text"
          }`}
        >
          {val}
        </span>
      )
    },
  },
  {
    accessorKey: "subscription",
    header: "Subscription",
    meta: { align: "center" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let badgeClass = ""
      if (val === "Active" || val === "Gold" || val === "Diamond") {
        badgeClass = "bg-active-btn text-active-border border-active-border"
      } else if (val === "Silver" || val === "Bronze" || val === "Grace Period") {
        badgeClass = "bg-pending-btn text-pending-border border-pending-border"
      } else if (val === "No Plan" || val === "None") {
        badgeClass = "bg-zinc-100 text-zinc-600 border-zinc-200"
      } else {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border"
      }
      return (
        <Badge
          variant="outline"
          className={`${badgeClass} font-sans font-medium px-4 py-0.5 rounded-full shadow-none text-xs`}
        >
          {val}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { align: "center" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let badgeClass = ""
      if (val === "Active") {
        badgeClass = "bg-active-btn text-active-border border-active-border"
      } else if (val === "Suspended") {
        badgeClass = "bg-red-50 text-red-500 border-red-200"
      } else {
        badgeClass = "bg-warning-btn text-warning-border border-warning-border"
      }
      return (
        <Badge
          variant="outline"
          className={`${badgeClass} font-sans font-medium px-4 py-0.5 rounded-full shadow-none text-xs`}
        >
          {val}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "center" },
    cell: ({ row, table }) => {
      const patient = row.original
      const isSuspended = patient.status === "Suspended"
      const meta = table.options.meta as {
        onAssignCaregiver?: (patient: { id: string; name: string }) => void
        onUnassignCaregiver?: (patient: PatientItem) => void
        onToggleSuspend?: (patientId: string, currentStatus: boolean) => void
      } | undefined

      return (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger
              render={
                <button className="p-1 hover:bg-zinc-100 rounded-md outline-hidden cursor-pointer">
                  <IconDots className="size-5 text-body-text opacity-70" />
                </button>
              }
            />
            <PopoverContent className="w-fit min-w-44 bg-white border border-zinc-200 rounded-[8px] shadow-xs flex flex-col gap-0.5 z-50">
              <Link
                href={`/dashboard/patients/${patient.id}`}
                className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block"
              >
                View Patient Details
              </Link>
              {patient.familyMemberId && (
                <Link
                  href={`/dashboard/messages?userId=${patient.familyMemberId}`}
                  className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block"
                >
                  Message Family Member
                </Link>
              )}
              {patient.caregiver === "Unassigned" ? (
                <Button
                  variant="ghost"
                  onClick={() =>
                    meta?.onAssignCaregiver?.({
                      id: patient.id,
                      name: patient.name,
                    })
                  }
                  className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none text-zinc-800"
                >
                  Assign Caregiver
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      meta?.onAssignCaregiver?.({
                        id: patient.id,
                        name: patient.name,
                      })
                    }
                    className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none text-zinc-800"
                  >
                    Reassign Caregiver
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => meta?.onUnassignCaregiver?.(patient)}
                    className="w-full text-left text-base font-normal rounded-md px-2 py-1 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none text-zinc-800"
                  >
                    Unassign Caregiver
                  </Button>
                </>
              )}
              <div className="h-px bg-secondary-light my-1" />
              <Button
                variant="ghost"
                onClick={() => meta?.onToggleSuspend?.(patient.id, isSuspended)}
                className={
                  isSuspended
                    ? "w-full text-left text-sm font-normal px-2 py-1 hover:bg-active-btn hover:text-[#0A432C] rounded-md text-emerald-600 cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"
                    : "w-full text-left text-sm font-normal px-2 py-1 hover:bg-warning-btn hover:text-[#C43A3A] rounded-md text-error cursor-pointer outline-hidden font-dm-san-regular block h-auto bg-transparent border-none shadow-none"
                }
              >
                {isSuspended ? "Unsuspend Patient" : "Suspend Patient"}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
