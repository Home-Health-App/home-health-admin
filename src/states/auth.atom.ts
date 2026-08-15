import { atomWithStorage, createJSONStorage } from "jotai/utils"
import type { AuthType, Admin } from "@/types/auth.type"

const storage = createJSONStorage<AuthType | null>(() => {
  if (typeof window === "undefined") {
    return localStorage
  }

  return window.localStorage
})

export const authAtom = atomWithStorage<AuthType | null>(
  "auth_user",
  null,
  storage
)