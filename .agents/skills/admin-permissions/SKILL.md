---
name: admin-permissions
description: Comprehensive guide and operational rules for role-based access control (RBAC) and permissions in Home Health Admin. Use when adding routes, guarding pages or components, managing admin roles, or configuring navigation based on admin permissions.
---

# Admin Roles & Permissions (RBAC) Skill

This skill documents and guides the role-based access control (RBAC) architecture for Home Health Admin. It defines the mapping between backend permissions, frontend routes, sidebar navigation items, conditional UI components, and real-time live permission synchronization with instant redirection.

---

## 1. Permission System Overview

Permissions are string literals defined in `src/types/auth.type.ts`:

```typescript
export type Permission =
  | "Admins"
  | "Users"
  | "Overview"
  | "Patients"
  | "Plans"
  | "Finance"
  | "Caregivers"
```

Each admin user belongs to a `Role` with an array of granted `permissions`:

```typescript
export interface Role {
  id: string
  name: string
  permissions: Permission[]
  status: "ACTIVE" | "INACTIVE" | string
}
```

### Super Admin Privileges
- An admin whose `role.name` is `"super_admin"` (or includes `"super"`) is automatically granted **all permissions**.
- Super admins bypass permission checks on all routes and components.

---

## 2. Permission to Page & Component Mapping

| Permission | Associated Routes / Pages | Sidebar Item | In-Page Components & Tabs |
| :--- | :--- | :--- | :--- |
| **`Overview`** | `/dashboard/home`, `/dashboard` | `Dashboard` (`/dashboard/home`) | Overview analytics & KPI charts |
| **`Patients`** | `/dashboard/patients`<br>`/dashboard/patients/[patientId]`<br>`/dashboard/patients/[patientId]/*` | `Patients` (`/dashboard/patients`) | Patient profile, daily logs, family members, AI reports |
| **`Users`** | `/dashboard/users`<br>`/dashboard/users/[userId]`<br>`/dashboard/users/[userId]/*` | `Users` (`/dashboard/users`) | Family member list, details, invite user modals |
| **`Caregivers`** | `/dashboard/caregivers`<br>`/dashboard/caregivers/[caregiverId]` | `Caregivers` (`/dashboard/caregivers`) | Caregiver list, credentials, certifications, patient assignments |
| **`Finance`** | `/dashboard/billing`<br>`/dashboard/billing/manage-plans`<br>`/dashboard/billing/refunds`<br>`/dashboard/billing/[patientId]` | `Billing` (`/dashboard/billing`) | "Manage Subscription Plans" button, create/edit plans, billing records |
| **`Plans`** | *Folded into `Finance`* | *Shared with Billing* | When `Finance` is granted, plan management is automatically accessible. |
| **`Admins`** | `/dashboard/audit-logs` | `Audit Logs` (`/dashboard/audit-logs`) | In `/dashboard/settings`:<br>• **Admin Users** Tab (`value="users"`)<br>• **Admin Roles and Permissions** Tab (`value="roles"`) |

> [!NOTE]
> **Settings Page Access**:
> The Settings page itself (`/dashboard/settings`) is accessible to **all authenticated admins** so they can manage their own personal **Account Profile** and **Notifications Preferences**. However, within Settings, the **Admin Users** and **Admin Roles and Permissions** tabs require the **`Admins`** permission.

---

## 3. Strict "Zero-Visibility" Rule & Instant Redirection

Admins must **never** see unauthorized pages or content:
1. **Never render unauthorized DOM**: When an admin navigates to or rests on an unauthorized URL, `<PermissionGuard>` blocks rendering of `{children}` completely (showing a loading state or nothing).
2. **Instant Redirection**: The guard immediately invokes `router.replace(firstAllowedRoute)` and displays an informational toast notification:
   `toast.error("Access restricted: Redirected to your authorized dashboard.")`
3. **Live Demotion / Role Change Handling**:
   - If an admin was resting on a page (e.g. `/dashboard/billing` or `/dashboard/users`) while an administrator changes their role to `moderator` (which only has `["Patients", "Overview"]`), the live sync detects this role change in real time.
   - The permission guard immediately detects `canAccessRoute(pathname) === false` and redirects them to their first allowed route (`/dashboard/home` or `/dashboard/patients`).
   - If resting on the `users` or `roles` tab inside Settings, the tab automatically reverts to `profile`.

---

## 4. Canonical Roles Reference

From `GET /admin-roles`:

```json
[
  {
    "name": "super_admin",
    "permissions": ["Admins", "Users", "Overview", "Patients", "Plans", "Finance", "Caregivers"]
  },
  {
    "name": "admin1",
    "permissions": ["Admins", "Overview", "Patients"]
  },
  {
    "name": "moderator",
    "permissions": ["Patients", "Overview"]
  },
  {
    "name": "patient_management",
    "permissions": ["Patients", "Caregivers"]
  }
]
```

---

## 5. First-Allowed-Route Resolution

When resolving the default/first allowed route:
```typescript
export function getFirstAllowedRoute(
  permissions: Permission[],
  isSuperAdmin = false
): string {
  if (isSuperAdmin || permissions.includes("Overview")) return "/dashboard/home"
  if (permissions.includes("Patients")) return "/dashboard/patients"
  if (permissions.includes("Users")) return "/dashboard/users"
  if (permissions.includes("Caregivers")) return "/dashboard/caregivers"
  if (permissions.includes("Finance") || permissions.includes("Plans")) return "/dashboard/billing"
  return "/dashboard/settings"
}
```

---

## 6. Developer Conventions & Hook Usage

### `usePermissions()` Hook
All components consume permissions via `@/hooks/use-permissions`:

```typescript
import { usePermissions } from "@/hooks/use-permissions"

export function MyComponent() {
  const {
    hasPermission,
    canAccessRoute,
    isSuperAdmin,
    roleName,
    permissions,
    defaultRoute,
    isLoading
  } = usePermissions()

  if (hasPermission("Finance")) {
    // Show billing or plan controls
  }
}
```

### Route Guarding in Layout
In `src/app/dashboard/layout.tsx`:

```tsx
<main className='flex-1 overflow-y-auto bg-secondary-light pt-15 px-12'>
  <ClientOnly>
    <PermissionGuard>
      {children}
    </PermissionGuard>
  </ClientOnly>
</main>
```

### Sidebar Dynamic Filtering
In `src/components/dashboard/app-sidebar.tsx`:

```tsx
const visibleMenuItems = SIDEBAR_ITEMS.filter((item) => canAccessRoute(item.href))
```

### Settings Tab Guarding
In `src/app/dashboard/settings/page.tsx`:

```tsx
const { hasPermission } = usePermissions()
const canManageAdmins = hasPermission("Admins")

// Active tab auto-fallback if role demoted while resting on admin tabs
useEffect(() => {
  if (!canManageAdmins && (activeTab === "users" || activeTab === "roles")) {
    setActiveTab("profile")
  }
}, [canManageAdmins, activeTab])
```
