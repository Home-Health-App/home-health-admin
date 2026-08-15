"use client"

import React, { useState, useMemo } from "react"
import { IconPlus, IconTrash, IconMessageOff } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export interface SubscriptionPlan {
  id: number
  name: string
  category: string
  staffingLevel: string
  tier: "Bronze" | "Silver" | "Gold" | "Diamond"
  monthlyRate: number
  yearlyRate: number
  benefits: string[]
}

interface PlansListViewProps {
  plans: SubscriptionPlan[]
  onCreatePlan: () => void
  onEditPlan: (id: number) => void
  onDeletePlan: (id: number) => void
}

const CATEGORIES = [
  "Elderly Care",
  "Special Health Conditions",
  "Pediatric (Special Needs)",
  "Post-surgery Recovery",
  "Pre & Post Natal Care",
]

const TIER_COLORS = {
  Bronze: "text-[#A16207]",
  Silver: "text-zinc-500",
  Gold: "text-yellow-600",
  Diamond: "text-cyan-600",
}

export default function PlansListView({
  plans,
  onCreatePlan,
  onEditPlan,
  onDeletePlan,
}: PlansListViewProps) {
  const [activeCategory, setActiveCategory] = useState("Elderly Care")
  const [rateType, setRateType] = useState<"Monthly" | "Yearly">("Monthly")

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
          className="flex h-9.5 items-center gap-1.5 rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] px-5 text-xs font-semibold font-dm-san-regular text-white transition-colors cursor-pointer border-none shadow-none outline-hidden self-start sm:self-center"
        >
          Create New Plan
        </Button>
      </div>

      {/* Navigation Category Tabs and Rate Type Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-[6px] text-xs font-dm-san-regular transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-[#648FCC] text-white font-normal shadow-xs"
                    : "text-body-text hover:text-zinc-800 bg-transparent"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {filteredPlans.length > 0 && (
          <div className="self-end md:self-auto">
            <Select value={rateType} onValueChange={(val) => setRateType(val as "Monthly" | "Yearly")}>
              <SelectTrigger className="h-9.5 rounded-lg border border-zinc-200 bg-white font-dm-san-regular text-xs font-normal text-body-text focus:ring-0 w-[120px] shadow-none">
                <SelectValue placeholder="Billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="Monthly">Monthly</SelectItem>
                <SelectItem className="font-dm-san-regular font-normal text-xs" value="Yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filteredPlans.length > 0 ? (
        <div className="border border-zinc-200/60 rounded-[8px] overflow-hidden bg-white shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
            {filteredPlans.map((plan) => {
              const tierColor = TIER_COLORS[plan.tier] || "text-body-text"
              const rate = rateType === "Monthly" ? plan.monthlyRate : plan.yearlyRate
              const rateSuffix = rateType === "Monthly" ? "/month" : "/year"

              return (
                <div key={plan.id} className="p-6 flex flex-col justify-between min-h-[500px]">
                  <div className="space-y-4">
                    {/* Header Tier Title */}
                    <div>
                      <h3 className={`text-base font-semibold font-dm-san-regular ${tierColor}`}>
                        {plan.tier} Tier
                      </h3>
                      <div className="mt-2.5 flex items-baseline">
                        <span className="text-3xl font-semibold font-dm-san-regular text-body-text">
                          ${rate}
                        </span>
                        <span className="text-xs font-normal font-dm-san-regular text-zinc-400 ml-1">
                          {rateSuffix}
                        </span>
                      </div>
                      <p className="text-xs font-normal font-dm-san-regular text-zinc-400 mt-1">
                        {plan.staffingLevel}
                      </p>
                    </div>

                    {/* Benefits Checklist */}
                    <ul className="space-y-3 pt-3">
                      {plan.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-xs font-normal font-dm-san-regular text-body-text leading-relaxed">
                          <svg
                            className="size-4 shrink-0 stroke-[2.5] stroke-zinc-800 mr-2 mt-0.5"
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
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-5 mt-6">
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 hover:bg-red-50 rounded-[6px] outline-hidden cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                    >
                      <IconTrash className="size-5" />
                    </button>

                    <Button
                      onClick={() => onEditPlan(plan.id)}
                      variant="outline"
                      className="rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 px-8 h-9 cursor-pointer shadow-none transition-colors"
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
          <div className="p-4 bg-zinc-50 rounded-full mb-5">
            <IconMessageOff className="size-11 text-zinc-400 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-body-text mb-1.5 font-dm-san-regular">
            You don't have any plan added
          </h2>
          <p className="text-sm font-normal text-zinc-500 max-w-sm mb-6 leading-relaxed font-dm-san-regular">
            Data will appear once you add a new plan
          </p>
          <Button
            onClick={onCreatePlan}
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-6.5 h-10 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            Create New Plan
          </Button>
        </div>
      )}
    </div>
  )
}
