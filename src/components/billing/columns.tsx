import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { BillingItem } from "./billing-overview"

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
      <span className="inline-block border border-[#648FCC] bg-[#F4F7FC] px-2.5 py-0.5 text-xs font-normal rounded-full font-dm-san-regular text-[#1B335B] select-none">
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
      let classes = "border-[#22C55E] bg-[#DCFCE7] text-[#15803D]"
      if (status === "Expired") {
        classes = "border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C]"
      } else if (status === "Grace Period") {
        classes = "border-[#EAB308] bg-[#FEF9C3] text-[#A16207]"
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
  {
    id: "actions",
    header: "Action",
    meta: { align: "left" },
    cell: () => (
      <button
        onClick={(e) => e.stopPropagation()}
        className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors"
      >
        <IconDots className="size-5 text-zinc-400" />
      </button>
    ),
  },
]
