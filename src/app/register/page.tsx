"use client"

import { Suspense } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import RegisterForm from "@/components/forms/register-form"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#F1F4F9] overflow-hidden select-none py-12 px-4">
      {/* Background Stylized Waves (Matching Image Mockup Curves) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <img
          src="/auth-bg.png"
          alt=""
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
      </div>

      <div className="relative z-10 w-full max-w-155 flex flex-col items-center">
        <Suspense
          fallback={
            <IconLoader2 className="size-8 text-[#0B1E3F] animate-spin" />
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
