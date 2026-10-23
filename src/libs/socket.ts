import { io, Socket as SocketIO } from "socket.io-client"
import Cookies from "js-cookie"

const URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://homehealthserver-production.up.railway.app"

const getToken = (): string | undefined => {
  if (typeof window === "undefined") return undefined
  return (
    Cookies.get("accesstoken") ||
    Cookies.get("access_token") ||
    localStorage.getItem("access_token") ||
    undefined
  )
}

const token = getToken()

export const Socket: SocketIO = io(URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
  autoConnect: typeof window !== "undefined",
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 200000,
  withCredentials: false,
  auth: token ? { token: `Bearer ${token}` } : undefined,
})

// Keep auth in sync if token changes or on handshake error
Socket.on("connect_error", () => {
  const latestToken = getToken()
  if (latestToken) {
    // Update auth payload for next handshake
    Socket.auth = { token: `Bearer ${latestToken}` }
  }
})

if (typeof window !== "undefined" && Socket.disconnected) {
  Socket.connect()
}

Socket.on("connect", () => {
  console.log("Socket connected:", Socket.id)
})

Socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
  // If not a manual disconnect, attempt to reconnect
  if (reason !== "io client disconnect" && typeof window !== "undefined") {
    Socket.connect()
  }
})

Socket.on("reconnect_attempt", (attempt) => {
  console.log("Socket reconnect attempt:", attempt)
})

Socket.on("reconnect", (attempt) => {
  console.log("Socket reconnected after attempts:", attempt)
})

Socket.on("reconnect_error", (error) => {
  console.error("Socket reconnect error:", error)
})

Socket.on("reconnect_failed", () => {
  console.error("Socket reconnect failed")
})

Socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error)
})

Socket.on("error", (error) => {
  console.error("Socket error:", error)
})

export default Socket
