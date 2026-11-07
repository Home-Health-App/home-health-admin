"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AccountProfileForm from "@/components/forms/account-profile-form"
import NotificationsTab from "@/components/settings/notifications-tab"
import AdminUsersTab from "@/components/settings/admin-users-tab"
import AdminRolesTab from "@/components/settings/admin-roles-tab"
import { usePermissions } from "@/hooks/use-permissions"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { hasPermission } = usePermissions()
  const canManageAdmins = hasPermission("Admins")

  // If resting on admin tabs and role changes to unauthorized, auto-revert to profile
  useEffect(() => {
    if (!canManageAdmins && (activeTab === "users" || activeTab === "roles")) {
      setActiveTab("profile")
    }
  }, [canManageAdmins, activeTab])

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          Settings
        </h1>
        <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
          Manage your platform configurations and preferences.
        </p>
      </div>

      {/* Vertical Tabs Workspace */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="w-full flex flex-col md:flex-row gap-8 items-start"
      >
        {/* Left Column Tabs Sidebar */}
        <TabsList className="flex flex-col gap-1 w-full md:w-80 bg-transparent p-0 border-none justify-start shrink-0 h-auto">
          <TabsTrigger
            value="profile"
            className="w-full justify-start text-sm font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light text-body-text hover:text-heading-text transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
          >
            Account Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start text-sm font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light data-[state=active]:text-primary-color text-body-text hover:text-heading-text transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
          >
            Notifications
          </TabsTrigger>
          {canManageAdmins && (
            <>
              <TabsTrigger
                value="users"
                className="w-full justify-start text-sm font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light data-[state=active]:text-primary-color text-body-text hover:text-heading-text transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
              >
                Admin Users
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="w-full justify-start text-sm font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light data-[state=active]:text-primary-color text-body-text hover:text-heading-text transition-all text-left flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
              >
                Admin Roles and Permissions
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Right Column Content Panel */}
        <div className="flex-1 w-full bg-white border border-zinc-200/60 rounded-[8px] p-8 shadow-2xs min-h-100">
          {/* Account Profile Content */}
          <TabsContent value="profile" className="mt-0 outline-hidden">
            <AccountProfileForm />
          </TabsContent>

          {/* Notifications Preferences Content */}
          <TabsContent value="notifications" className="mt-0 outline-hidden">
            <NotificationsTab />
          </TabsContent>

          {/* Admin Users Content (Requires Admins Permission) */}
          {canManageAdmins && (
            <>
              <TabsContent value="users" className="mt-0 outline-hidden">
                <AdminUsersTab />
              </TabsContent>

              {/* Admin Roles Content (Requires Admins Permission) */}
              <TabsContent value="roles" className="mt-0 outline-hidden">
                <AdminRolesTab />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}
