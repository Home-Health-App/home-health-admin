'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function Home() {
  const router = useRouter();
  return (
    <div className='w-full h-screen flex justify-center items-center bg-zinc-50 text-[DM-San-Regular]'>
      <Button className={'font-dm-san-bold'} onClick={() => router.push('/dashboard/home')}>Home</Button>
    </div>
  )
}

export default Home