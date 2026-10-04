import { format, formatDistanceToNow, isValid } from "date-fns"

/**
 * Formats a date/time input into a relative timestamp (e.g., "25 minutes ago", "about 2 hours ago").
 */
export function formatNotificationTime(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Time"
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (!isValid(date)) return "Time"
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return "Time"
  }
}

/**
 * Formats a date string into a standard localized date (e.g., "Sep 10, 2026").
 */
export function formatDate(
  dateInput: string | Date | undefined,
  pattern: string = "MMM d, yyyy"
): string {
  if (!dateInput) return ""
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (!isValid(date)) return ""
    return format(date, pattern)
  } catch {
    return ""
  }
}
