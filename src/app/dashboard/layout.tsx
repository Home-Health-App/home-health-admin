import React, { PropsWithChildren } from 'react'

function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <div className='w-full h-screen bg-white flex flex-row'>
            <div className='w-[25%] h-full bg-primary-color'></div>
            <div className='w-full h-full bg-white'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout