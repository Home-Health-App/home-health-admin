import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { RefundItem } from "./refunds-list-view"

interface ColumnsProps {
  onSelectRefund: (patientName: string) => void
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
}

export const getRefundsColumns = ({
  onSelectRefund,
  activeDropdown,
  setActiveDropdown,
}: ColumnsProps): ColumnDef<RefundItem>[] => [
  {
    accessorKey: "patient",
    header: "Patient",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const name = getValue() as string
      return (
        <button
          onClick={() => onSelectRefund(name)}
          className="text-sm font-dm-san-regular font-normal hover:underline text-left cursor-pointer outline-hidden text-body-text"
        >
          {name}
        </button>
      )
    },
  },
  {
    accessorKey: "refundType",
    header: "Refund Type",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text truncate max-w-[200px] block">
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
      if (status === "Pending") {
        classes = "border-[#EAB308] bg-[#FEF9C3] text-[#A16207]"
      } else if (status === "Denied") {
        classes = "border-[#EF4444] bg-[#FEE2E2] text-[#B91C1C]"
      }
      return (
        <span className={`inline-block border px-2.5 py-0.5 text-2xs font-normal rounded-full font-dm-san-regular ${classes} select-none`}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "left" },
    cell: ({ row }) => {
      const refund = row.original
      const isDropdownOpen = activeDropdown === refund.id
      return (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveDropdown(isDropdownOpen ? null : refund.id)
            }}
            className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors"
          >
            <IconDots className="size-5 text-zinc-400" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveDropdown(null)
                }}
              />
              <div className="absolute right-6 top-10 w-[170px] bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2.5 z-50 flex flex-col font-dm-san-regular text-sm font-normal select-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectRefund(refund.patient)
                    setActiveDropdown(null)
                  }}
                  className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                >
                  View Details
                </button>
              </div>
            </>
          )}
        </div>
      )
    },
  },
]
