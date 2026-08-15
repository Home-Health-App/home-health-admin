"use client"


import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Patient } from "../mock-data"

export const columns: ColumnDef<Patient>[] = [
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
    cell: ({ getValue }) => (
      <span className="text-body-text text-sm font-sans">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "subscription",
    header: "Subscription",
    meta: { align: "center" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      let badgeClass = ""
      if (val === "Active") {
        badgeClass = "bg-active-btn text-active-border border-active-border"
      } else if (val === "Grace Period") {
        badgeClass = "bg-pending-btn text-pending-border border-pending-border"
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
    cell: ({ row }) => {
      const patient = row.original

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
            <PopoverContent className="w-fit min-w-52 p-4 bg-white border border-zinc-200 rounded-xl shadow-md flex flex-col gap-0 z-50">
              <Link
                href={`/dashboard/patients/${patient.id}`}
                className="w-full text-left text-base font-normal rounded-md px-2 py-3 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-sans block"
              >
                View Patient Details
              </Link>
              <button className="w-full text-left text-base font-normal rounded-md px-2 py-3 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-sans">
                Unassign Caregiver
              </button>
              <button className="w-full text-left text-base font-normal rounded-md px-2 py-3 hover:bg-body-text/10 text-body-text cursor-pointer outline-hidden font-sans">
                Message Family Member
              </button>
              <div className="h-px bg-zinc-100" />
              <button className="w-full text-left text-sm font-normal px-2 py-3 hover:bg-warning-btn hover:text-[#C43A3A] rounded-md text-error cursor-pointer outline-hidden font-sans">
                Archive Patient
              </button>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
]
