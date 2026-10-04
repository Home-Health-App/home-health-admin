"use client"

import React from "react"
import { cn } from "@/libs/utils"

export type Step = 1 | 2 | 3

interface PatientStepperProps {
  currentStep: Step
  onStepClick?: (step: Step) => void
  className?: string
}

export default function PatientStepper({
  currentStep,
  onStepClick,
  className,
}: PatientStepperProps) {
  const steps: { number: Step; label: string }[] = [
    { number: 1, label: "Patient" },
    { number: 2, label: "Medical" },
    { number: 3, label: "Plan" },
  ]

  return (
    <div
      className={cn(
        "flex items-center justify-between mb-10 px-2 max-w-5xl mx-auto",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCurrentOrPassed = currentStep >= step.number
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={step.number}>
            {/* Step Node */}
            <div
              className={cn(
                "flex flex-col items-center",
                onStepClick && step.number < currentStep ? "cursor-pointer" : ""
              )}
              onClick={() => {
                if (onStepClick && step.number < currentStep) {
                  onStepClick(step.number)
                }
              }}
            >
              <div
                className={cn(
                  "size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCurrentOrPassed
                    ? "bg-[#0B1F41] text-white"
                    : "bg-zinc-200 text-zinc-500"
                )}
              >
                {step.number}
              </div>
              <span className="text-xs font-semibold text-[#1E1E1E] mt-1.5 font-sans">
                {step.label}
              </span>
            </div>

            {/* Connecting Line between steps */}
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 -mt-4 transition-colors",
                  currentStep > step.number ? "bg-[#0B1F41]" : "bg-zinc-300"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
