"use client"

import React, { useState, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { useAtomValue } from "jotai"
import { authAtom } from "@/states/auth.atom"
import {
  useGetAdminNotifications,
  useMarkNotificationsRead,
  useDeleteNotification,
} from "@/hooks/notification.hook"
import {
  INotification,
  NotificationCategory,
  NOTIFICATION_CATEGORIES,
  GetAdminNotificationsQueryParams,
} from "@/types/notification.type"
import NotificationCard from "./notification-card"
import { NotificationCardsSkeleton } from "./notifications-skeleton"
import DeleteNotificationModal from "@/components/modal/delete-notification-modal"
import { toast } from "sonner"

export default function NotificationsView() {
  const auth = useAtomValue(authAtom)
  const adminId = auth?.admin?.id

  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedCategories, setSelectedCategories] = useState<NotificationCategory[]>([])
  const [page, setPage] = useState<number>(1)
  const limit = 20

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [selectedNotificationForDelete, setSelectedNotificationForDelete] = useState<INotification | null>(null)

  // Build query params for GET /notification/admin
  const queryParams: GetAdminNotificationsQueryParams = useMemo(() => {
    const p: GetAdminNotificationsQueryParams = {
      page,
      limit,
      // user_id: adminId,
    }
    if (activeTab === "unread") {
      p.is_read = false
    }
    if (selectedCategories.length === 1) {
      p.category = selectedCategories[0]
    }
    return p
  }, [adminId, page, limit, activeTab, selectedCategories])

  const {
    data: responseData,
    isLoading,
  } = useGetAdminNotifications(queryParams, { enabled: !!adminId })

  const { mutate: markRead, isPending: isMarkingRead } = useMarkNotificationsRead()
  const { mutate: deleteNotif, isPending: isDeleting } = useDeleteNotification()

  // Local state overlay for optimistic read toggling
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({})

  // Handle category checkbox toggles
  const handleCategoryToggle = (category: NotificationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
    setPage(1)
  }

  // Extract notifications list from API response
  const rawNotifications: INotification[] = useMemo(() => {
    if (!responseData?.data) return []
    if (Array.isArray(responseData.data)) return responseData.data
    if (Array.isArray((responseData.data as any)?.notifications)) {
      return (responseData.data as any).notifications
    }
    return []
  }, [responseData])

  // Apply read overrides
  const notifications: INotification[] = useMemo(() => {
    return rawNotifications.map((n) => ({
      ...n,
      is_read: readOverrides[n.id] !== undefined ? readOverrides[n.id] : n.is_read,
    }))
  }, [rawNotifications, readOverrides])

  // Filter by multiple selected categories if more than 1 category selected
  const filteredNotifications = useMemo(() => {
    if (selectedCategories.length <= 1) return notifications
    return notifications.filter((n) => selectedCategories.includes(n.category))
  }, [notifications, selectedCategories])

  const unreadNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => !n.is_read)
  }, [filteredNotifications])

  // Mark single alert as read via PATCH /notification/mark-read
  const handleMarkAsRead = (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return
    setReadOverrides((prev) => ({ ...prev, [id]: true }))
    markRead(
      { notification_ids: [id] },
      {
        onSuccess: () => {
          toast.success("Notification marked as read")
        },
        onError: () => {
          toast.error("Failed to mark notification as read")
        },
      }
    )
  }

  // Mark all as read via PATCH /notification/mark-read
  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) return

    const overrides: Record<string, boolean> = {}
    unreadIds.forEach((id) => {
      overrides[id] = true
    })
    setReadOverrides(overrides)

    markRead(
      { notification_ids: unreadIds },
      {
        onSuccess: () => {
          toast.success("All notifications marked as read")
        },
        onError: () => {
          toast.error("Failed to mark all notifications as read")
        },
      }
    )
  }

  // Trigger confirmation modal for delete
  const handleDeleteClick = (notification: INotification, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNotificationForDelete(notification)
    setIsDeleteModalOpen(true)
  }

  // Confirm delete via DELETE /notification/{id}
  const handleConfirmDelete = () => {
    if (!selectedNotificationForDelete) return
    deleteNotif(selectedNotificationForDelete.id, {
      onSuccess: () => {
        toast.success("Notification deleted successfully")
        setIsDeleteModalOpen(false)
        setSelectedNotificationForDelete(null)
      },
      onError: () => {
        toast.error("Failed to delete notification")
      },
    })
  }

  const totalCount = responseData?.pagination?.total ?? notifications.length
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight font-dm-san-medium text-heading-text">
          Notification Center
        </h1>
        <p className="text-body-text/60 font-dm-san-regular mt-1 text-sm">
          Review and manage clinical alerts.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val)
          setPage(1)
        }}
        orientation="vertical"
        className="w-full flex flex-col md:flex-row gap-8 items-start"
      >
        {/* Left Column Sidebar (Vertical Tabs & Filter checkboxes) */}
        <div className="w-full md:w-64 space-y-6 shrink-0">
          {/* Vertical tabs options */}
          <TabsList variant="default" className="flex flex-col gap-1 w-full bg-transparent p-0 border-none justify-start shrink-0">
            <TabsTrigger
              value="all"
              className="w-full justify-start text-base font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light data-active:text-body-text text-body-text transition-all flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
            >
              <span>All Notifications</span>
              <span className="size-5 bg-secondary-color text-white text-[10px] font-bold font-dm-san-bold rounded-full flex items-center justify-center shrink-0 ml-auto">
                {totalCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="w-full justify-between text-base font-normal font-dm-san-regular py-3.5 px-4.5 rounded-[8px] border-none data-active:bg-primary-light data-active:text-primary-color text-body-text transition-all flex items-center shadow-none bg-transparent outline-hidden cursor-pointer"
            >
              <span>Unread</span>
              <span className="size-5 bg-primary-color text-white text-[10px] font-bold font-dm-san-bold rounded-full flex items-center justify-center shrink-0 ml-auto">
                {unreadCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="h-px bg-border-light my-2" />

          {/* Filter Categories list */}
          <div className="space-y-4 px-1">
            <h3 className="text-base font-normal text-heading-text tracking-wide font-dm-san-regular block uppercase">
              Filter by Categories
            </h3>
            <div className="space-y-3">
              {NOTIFICATION_CATEGORIES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-3 cursor-pointer group">
                  <Input
                    type="checkbox"
                    checked={selectedCategories.includes(value)}
                    onChange={() => handleCategoryToggle(value)}
                    className="size-7 rounded-[8px] border-zinc-300 accent-primary-color cursor-pointer"
                  />
                  <span className="text-base font-normal text-body-text font-dm-san-regular group-hover:text-primary-color transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Contents workspace */}
        <div className="flex-1 w-full bg-transparent min-h-112.5 relative">
          {/* Mark all as read link */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingRead}
              className="absolute top-0 right-0 text-sm font-bold font-dm-san-medium text-primary-color hover:underline cursor-pointer z-10 disabled:opacity-50"
            >
              Mark all as read
            </button>
          )}

          {/* All Notifications List */}
          <TabsContent value="all" className="mt-0 outline-hidden pt-8 space-y-4">
            {isLoading ? (
              <NotificationCardsSkeleton count={4} />
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            ) : (
              <div className="text-center py-24 space-y-2">
                <h3 className="text-lg font-bold font-dm-san-bold text-heading-text">
                  No Notifications
                </h3>
                <p className="text-sm text-body-text/60 font-dm-san-regular">
                  You're all caught up. Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Unread Notifications List */}
          <TabsContent value="unread" className="mt-0 outline-hidden pt-8 space-y-4">
            {isLoading ? (
              <NotificationCardsSkeleton count={3} />
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            ) : (
              <div className="text-center py-24 space-y-1.5 flex flex-col justify-center items-center h-full min-h-[300px]">
                <h3 className="text-xl font-bold font-dm-san-bold text-heading-text block">
                  No Notifications
                </h3>
                <p className="text-xs text-body-text/60 font-dm-san-regular leading-relaxed block">
                  You're all caught up. Check back later for updates.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Pagination Controls if multiple pages */}
          {responseData?.pagination && responseData.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-6 border-t border-border-light mt-4">
              <span className="text-sm font-dm-san-regular text-body-text">
                Showing page {page} of {responseData.pagination.totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="size-8.5 flex items-center justify-center rounded-full border border-zinc-300 bg-white text-body-text hover:bg-secondary-light transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none outline-hidden"
                >
                  <IconChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(responseData.pagination.totalPages, p + 1))}
                  disabled={page >= responseData.pagination.totalPages}
                  className="size-8.5 flex items-center justify-center rounded-full border border-zinc-300 bg-white text-body-text hover:bg-secondary-light transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none outline-hidden"
                >
                  <IconChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <DeleteNotificationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  )
}
