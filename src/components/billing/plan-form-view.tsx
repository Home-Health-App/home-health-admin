"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { SubscriptionPlan } from "./plans-list-view"

interface PlanFormViewProps {
  planToEdit?: SubscriptionPlan | null
  onSave: (plan: Omit<SubscriptionPlan, "id"> & { id?: number }) => void
  onCancel: () => void
}

const CATEGORIES = [
  "Elderly Care",
  "Special Health Conditions",
  "Pediatric (Special Needs)",
  "Post-surgery Recovery",
  "Pre & Post Natal Care",
]

const TIERS: SubscriptionPlan["tier"][] = ["Bronze", "Silver", "Gold", "Diamond"]

export default function PlanFormView({
  planToEdit,
  onSave,
  onCancel,
}: PlanFormViewProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Elderly Care")
  const [staffingLevel, setStaffingLevel] = useState("Caregiver")
  const [tier, setTier] = useState<SubscriptionPlan["tier"]>("Bronze")
  const [monthlyRate, setMonthlyRate] = useState("50")
  const [yearlyRate, setYearlyRate] = useState("500")
  
  // Benefits checklist state
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState("")

  // Load existing plan details if editing
  useEffect(() => {
    if (planToEdit) {
      setName(planToEdit.name)
      setCategory(planToEdit.category)
      setStaffingLevel(planToEdit.staffingLevel)
      setTier(planToEdit.tier)
      setMonthlyRate(planToEdit.monthlyRate.toString())
      setYearlyRate(planToEdit.yearlyRate.toString())
      setBenefits(planToEdit.benefits)
    } else {
      setName("")
      setCategory("Elderly Care")
      setStaffingLevel("Caregiver")
      setTier("Bronze")
      setMonthlyRate("50")
      setYearlyRate("500")
      setBenefits([
        "Bathing & Grooming",
        "Toilet Care & Hygiene",
        "Vital Signs Monitoring",
        "Feeding Assistance",
        "Medication Management & Reminders (Non-administered)",
        "Mobility Assistance & Fall Prevention",
      ])
    }
  }, [planToEdit])

  const handleAddBenefit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBenefit.trim()) return
    if (!benefits.includes(newBenefit.trim())) {
      setBenefits((prev) => [...prev, newBenefit.trim()])
    }
    setNewBenefit("")
  }

  const handleRemoveBenefit = (idx: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: planToEdit?.id,
      name: name.trim() || `${tier} Tier Plan`,
      category,
      staffingLevel: staffingLevel.trim() || "Caregiver",
      tier,
      monthlyRate: parseFloat(monthlyRate) || 0,
      yearlyRate: parseFloat(yearlyRate) || 0,
      benefits,
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
              <Select value={category} onValueChange={(val) => setCategory(val!)}>
                <SelectTrigger className="h-11 rounded-[8px] border border-zinc-300 bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 w-full shadow-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} className="font-dm-san-regular font-normal text-sm" value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Staffing Level */}
          <div className="space-y-1.5">
            <label className="text-sm font-normal text-body-text">
              Staffing Level
            </label>
            <Input
              type="text"
              placeholder="Staffing Level"
              value={staffingLevel}
              onChange={(e) => setStaffingLevel(e.target.value)}
              className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
            />
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
                Monthly Rate (USD)
              </label>
              <Input
                type="number"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white w-full text-body-text"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-normal text-body-text">
                Yearly Rate (USD)
              </label>
              <Input
                type="number"
                value={yearlyRate}
                onChange={(e) => setYearlyRate(e.target.value)}
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
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddBenefit(e)
                  }
                }}
                className="h-11 px-4 rounded-[8px] border border-zinc-300 font-dm-san-regular text-sm font-normal focus-visible:border-zinc-400 focus-visible:ring-0 shadow-none bg-white flex-1 text-body-text placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="rounded-full border border-[#648FCC] bg-white font-dm-san-regular font-semibold text-xs text-[#648FCC] hover:bg-[#648FCC]/10 px-8 h-11 cursor-pointer transition-colors outline-hidden shadow-none flex items-center justify-center"
              >
                Add
              </button>
            </div>
          </div>

          {/* Checklist with check icon and remove handlers */}
          <div className="space-y-3 pt-2">
            {benefits.map((benefit, idx) => (
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
                  onClick={() => handleRemoveBenefit(idx)}
                  className="text-red-500 hover:text-red-600 font-normal text-xs transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))}

            {benefits.length === 0 && (
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
