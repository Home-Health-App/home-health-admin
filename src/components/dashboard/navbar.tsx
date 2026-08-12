"use client"

import { IconBell, IconMessageCircle } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"

const Navbar = () => {
  return (
    <header className="py-6 w-full bg-white border-b border-zinc-100 px-16 flex items-center justify-end">
      <div className="flex items-center gap-5">
        <div className='p-0'>
          <IconMessageCircle size={24} className="cursor-pointer"/>
        </div>

         <div className='p-0'>
          <IconBell size={24} className="cursor-pointer"/>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-2">
          <Avatar size="lg" className="border-2 border-primary-color">
            <AvatarImage
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
              alt="Jane Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <span className="font-dm-san-medium font-bold text-primary-color text-base">
              Jane Doe
            </span>
            <Badge
              variant="outline"
              className="border-secondary-color bg-[#EEF2F6] text-primary-color font-dm-san-light font-medium px-2 py-1 text-xs rounded-full shadow-none select-none"
            >
              Super Admin
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar