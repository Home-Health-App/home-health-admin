"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { PlanType, CreatePlanType, PlanCategory, PlanTier } from "@/types/billing.type"
import { useForm } from "@/hooks/use-form"
import { useGetPlanCategories, useGetPlanTiers } from "@/hooks/billing.hook"
import { z } from "zod/v4"
import { Controller } from "react-hook-form"
import { cn } from "@/libs/utils"
import { IconLoader2 } from "@tabler/icons-react"


interface PlanFormProps {
  planToEdit?: PlanType | null
  onSave: (plan: CreatePlanType & { id?: string }) => void
  onCancel: () => void,
  isLoading: boolean
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

const planFormSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  category: z.string().min(1, "Plan category is required"),
  tier: z.string().min(1, "Plan tier is required"),
  price: z.string().min(1, "Price is required"),
  price_in_usd: z.string().min(1, "USD price is required"),
})

export default function PlanForm({
  planToEdit,
  onSave,
  onCancel,
  isLoading
}: PlanFormProps) {
  // Query live categories and tiers
  const { data: categoriesResponse } = useGetPlanCategories()
  const { data: tiersResponse } = useGetPlanTiers()

  const categories = categoriesResponse?.data || CATEGORY_KEYS
  const tiers = tiersResponse?.data || TIERS

  const formatCategoryLabel = (category: string) => {
    return CATEGORY_MAP[category as PlanCategory] || category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Coverage checklist state
  const [coverage, setCoverage] = useState<string[]>([])
  const [newCoverageItem, setNewCoverageItem] = useState("")
  const [coverageError, setCoverageError] = useState("")

  // Form Hook
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    schema: planFormSchema,
    defaultValues: {
      name: "",
      category: "Elderly_Care",
      tier: "Silver",
      price: "",
      price_in_usd: "",
    },
  })

  // Watch tier to sync selected button UI
  const watchedTier = watch("tier")

  // Load existing plan details if editing
  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        category: planToEdit.category,
        tier: planToEdit.tier,
        price: planToEdit.price.toString(),
        price_in_usd: planToEdit.price_in_usd.toString(),
      })
      setCoverage(planToEdit.coverage)
    } else {
      reset()
      setCoverage([])
    }
    setCoverageError("")
  }, [planToEdit, reset])

  const handleAddCoverageItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoverageItem.trim()) return
    if (!coverage.includes(newCoverageItem.trim())) {
      setCoverage((prev) => {
        const next = [...prev, newCoverageItem.trim()]
        if (next.length > 0) setCoverageError("")
        return next
      })
    }
    setNewCoverageItem("")
  }

  const handleRemoveCoverageItem = (idx: number) => {
    setCoverage((prev) => {
      const next = prev.filter((_, i) => i !== idx)
      if (next.length === 0) {
        setCoverageError("At least one coverage item is required")
      }
      return next
    })
  }

  const onSubmit = handleSubmit((values) => {
    if (coverage.length === 0) {
      setCoverageError("At least one coverage item is required")
      return
    }
    onSave({
      id: planToEdit?.id,
      name: values.name.trim() || `${values.tier} Tier Plan`,
      category: values.category as PlanCategory,
      tier: values.tier as PlanTier,
      price: parseFloat(values.price) || 0,
      price_in_usd: parseFloat(values.price_in_usd) || 0,
      coverage,
    })
  })

  return (
    <div className="w-full flex items-center justify-center pb-12 select-none">
      {/* Header title */}
      <div className="w-188.5 space-y-6">
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

        <form onSubmit={onSubmit} className="space-y-8 font-dm-san-regular">
          <div className="rounded-[8px] p-6 bg-white space-y-6">
            {/* SECTION 1: Plan Details */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
                Plan Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Plan Name */}
                <Field>
                  <FieldLabel className="text-sm font-normal text-body-text">
                    Name
                  </FieldLabel>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    {...register("name")}
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text placeholder:text-zinc-400 focus:outline-hidden", errors.name ? "border-error" : "border-zinc-300")}
                  />
                  <FieldError errors={[errors.name]} />
                </Field>

                {/* Plan Category select */}
                <Field>
                  <FieldLabel className="text-sm font-normal text-body-text">
                    Category
                  </FieldLabel>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select value={formatCategoryLabel(field.value)} onValueChange={field.onChange}>
                        <SelectTrigger className={cn("!h-12 rounded-[8px] border bg-white font-dm-san-regular text-sm font-normal text-body-text focus:ring-0 focus:border-primary-color focus-visible:border-primary-color focus:outline-hidden w-full shadow-none", errors.category ? "border-error" : "border-zinc-300")}>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {categories.map((catKey) => (
                            <SelectItem key={catKey} className="font-dm-san-regular font-normal text-sm" value={catKey}>{formatCategoryLabel(catKey)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError errors={[errors.category]} />
                </Field>
              </div>
            </div>

            {/* SECTION 2: Pricing Rules */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
                Pricing Rules
              </h2>

              {/* Tier Radios List matching mockup precisely */}
              <Field className="space-y-3">
                <FieldLabel className="text-sm font-semibold font-dm-san-regular text-body-text block">
                  Choose Tier
                </FieldLabel>
                <div className="flex flex-wrap items-center gap-6">
                  {tiers.map((t) => {
                    const isSelected = watchedTier === t
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue("tier", t, { shouldValidate: true })}
                        className="flex items-center gap-2 cursor-pointer outline-hidden select-none"
                      >
                        {isSelected ? (
                          <div className="size-5 rounded-full bg-primary-color flex items-center justify-center text-white border border-transparent shadow-xs">
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
                <FieldError errors={[errors.tier]} />
              </Field>

              {/* Rate inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Base Price */}
                <Field>
                  <FieldLabel className="text-sm font-normal text-body-text">
                    Base Price (NGN)
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("price")}
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text focus:outline-hidden", errors.price ? "border-error" : "border-zinc-300")}
                  />
                  <FieldError errors={[errors.price]} />
                </Field>

                {/* Price USD */}
                <Field>
                  <FieldLabel className="text-sm font-normal text-body-text">
                    Price (USD)
                  </FieldLabel>
                  <Input
                    type="number"
                    {...register("price_in_usd")}
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white w-full text-body-text focus:outline-hidden", errors.price_in_usd ? "border-error" : "border-zinc-300")}
                  />
                  <FieldError errors={[errors.price_in_usd]} />
                </Field>
              </div>
            </div>

            {/* SECTION 3: Coverage Benefits */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-dm-san-regular text-body-text">
                Coverage Benefits
              </h2>

              {/* Add Benefit bar */}
              <Field>
                <FieldLabel className="text-sm font-normal text-body-text">
                  Add Coverage
                </FieldLabel>
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
                    className={cn("!h-12 px-4 rounded-[8px] border font-dm-san-regular text-sm font-normal focus-visible:border-primary-color focus-visible:ring-0 shadow-none bg-white flex-1 text-body-text placeholder:text-zinc-400 focus:outline-hidden", coverageError ? "border-error" : "border-zinc-300")}
                  />
                  <button
                    type="button"
                    onClick={handleAddCoverageItem}
                    className="rounded-full border border-secondary-color bg-white font-dm-san-regular font-semibold text-xs text-secondary-color hover:bg-secondary-color/10 px-8 !h-12 cursor-pointer transition-colors outline-hidden shadow-none flex items-center justify-center"
                  >
                    Add
                  </button>
                </div>
                {coverageError && <p className="text-sm font-normal text-destructive mt-1">{coverageError}</p>}
              </Field>

              {/* Checklist with check icon and remove handlers */}
              <div className="space-y-3 pt-2">
                {coverage.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm font-dm-san-regular font-normal text-body-text group"
                  >
                    <div className="flex items-start leading-relaxed pr-4">
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
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCoverageItem(idx)}
                      className="text-error hover:text-error font-normal text-xs transition-colors cursor-pointer"
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
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-6 mt-8">
            <Button
              type="submit"
              disabled={!isValid || coverage.length === 0}
              className="ml-auto  rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-dm-san-regular font-semibold text-xs px-8 h-12! border-none shadow-none cursor-pointer outline-hidden transition-colors"
            >
              {isLoading && <IconLoader2 className="animate-spin" />}
              {planToEdit ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
