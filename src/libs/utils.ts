import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates age in years from a date of birth string or Date object.
 * Returns null if the date is invalid or not provided.
 */
export function calculateAge(dateOfBirth?: string | Date | null): number | null {
  if (!dateOfBirth) return null
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth
  if (isNaN(dob.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return Math.max(0, age)
}
