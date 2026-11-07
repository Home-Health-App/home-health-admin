"use client"

import { useMemo, useEffect, useCallback } from "react"
import { useAtom } from "jotai"
import { authAtom } from "@/states/auth.atom"
import { Permission } from "@/types/auth.type"
import { useGetAdmins } from "@/hooks/admin.hook"
import { useGetAdminRoles } from "@/hooks/admin-role.hook"

export const ALL_PERMISSIONS: Permission[] = [
  "Admins",
  "Users",
  "Overview",
  "Patients",
  "Plans",
  "Finance",
  "Caregivers",
]

/**
 * Resolves the primary accessible landing route based on granted permissions
 */
export const getFirstAllowedRoute = (
  permissions: Permission[] = [],
  isSuperAdmin = false
): string => {
  if (isSuperAdmin || permissions.includes("Overview")) return "/dashboard/home"
  if (permissions.includes("Patients")) return "/dashboard/patients"
  if (permissions.includes("Users")) return "/dashboard/users"
  if (permissions.includes("Caregivers")) return "/dashboard/caregivers"
  if (permissions.includes("Finance") || permissions.includes("Plans"))
    return "/dashboard/billing"
  return "/dashboard/settings"
}

export function usePermissions() {
  const [auth, setAuth] = useAtom(authAtom)
  const admin = (auth as any)?.admin || (auth as any)?.user || auth
  const adminId = admin?.id

  // Fetch admin directory and roles to keep role assignments live
  const { data: adminsResponse, isPending: loadingAdmins } = useGetAdmins(
    { limit: 100 },
    !!adminId
  )
  const { data: rolesResponse, isPending: loadingRoles } = useGetAdminRoles()

  const liveAdmin = useMemo(() => {
    if (!adminId || !adminsResponse?.data) return null
    const list = Array.isArray(adminsResponse.data) ? adminsResponse.data : []
    return list.find((a: any) => a.id === adminId) || null
  }, [adminId, adminsResponse])

  // Synchronize authAtom if role or profile changes on the backend
  useEffect(() => {
    if (liveAdmin && auth) {
      const currentRoleId = admin?.role_id || admin?.role?.id
      const liveRoleId = liveAdmin.role_id || liveAdmin.role?.id
      if (liveRoleId && liveRoleId !== currentRoleId) {
        setAuth((prev: any) => {
          if (!prev) return prev
          return {
            ...prev,
            admin: {
              ...prev.admin,
              role_id: liveRoleId,
              role: liveAdmin.role,
            },
          }
        })
      }
    }
  }, [liveAdmin, admin, auth, setAuth])

  const roles = useMemo(() => rolesResponse?.data || [], [rolesResponse])

  const effectiveRole = useMemo(() => {
    const roleId = liveAdmin?.role_id || liveAdmin?.role?.id || admin?.role_id || admin?.role?.id
    if (roleId && roles.length > 0) {
      const matched = roles.find((r) => r.id === roleId)
      if (matched) return matched
    }
    return liveAdmin?.role || admin?.role || null
  }, [liveAdmin, admin, roles])

  const rawRoleName =
    typeof effectiveRole === "string"
      ? effectiveRole
      : effectiveRole?.name || (auth as any)?.role || "super_admin"

  const isSuperAdmin = useMemo(() => {
    const nameLower = (rawRoleName || "").toLowerCase()
    return nameLower === "super_admin" || nameLower.includes("super")
  }, [rawRoleName])

  const permissions: Permission[] = useMemo(() => {
    if (isSuperAdmin) return ALL_PERMISSIONS
    if (effectiveRole && Array.isArray(effectiveRole.permissions)) {
      return effectiveRole.permissions
    }
    if (admin?.role && Array.isArray(admin.role.permissions)) {
      return admin.role.permissions
    }
    return []
  }, [isSuperAdmin, effectiveRole, admin])

  const formattedRoleName = useMemo(() => {
    return rawRoleName
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c: string) => c.toUpperCase())
  }, [rawRoleName])

  const defaultRoute = useMemo(() => {
    return getFirstAllowedRoute(permissions, isSuperAdmin)
  }, [permissions, isSuperAdmin])

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (isSuperAdmin) return true
      if (!permissions || permissions.length === 0) return false
      // Plans is folded into Finance
      if (permission === "Finance" && permissions.includes("Plans")) return true
      if (permission === "Plans" && permissions.includes("Finance")) return true
      return permissions.includes(permission)
    },
    [isSuperAdmin, permissions]
  )

  const hasAnyPermission = useCallback(
    (required: Permission[]): boolean => {
      if (isSuperAdmin) return true
      return required.some((perm) => hasPermission(perm))
    },
    [isSuperAdmin, hasPermission]
  )

  const canAccessRoute = useCallback(
    (pathname: string): boolean => {
      if (!pathname) return true
      if (isSuperAdmin) return true

      const cleanPath = pathname.split("?")[0].replace(/\/$/, "")

      if (cleanPath === "/dashboard/home" || cleanPath === "/dashboard") {
        return hasPermission("Overview")
      }
      if (cleanPath.startsWith("/dashboard/patients")) {
        return hasPermission("Patients")
      }
      if (cleanPath.startsWith("/dashboard/users")) {
        return hasPermission("Users")
      }
      if (cleanPath.startsWith("/dashboard/caregivers")) {
        return hasPermission("Caregivers")
      }
      if (cleanPath.startsWith("/dashboard/billing")) {
        return hasPermission("Finance") || hasPermission("Plans")
      }
      if (cleanPath.startsWith("/dashboard/audit-logs")) {
        return hasPermission("Admins")
      }
      if (cleanPath.startsWith("/dashboard/settings")) {
        // Settings page itself is accessible for Profile & Notifications
        return true
      }
      if (
        cleanPath.startsWith("/dashboard/messages") ||
        cleanPath.startsWith("/dashboard/notifications")
      ) {
        return true
      }

      return true
    },
    [isSuperAdmin, hasPermission]
  )

  const isLoading = (loadingAdmins && !auth) || (loadingRoles && !effectiveRole)

  return {
    permissions,
    isSuperAdmin,
    roleName: formattedRoleName,
    rawRoleName,
    hasPermission,
    hasAnyPermission,
    canAccessRoute,
    defaultRoute,
    isLoading,
  }
}
