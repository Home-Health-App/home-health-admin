import { ColumnDef } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { AdminUser } from "./admin-users-tab"
import { PermissionItem } from "./admin-roles-tab"

interface ColumnsProps {
  activeDropdown: string | null
  onToggleDropdown: (id: string) => void
  onAction: (action: string, user: AdminUser) => void
  onCloseDropdown: () => void
}

export const getAdminUsersColumns = ({
  activeDropdown,
  onToggleDropdown,
  onAction,
  onCloseDropdown,
}: ColumnsProps): ColumnDef<AdminUser>[] => [
  {
    accessorKey: "name",
    header: "Name",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text truncate max-w-[150px] block">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
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
                  onClick={() => onAction("Change Role", user)}
                  className="px-4 py-2 text-left hover:bg-zinc-50 text-body-text w-full cursor-pointer outline-hidden"
                >
                  Change Role
                </button>
                <div className="h-px bg-zinc-100 my-1.5 w-full" />
                <button
                  onClick={() => onAction("Remove User", user)}
                  className="px-4 py-2 text-left hover:bg-zinc-50 text-red-500 w-full cursor-pointer outline-hidden"
                >
                  Remove User
                </button>
              </div>
            </>
          )}
        </div>
      )
    },
  },
]

export const getAdminRolesColumns = (): ColumnDef<PermissionItem>[] => [
  {
    accessorKey: "section",
    header: "Sections",
    meta: { align: "left" },
    cell: ({ getValue }) => (
      <span className="text-sm font-dm-san-regular font-normal text-body-text">
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "hasAccess",
    header: "Access",
    meta: { align: "center" },
    cell: () => (
      <input
        type="checkbox"
        defaultChecked
        className="size-5 rounded-[4px] border border-zinc-300 accent-[#0B1E3F] cursor-pointer"
      />
    ),
  },
]
