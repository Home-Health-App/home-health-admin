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

export interface SidebarItem {
  title: string
  href: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/home",
    icon: IconLayoutGrid,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: IconUsers,
  },
  {
    title: "Caregivers",
    href: "/dashboard/caregivers",
    icon: IconHeart,
  },
  {
    title: "Assignments",
    href: "/dashboard/assignments",
    icon: IconArrowLeft,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: IconCreditCard,
  },
  {
    title: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: IconListDetails,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
  },
]
