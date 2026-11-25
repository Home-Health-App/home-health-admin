"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { IconLogout } from "@tabler/icons-react"
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
import { useSetAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { useQueryClient } from "@tanstack/react-query"
import ConfirmationModal, { useConfirmation } from "@/components/modal/confirmation-modal"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const setAuth = useSetAtom(authAtom)
  const queryClient = useQueryClient()
  const { state: confirmState, confirm, close: closeConfirm } = useConfirmation()
  const { canAccessRoute } = usePermissions()

  const visibleMenuItems = useMemo(() => {
    return SIDEBAR_ITEMS.filter((item) => canAccessRoute(item.href))
  }, [canAccessRoute])

  const handleLogout = () => {
    confirm({
      title: "Log Out",
      description: "Are you sure you want to log out of your account?",
      confirmText: "Log Out",
      variant: "danger",
      onConfirm: () => {
        setAuth(null)
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token")
          localStorage.removeItem("auth_user")
        }
        queryClient.clear()
        toast.success("Logged out successfully")
        router.push("/")
        closeConfirm()
      },
    })
  }

  return (
    <Sidebar
      className="bg-primary-color text-white border-none **:data-[sidebar=sidebar]:bg-primary-color **:data-[sidebar=sidebar]:text-white **:data-[sidebar=sidebar]:border-none"
    >
      {/* Sidebar Header with Logo */}
      <SidebarHeader className="py-6 pl-10">
        <Link href="/dashboard/home" className="flex items-center gap-2 w-fit">
          <Image
            src="/logo.png"
            alt="Home Health logo"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-contain select-none"
            priority
          />
        </Link>
      </SidebarHeader>

      {/* Sidebar Navigation Items */}
      <SidebarContent className="flex-1 px-6 py-2 flex flex-col justify-between">
        <SidebarMenu className="space-y-1">
          {visibleMenuItems.map((item) => {
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
                        "bg-primary-color! text-white!",
                        "hover:bg-primary-color/90! hover:text-white!",
                        "active:bg-primary-color! active:text-white!",
                        "[&_a]:text-white!",
                      ]
                      : [
                        "text-white!",
                        "hover:bg-primary-color/90/50 hover:text-white!",
                        "active:bg-primary-color/50 active:text-white!",
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
      <SidebarFooter className="p-4 border-t border-primary-color/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              onClick={handleLogout}
              className={cn(
                "group/btn flex w-full items-center gap-3 rounded-lg px-4 py-2.5 cursor-pointer",
                "text-white bg-transparent!",
                "hover:text-white! hover:bg-primary-color/90/50!",
                "active:bg-primary-color active:text-white!",
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

      <ConfirmationModal
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) closeConfirm()
        }}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        variant={confirmState.variant}
      />
    </Sidebar>
  )
}
