"use client"

import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/libs/utils"
import { IconCheck, IconMessageOff, IconLoader2 } from "@tabler/icons-react"
import { PlanType, PlanCategory } from "@/types/billing.type"
import {
  CATEGORIES_UI,
  TIER_COLORS,
  TIER_BORDER_COLORS,
  DEFAULT_COVERAGE_ITEMS,
} from "./constants"
import { PatientPlanData } from "./types"

export interface StepPlanProps {
  data: PatientPlanData
  updateData: (fields: Partial<PatientPlanData>) => void
  availablePlans: PlanType[]
  isSubmitting?: boolean
  onBack: () => void
  onSubmit: () => void
}

export default function StepPlan({
  data,
  updateData,
  availablePlans,
  isSubmitting = false,
  onBack,
  onSubmit,
}: StepPlanProps) {
  // Normalize billing cycle value to "monthly" | "yearly"
  const billingCycle = data.billingPeriod.toLowerCase() === "yearly" ? "yearly" : "monthly"

  // Filter plans based on the active tab category
  const filteredPlans = useMemo(() => {
    return availablePlans.filter(
      (p) =>
        p.category === data.selectedCategory ||
        p.category?.toLowerCase() === data.selectedCategory.toLowerCase()
    )
  }, [availablePlans, data.selectedCategory])

  return (
    <div className="w-full space-y-8 pb-12 select-none animate-in fade-in-50 duration-200">
      {/* Navigation Category Tabs and Billing Cycle Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 w-full">
        <Tabs
          defaultValue="Elderly_Care"
          value={data.selectedCategory}
          onValueChange={(val) => updateData({ selectedCategory: val as PlanCategory })}
          className="font-dm-san-regular text-sm font-normal"
        >
          <TabsList className="bg-white p-1 h-9 rounded-lg border-none flex flex-wrap gap-1">
            {CATEGORIES_UI.map((cat) => (
              <TabsTrigger
                key={cat.key}
                value={cat.key}
                className="rounded-md px-4 py-1.5 text-xs font-normal font-dm-san-regular transition-all data-active:bg-secondary-color data-active:text-white text-body-text data-active:hover:text-white shadow-none bg-transparent cursor-pointer"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div>
          <Select
            value={billingCycle}
            onValueChange={(val) => updateData({ billingPeriod: val as "monthly" | "yearly" })}
          >
            <SelectTrigger className="w-27.5 h-8! px-2.5 rounded-[6px] border border-primary-color bg-white capitalize font-dm-san-regular text-xs text-body-text focus:ring-0 focus:border-primary-color outline-hidden shadow-none cursor-pointer">
              <SelectValue placeholder="Billing Cycle" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-zinc-200 shadow-sm rounded-md p-1 min-w-27.5">
              <SelectItem
                value="monthly"
                className="font-dm-san-regular text-xs rounded-sm cursor-pointer"
              >
                Monthly
              </SelectItem>
              <SelectItem
                value="yearly"
                className="font-dm-san-regular text-xs rounded-sm cursor-pointer"
              >
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Area - Horizontally Scrollable Cards with Bigger Width */}
      {filteredPlans.length > 0 ? (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
          <div className="flex gap-6 min-w-max">
            {filteredPlans.map((plan) => {
              const isSelected = data.selectedPlanId === plan.id
              const tierColor = TIER_COLORS[plan.tier] || "text-body-text"
              const tierBorderColor = TIER_BORDER_COLORS[plan.tier] || "border-zinc-200"
              const displayPrice =
                billingCycle === "yearly"
                  ? (plan.price_in_usd || plan.price) * 12
                  : plan.price_in_usd || plan.price
              const cycleLabel = billingCycle === "yearly" ? "/year" : "/month"

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "p-6 flex flex-col justify-between min-h-125 w-[340px] sm:w-[360px] md:w-[380px] bg-white rounded-[8px] border-l-2 shadow-2xs transition-all relative font-dm-san-regular shrink-0",
                    tierBorderColor,
                    isSelected
                      ? "ring-2 ring-primary-color shadow-sm"
                      : "hover:shadow-xs"
                  )}
                >
                  <div className="space-y-4">
                    {/* Header Tier Title */}
                    <div className="space-y-4">
                      <h3
                        className={cn(
                          "text-base font-semibold font-dm-san-regular",
                          tierColor
                        )}
                      >
                        {plan.tier} Tier
                      </h3>
                      <div className="mt-2.5 flex flex-col gap-2">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-semibold font-dm-san-regular text-body-text">
                            ${displayPrice}
                          </span>
                          <span className="text-base font-normal font-dm-san-regular text-body-text ml-1">
                            {cycleLabel}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-normal font-dm-san-regular text-body-text mt-2.5">
                        {plan.name || "Caregiver"}
                      </p>
                    </div>

                    {/* Benefits Checklist */}
                    <ul className="space-y-3 pt-3">
                      {(plan.coverage && plan.coverage.length > 0
                        ? plan.coverage
                        : DEFAULT_COVERAGE_ITEMS
                      ).map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-xs font-normal font-dm-san-regular text-body-text leading-relaxed"
                        >
                          <svg
                            className="size-4 shrink-0 stroke-[2.5] stroke-body-text mr-2 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-end pt-5 mt-6">
                    <Button
                      type="button"
                      onClick={() => updateData({ selectedPlanId: plan.id })}
                      variant="outline"
                      className={cn(
                        "rounded-full w-full font-dm-san-regular font-semibold text-xs h-9 cursor-pointer shadow-none transition-colors border",
                        isSelected
                          ? "border-primary-color bg-primary-color text-white hover:bg-primary-color/90"
                          : "border-secondary-color bg-white text-secondary-color hover:bg-secondary-color/10"
                      )}
                    >
                      {isSelected ? (
                        <span className="flex items-center justify-center gap-1.5">
                          <span>Selected</span>
                          <IconCheck className="size-4 stroke-[3]" />
                        </span>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Empty State matching billing manage-plans */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-zinc-200/60 rounded-[8px] shadow-3xs font-dm-san-regular">
          <div className="p-4 bg-secondary-light rounded-full mb-4">
            <IconMessageOff className="size-11 text-primary-color/60 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-body-text mb-2 font-dm-san-regular">
            No plans available in this category
          </h2>
          <p className="text-xs text-zinc-500 font-normal">
            Please choose another category to view available subscription tiers.
          </p>
        </div>
      )}

      {/* Bottom Action Buttons: Back & Create Patients */}
      <div className="flex items-center justify-center sm:justify-end gap-4 pt-6 flex-wrap sm:flex-nowrap">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-[388px] max-w-full !h-13 rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-sm text-secondary-color hover:bg-secondary-color/10 cursor-pointer shadow-none transition-colors"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!data.selectedPlanId || isSubmitting}
          className={cn(
            "w-[388px] max-w-full !h-13 rounded-full font-dm-san-regular font-semibold text-sm transition-colors cursor-pointer border-none shadow-none outline-hidden flex items-center justify-center gap-2",
            data.selectedPlanId && !isSubmitting
              ? "bg-primary-color hover:bg-primary-color/90 text-white"
              : "bg-primary-light text-white cursor-not-allowed opacity-100"
          )}
        >
          {isSubmitting ? (
            <>
              <IconLoader2 className="size-5 animate-spin text-white" />
              <span>Creating Patient...</span>
            </>
          ) : (
            <span>Create Patients</span>
          )}
        </Button>
      </div>
    </div>
  )
}
