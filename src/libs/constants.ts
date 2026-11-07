import {
  IconLayoutGrid,
  IconUsers,
  IconHeart,
  IconArrowLeft,
  IconCreditCard,
  IconListDetails,
  IconSettings,
} from "@tabler/icons-react"

import React from "react"
import { Permission } from "@/types/auth.type"

export interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
  permission?: Permission
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/home",
    icon: IconLayoutGrid,
    permission: "Overview",
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: IconUsers,
    permission: "Patients",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: IconUsers,
    permission: "Users",
  },
  {
    title: "Caregivers",
    href: "/dashboard/caregivers",
    icon: IconHeart,
    permission: "Caregivers",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: IconCreditCard,
    permission: "Finance",
  },
  {
    title: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: IconListDetails,
    permission: "Admins",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
  },
]
