"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconLayoutGrid, IconLogout } from "@tabler/icons-react"
import { SIDEBAR_ITEMS } from "@/libs/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/libs/utils"

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      className="bg-[#0B1E3F] text-white border-none **:data-[sidebar=sidebar]:bg-[#0B1E3F] **:data-[sidebar=sidebar]:text-white **:data-[sidebar=sidebar]:border-none"
    >
      {/* Sidebar Header with Logo */}
      <SidebarHeader className="py-6 pl-12">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-wider text-white select-none">
            LOGO
          </span>
        </div>
      </SidebarHeader>

      {/* Sidebar Navigation Items */}
      <SidebarContent className="flex-1 px-6 py-2 flex flex-col justify-between">
        <SidebarMenu className="">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  className={cn(
                    "group/btn flex h-15 w-full items-center gap-4 rounded-[8px] px-4",
                    "font-semibold font-dm-san-medium",
                    "[&_svg]:size-6!",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",

                    isActive
                      ? [
                        "bg-[#1B335B]! text-white!",
                        "hover:bg-[#1B335B]! hover:text-white!",
                        "active:bg-[#1B335B]! active:text-white!",
                        "[&_a]:text-white!",
                      ]
                      : [
                        "text-white!",
                        "hover:bg-[#1B335B]/50 hover:text-white!",
                        "active:bg-[#1B335B]/50 active:text-white!",
                        "[&_a]:text-white!",
                        "[&_a:hover]:text-white!",
                      ]
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-colors",
                      isActive
                        && "text-white group-hover/btn:text-white!"
                    )}
                  />

                  <span
                    className={cn(
                      "text-base font-semibold font-dm-san-medium",
                      isActive && "text-white!"
                    )}
                  >
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* Sidebar Footer with Logout */}
      <SidebarFooter className="p-4 border-t border-[#1E2E4C]/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/logout" />}
              className={cn(
                "group/btn flex w-full items-center gap-3 rounded-lg px-4 py-2.5",
                "text-white bg-transparent!",
                "hover:text-white!",
                "active:bg-[#1B335B] active:text-white!",
                "focus:bg-transparent focus:text-white!",
                "focus-visible:bg-transparent focus-visible:text-white!",
                "focus-visible:ring-0",
                "[&_svg]:size-5!"
              )}
            >
              <IconLogout
                className={cn(
                  "text-white transition-colors",
                  "group-hover/btn:text-white"
                )}
              />

              <span className="text-base font-dm-san-medium text-white! group-hover/btn:text-white">
                Log Out
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}