import React, { PropsWithChildren } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from '@/components/dashboard/app-sidebar'
import Navbar from '@/components/dashboard/navbar'

function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <div className='w-full h-screen bg-zinc-50 flex flex-row overflow-hidden'>
                <div>
                    <AppSidebar />
                </div>
                <div className='flex-1 flex flex-col h-full overflow-hidden'>
                    <Navbar />
                    <main className='flex-1 overflow-y-auto bg-secondary-light pt-6 px-12'>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout