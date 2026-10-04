import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { AdminUserType } from "@/types/admin.type"

interface ColumnsProps {
  activeDropdown: string | null
  onToggleDropdown: (id: string) => void
  onAction: (action: string, user: AdminUserType) => void
  onCloseDropdown: () => void
}

export const getAdminUsersColumns = ({
  activeDropdown,
  onToggleDropdown,
  onAction,
  onCloseDropdown,
}: ColumnsProps): ColumnDef<AdminUserType>[] => [
  {
    accessorKey: "name",
    header: "Name",
    meta: { align: "left" },
    cell: ({ row }) => {
      const user = row.original
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin"
      return (
        <span className="text-sm font-dm-san-regular font-medium text-body-text">
          {fullName}
        </span>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text truncate max-w-[200px] block">
        {(getValue() as string) || "-"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { align: "left" },
    cell: ({ row }) => {
      const user = row.original
      const roleName = user.role?.name
        ? user.role.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Admin"
      return (
        <span className="text-sm font-dm-san-regular font-normal text-body-text">
          {roleName}
        </span>
      )
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const g = (getValue() as string) || ""
      return (
        <span className="text-sm font-dm-san-regular font-normal text-body-text capitalize">
          {g ? g.toLowerCase() : "-"}
        </span>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    meta: { align: "left" },
    cell: ({ getValue }) => {
      const val = getValue() as string
      if (!val) return <span className="text-sm font-dm-san-regular text-body-text">-</span>
      try {
        const d = new Date(val)
        return (
          <span className="text-sm font-dm-san-regular font-normal text-body-text">
            {d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )
      } catch {
        return <span className="text-sm font-dm-san-regular text-body-text">-</span>
      }
    },
  },
  {
    id: "actions",
    header: "Action",
    meta: { align: "left" },
    cell: ({ row }) => {
      const user = row.original
      const isDropdownOpen = activeDropdown === user.id
      return (
        <div className="relative">
          <button
            onClick={() => onToggleDropdown(user.id)}
            className="p-1 hover:bg-zinc-100 rounded-[6px] outline-hidden cursor-pointer transition-colors"
          >
            <IconDots className="size-5 text-zinc-400" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={onCloseDropdown}
              />
              <div className="absolute right-6 top-10 w-[160px] bg-white border border-zinc-200 rounded-[8px] shadow-lg py-2.5 z-50 flex flex-col font-dm-san-regular text-sm font-normal select-none">
                <button
                  onClick={() => onAction("Edit Admin", user)}
                  className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden font-normal"
                >
                  Edit Admin
                </button>
              </div>
            </>
          )}
        </div>
      )
    },
  },
]

