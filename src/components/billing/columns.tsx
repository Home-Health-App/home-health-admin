import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { BillingItem } from "./billing-overview"
import { cn } from "@/libs/utils"

interface ColumnsProps {
  onSelectPatient: (patientName: string) => void
}

export const getBillingColumns = ({ onSelectPatient }: ColumnsProps): ColumnDef<BillingItem>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Care Category",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "tier",
    header: "Tier",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className={cn("inline-block border border-secondary-color bg-secondary-light px-2.5 py-0.5 text-xs font-normal rounded-full font-dm-san-regular text-primary-color select-none",
        getValue() === "Diamond" && "bg-[#98B7DD]",
        getValue() === "Gold" && "bg-[#B3CBE6]"

      )}>
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const status = getValue() as string
      let classes = "border-[#3AC485] bg-[#EEF7F3] text-[#0A432C]"
      if (status === "Expired") {
        classes = "border-[#C43A3A] bg-[#F7EEEE] text-[#430D0A]"
      } else if (status === "Grace Period") {
        classes = "border-[#F0C630] bg-[#FBF7EA] text-[#4D4000]"
      }
      return (
        <span className={`inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full font-dm-san-regular ${classes} select-none`}>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "renewalDate",
    header: "Renewal Date",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
]
