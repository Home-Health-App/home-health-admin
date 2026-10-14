"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/libs/utils"
import { IconDots } from "@tabler/icons-react"
import { formatNotificationTime } from "@/libs/helper"
import {
  INotification,
  NOTIFICATION_CATEGORY_LABELS,
} from "@/types/notification.type"

interface NotificationCardProps {
  notification: INotification
  onMarkAsRead?: (id: string, isRead: boolean) => void
  onDeleteClick: (notification: INotification, e: React.MouseEvent) => void
}

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDeleteClick,
}: NotificationCardProps) {
  const patientName =
    notification.user &&
    notification.user.type !== "CARE_GIVER" &&
    notification.user_type !== "CARE_GIVER"
      ? `${notification.user.first_name || ""} ${notification.user.last_name || ""}`.trim()
      : null

  const caregiverName =
    notification.user &&
    (notification.user.type === "CARE_GIVER" || notification.user_type === "CARE_GIVER")
      ? `${notification.user.first_name || ""} ${notification.user.last_name || ""}`.trim()
      : null

  const adminName = notification.admin
    ? `${notification.admin.first_name || ""} ${notification.admin.last_name || ""}`.trim()
    : null

  return (
    <div
      onClick={() => onMarkAsRead?.(notification.id, notification.is_read)}
      className={cn(
        "bg-white rounded-[12px] p-6 shadow-2xs relative cursor-pointer transition-all space-y-3 font-dm-san-regular group",
        !notification.is_read && "border-l-4 border-l-primary-color"
      )}
    >
      {/* Top Header: Title and Three-dots Popover */}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold font-dm-san-bold text-heading-text tracking-tight">
          {notification.title}
        </h3>

        <div onClick={(e) => e.stopPropagation()}>
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label="Notification options"
                  className="p-1 hover:bg-secondary-light rounded-md text-body-text/70 hover:text-heading-text transition-colors cursor-pointer outline-hidden flex items-center justify-center"
                >
                  <IconDots className="size-5" />
                </button>
              }
            />
            <PopoverContent
              align="end"
              sideOffset={4}
              className="w-auto min-w-[170px] bg-white border border-border-light rounded-[8px] p-1 shadow-md z-50 select-none"
            >
              <button
                type="button"
                onClick={(e) => onDeleteClick(notification, e)}
                className="w-full text-left text-sm font-dm-san-medium text-error hover:bg-warning-btn rounded-md px-3 py-2 cursor-pointer transition-colors outline-hidden block"
              >
                Delete Notification
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Subtitle Row: Time and Category Badge */}
      <div className="flex items-center gap-2.5 text-sm text-body-text/70 font-dm-san-regular">
        <span>{formatNotificationTime(notification.created_at)}</span>
        <Badge
          variant="outline"
          className="border-secondary-color bg-secondary-light text-secondary-color font-dm-san-regular font-normal px-2.5 py-0.5 text-xs rounded-full shadow-none"
        >
          {NOTIFICATION_CATEGORY_LABELS[notification.category] || notification.category}
        </Badge>
      </div>

      {/* Message Body */}
      <p className="text-sm text-body-text leading-relaxed font-dm-san-regular font-normal">
        {notification.message}
      </p>
    </div>
  )
}
