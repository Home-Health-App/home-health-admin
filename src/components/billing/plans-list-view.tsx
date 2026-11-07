"use client"

import React, { useState, useMemo } from "react"
import { IconTrash, IconMessageOff, IconLoader } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanType, PlanCategory } from "@/types/billing.type"
import { cn } from "@/libs/utils"

interface PlansListViewProps {
  plans: PlanType[]
  onCreatePlan: () => void
  onEditPlan: (id: string) => void
  onDeletePlan: (id: string) => void
  isDeleting: boolean
}

const CATEGORIES_UI = [
  { key: "Elderly_Care", label: "Elderly Care" },
  { key: "Special_Health_Condition", label: "Special Health Condition" },
  { key: "Pediatric_Care", label: "Pediatric (Special Needs)" },
  { key: "Post_surgery_Recovery_Care", label: "Post-surgery Recovery" },
  { key: "Pre_Post_Natal_Care", label: "Pre & Post Natal Care" },
] as const

const TIER_COLORS = {
  Bronze: "text-pending-border",
  Silver: "text-zinc-500",
  Gold: "text-yellow-600",
  Diamond: "text-cyan-600",
}

const TIER_BORDER_COLORS = {
  Bronze: "border-pending-border",
  Silver: "border-[#6F6F6F]",
  Gold: "border-secondary-color",
  Diamond: "border-active-border",
}

export default function PlansListView({
  plans,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
  isDeleting
}: PlansListViewProps) {
  const [activeCategory, setActiveCategory] = useState<PlanCategory>("Elderly_Care")

  // Filter plans based on the active tab category
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => p.category === activeCategory)
  }, [plans, activeCategory])

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
            Manage Plans
          </h1>
          <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
            View and configure subscription tiers across health categories.
          </p>
        </div>

        <Button
          onClick={onCreatePlan}
          className="flex h-9.5 items-center gap-1.5 rounded-full bg-primary-color hover:bg-primary-color/90 px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden self-start sm:self-center"
        >
          Create New Plan
        </Button>
      </div>

      {/* Navigation Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2 w-full">
        <Tabs
          defaultValue="Elderly_Care"
          value={activeCategory}
          onValueChange={(val) => setActiveCategory(val as PlanCategory)}
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
      </div>

      {/* Main Content Area */}
      {filteredPlans.length > 0 ? (
        <div className="overflow-hidden shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const tierColor = TIER_COLORS[plan.tier] || "text-body-text"
              const tierBorderColor = TIER_BORDER_COLORS[plan.tier] || "border-zinc-200"
              const displayPrice = Number(plan.price || 0)

              return (
                <div key={plan.id} className={cn("p-6 flex flex-col justify-between min-h-125 bg-white rounded-[8px] border-l-2", tierBorderColor)}>
                  <div className="space-y-4">
                    {/* Header Tier Title */}
                    <div className="space-y-4">
                      <h3 className={`text-base font-semibold font-dm-san-regular ${tierColor}`}>
                        {plan.tier} Tier
                      </h3>
                      <div className="mt-2.5 flex flex-col gap-2">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-semibold font-dm-san-regular text-body-text">
                            ₦{displayPrice.toLocaleString()}
                          </span>
                          <span className="text-base font-normal font-dm-san-regular text-body-text ml-1">
                            /month
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-normal font-dm-san-regular text-body-text  mt-2.5">
                        {plan.name}
                      </p>
                    </div>

                    {/* Benefits Checklist */}
                    <ul className="space-y-3 pt-3">
                      {plan.coverage.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-xs font-normal font-dm-san-regular text-body-text leading-relaxed">
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
                  <div className="flex items-center justify-between pt-5 mt-6">
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 flex items-center gap-1 hover:bg-warning-btn rounded-[6px] outline-hidden cursor-pointer text-error transition-colors"
                    >
                      {isDeleting && <IconLoader className="animate-spin" />}
                      <IconTrash className="size-5" />
                    </button>

                    <Button
                      onClick={() => onEditPlan(plan.id)}
                      variant="outline"
                      className="rounded-full w-2/3 border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:text-secondary-color hover:bg-transparent px-8 h-9 cursor-pointer shadow-none transition-colors"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-zinc-200/60 rounded-[8px] shadow-3xs font-dm-san-regular">
          <div className="p-4 bg-secondary-light rounded-full mb-4">
            <IconMessageOff className="size-11 text-primary-color/60 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-body-text mb-3 font-dm-san-regular">
            You don't have any plan added
          </h2>
          <Button
            onClick={onCreatePlan}
            className="rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-sm px-6.5 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Create New Plan
          </Button>
        </div>
      )}
    </div>
  )
}
