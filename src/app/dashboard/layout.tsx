import React, { PropsWithChildren } from 'react'
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from '@/components/dashboard/app-sidebar'
import Navbar from '@/components/dashboard/navbar'
import { ClientOnly } from '@/components/shared/client-only'

function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <div className='w-full h-screen bg-zinc-50 flex flex-row overflow-hidden'>
                <div>
                    <AppSidebar />
                </div>
                <div className='flex-1 flex flex-col h-full overflow-hidden'>
                    <Navbar />
                    <main className='flex-1 overflow-y-auto bg-secondary-light pt-15 px-12'>
                        <ClientOnly>
                            {children}
                        </ClientOnly>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout