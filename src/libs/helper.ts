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
  dateInput: string | Date | undefined | null,
  pattern: string = "MMM d, yyyy"
): string {
  if (!dateInput) return ""
  try {
    if (typeof dateInput === "string") {
      const trimmed = dateInput.trim()
      const dateMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
      if (dateMatch) {
        const year = parseInt(dateMatch[1], 10)
        const month = parseInt(dateMatch[2], 10) - 1
        const day = parseInt(dateMatch[3], 10)
        const d = new Date(year, month, day)
        if (isValid(d)) {
          return format(d, pattern)
        }
      }
    }
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (!isValid(date)) return ""
    return format(date, pattern)
  } catch {
    return ""
  }
}

/**
 * Formats a time string or Date into standard 12-hour format with AM/PM (e.g. "10:20 AM", "08:00 AM").
 * Accurately parses ISO strings (without unwanted timezone shifts on recorded times),
 * 24-hour time strings ("10:20", "14:30:00"), and existing 12-hour strings.
 */
export function formatTime(
  dateInput: string | Date | undefined | null,
  pattern: string = "hh:mm a"
): string {
  if (!dateInput) return ""

  if (typeof dateInput === "string") {
    const trimmed = dateInput.trim()
    if (!trimmed) return ""

    // 1. If already formatted like "10:20 AM" or "8:00 PM"
    const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([aApP][mM])$/)
    if (ampmMatch) {
      const h = parseInt(ampmMatch[1], 10)
      const m = ampmMatch[2]
      const period = ampmMatch[3].toUpperCase()
      const formattedH = h.toString().padStart(2, "0")
      return `${formattedH}:${m} ${period}`
    }

    // 2. Check if it's a plain 24-hour time string like "10:20", "10:20:00", "14:30:00"
    const plainTimeMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
    if (plainTimeMatch) {
      let hours = parseInt(plainTimeMatch[1], 10)
      const minutes = plainTimeMatch[2]
      const period = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12
      const formattedH = hours.toString().padStart(2, "0")
      return `${formattedH}:${minutes} ${period}`
    }

    // 3. Check if it's an ISO datetime string like "2026-09-29T10:20:00.000Z" or "2026-09-29 10:20:00"
    const isoTimeMatch = trimmed.match(/[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?/)
    if (isoTimeMatch) {
      let hours = parseInt(isoTimeMatch[1], 10)
      const minutes = isoTimeMatch[2]
      const period = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12
      const formattedH = hours.toString().padStart(2, "0")
      return `${formattedH}:${minutes} ${period}`
    }
  }

  // Fallback to Date object parsing
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (!isValid(date)) return String(dateInput)
    return format(date, pattern)
  } catch {
    return String(dateInput)
  }
}

