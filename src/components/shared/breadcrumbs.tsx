"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Breadcrumbs() {
  const pathname = usePathname()

  // Generate breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    
    // Fallback if not in subroute
    if (segments.length <= 1) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="font-sans font-bold text-zinc-900 text-sm">
            Dashboard
          </BreadcrumbPage>
        </BreadcrumbItem>
      )
    }

    const items: React.ReactNode[] = []

    // Route segments mappings to pretty human-readable titles
    const routeNames: Record<string, string> = {
      home: "Dashboard",
      patients: "Patients",
      caregivers: "Caregivers",
      assignments: "Assignments",
      billing: "Billing",
      "audit-logs": "Audit Logs",
      settings: "Settings",
      family: "Family Members",
      "ai-report": "AI Reports",
      "daily-logs": "Daily Logs",
      messages: "Messages",
      notifications: "Notifications",
      refunds: "Refunds",
      "refund-details": "Refund Details",
    }

    // Iterate segments starting after '/dashboard'
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      const prevSegment = segments[i - 1]
      const path = "/" + segments.slice(0, i + 1).join("/")
      const isLast = i === segments.length - 1

      // Stop breadcrumbs building after daily-logs
      if (prevSegment === "daily-logs") {
        break
      }

      // Resolve human-readable name:
      // 1. Check static mapping
      // 2. Check if parent was "patients" (meaning this is a dynamic patient ID)
      // 3. Check if parent was "ai-report" (meaning this is a dynamic report ID)
      // 4. Check if parent was "billing" (meaning this is a dynamic patient ID)
      // 5. Fallback to formatting the segment string directly
      let name = routeNames[segment]
      if (!name) {
        if (prevSegment === "patients") {
          name = "Patient Details"
        } else if (prevSegment === "ai-report") {
          name = "AI Health Report"
        } else if (prevSegment === "caregivers") {
          name = "Caregiver Information"
        } else if (prevSegment === "billing" && segment !== "manage-plans" && segment !== "refunds") {
          name = "Billing Details"
        } else {
          // Capitalize first letter and replace hyphens with spaces
          name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
        }
      }

      if (isLast) {
        items.push(
          <BreadcrumbItem key={path}>
            <BreadcrumbPage className="font-sans font-bold text-zinc-900 text-sm">
              {name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )
      } else {
        items.push(
          <React.Fragment key={path}>
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link href={path} />}
                className="text-[#648FCC] hover:text-[#4f73b8] font-sans font-medium text-sm transition-colors"
              >
                {name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-zinc-400 font-bold mx-1 select-none">
              ·
            </BreadcrumbSeparator>
          </React.Fragment>
        )
      }
    }

    return items
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-1">
        {getBreadcrumbs()}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
