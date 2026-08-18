"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { PlanType, CreatePlanType, PlanCategory, PlanTier } from "@/types/billing.type"

interface PlanFormViewProps {
  planToEdit?: PlanType | null
  onSave: (plan: CreatePlanType & { id?: string }) => void
  onCancel: () => void
}

const CATEGORY_MAP: Record<PlanCategory, string> = {
  Elderly_Care: "Elderly Care",
  Special_Health_Condition: "Special Health Condition",
  Pediatric_Care: "Pediatric (Special Needs)",
  Post_surgery_Recovery_Care: "Post-surgery Recovery",
  Pre_Post_Natal_Care: "Pre & Post Natal Care",
}

const CATEGORY_KEYS = Object.keys(CATEGORY_MAP) as PlanCategory[]

const TIERS: PlanTier[] = ["Bronze", "Silver", "Gold", "Diamond"]

export default function PlanFormView({
  planToEdit,
  onSave,
  onCancel,
}: PlanFormViewProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<PlanCategory>("Elderly_Care")
  const [tier, setTier] = useState<PlanTier>("Bronze")
  const [price, setPrice] = useState("50000")
  const [priceInUsd, setPriceInUsd] = useState("50")
  
  // Coverage checklist state
  const [coverage, setCoverage] = useState<string[]>([])
  const [newCoverageItem, setNewCoverageItem] = useState("")

  // Load existing plan details if editing
  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name)
      setCategory(planToEdit.category)
      setTier(planToEdit.tier)
      setPrice(planToEdit.price.toString())
      setPriceInUsd(planToEdit.price_in_usd.toString())
      setCoverage(planToEdit.coverage)
    } else {
      setName("")
      setCategory("Elderly_Care")
      setTier("Bronze")
      setPrice("50000")
      setPriceInUsd("50")
      setCoverage([
        "Weekly doctor visit",
        "24/7 Nurse support",
        "Vital signs monitoring",
      ])
    }
  }, [planToEdit])

  const handleAddCoverageItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoverageItem.trim()) return
    if (!coverage.includes(newCoverageItem.trim())) {
      setCoverage((prev) => [...prev, newCoverageItem.trim()])
    }
    setNewCoverageItem("")
  }

  const handleRemoveCoverageItem = (idx: number) => {
    setCoverage((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: planToEdit?.id,
      name: name.trim() || `${tier} Tier Plan`,
      category,
      tier,
      price: parseFloat(price) || 0,
      price_in_usd: parseFloat(priceInUsd) || 0,
      coverage,
    })
  }

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Header title */}
      <div>
        <h1 className="text-4xl font-semibold tracking-tight font-dm-san-regular text-body-text">
          {planToEdit ? "Edit Subscription Plan" : "Create New Subscription Plan"}
        </h1>
        {!planToEdit && (
          <p className="text-sm font-normal font-dm-san-regular text-body-text mt-1.5">
            Define pricing, tier levels, and coverage benefits for a new subscription
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-dm-san-regular">
        
        {/* SECTION 1: Plan Details */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
            Plan Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Plan Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-body-text">
                Name
              </label>
              <Input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white w-full text-body-text placeholder:text-zinc-400"
              />
            </div>

            {/* Plan Category select */}
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-body-text">
                Category
              </label>
              <Select value={category} onValueChange={(val) => setCategory(val as PlanCategory)}>
                <SelectTrigger className="h-11 rounded-[8px] border border-zinc-300 bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-full shadow-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CATEGORY_KEYS.map((catKey) => (
                    <SelectItem key={catKey} className="font-dm-san-regular font-normal text-sm" value={catKey}>
                      {CATEGORY_MAP[catKey]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing Rules */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
            Pricing Rules
          </h2>

          {/* Tier Radios List matching mockup precisely */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold font-dm-san-regular text-body-text">
              Choose Tier
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              {TIERS.map((t) => {
                const isSelected = tier === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className="flex items-center gap-2 cursor-pointer outline-hidden select-none"
                  >
                    {isSelected ? (
                      <div className="size-5 rounded-full bg-[#0B1E3F] flex items-center justify-center text-white border border-transparent shadow-xs">
                        <svg
                          className="size-3.5 stroke-[3.5] stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="size-5 rounded-full border border-zinc-300 bg-white" />
                    )}
                    <span className="text-sm font-normal font-dm-san-regular text-body-text">
                      {t}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rate inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-body-text">
                Base Price (NGN)
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-normal text-body-text">
                Price (USD)
              </label>
              <Input
                type="number"
                value={priceInUsd}
                onChange={(e) => setPriceInUsd(e.target.value)}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Coverage Benefits */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
            Coverage Benefits
          </h2>

          {/* Add Benefit bar */}
          <div className="space-y-1.5">
            <label className="text-sm font-normal text-body-text">
              Add Coverage
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Coverage description"
                value={newCoverageItem}
                onChange={(e) => setNewCoverageItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCoverageItem(e)
                  }
                }}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white flex-1 text-body-text placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={handleAddCoverageItem}
                className="rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 px-8 h-11 cursor-pointer transition-colors outline-hidden shadow-none flex items-center justify-center"
              >
                Add
              </button>
            </div>
          </div>

          {/* Checklist with check icon and remove handlers */}
          <div className="space-y-3 pt-2">
            {coverage.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm font-dm-san-regular font-normal text-body-text group"
              >
                <div className="flex items-start leading-relaxed pr-4">
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
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCoverageItem(idx)}
                  className="text-red-500 hover:text-red-600 font-normal text-xs transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}

            {coverage.length === 0 && (
              <p className="text-sm font-normal text-zinc-400 italic pt-2">
                No benefits added. Add at least one benefit to this plan.
              </p>
            )}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-6 mt-8">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="rounded-full border border-zinc-300 bg-white font-dm-san-regular font-semibold text-xs text-body-text hover:bg-zinc-50 px-8 h-11 cursor-pointer transition-colors shadow-none"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="rounded-full bg-[#0B1E3F] hover:bg-[#1B335B] text-white font-dm-san-regular font-semibold text-xs px-8 h-11 border-none shadow-none cursor-pointer outline-hidden transition-colors"
          >
            {planToEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </div>

      </form>
    </div>
  )
}
