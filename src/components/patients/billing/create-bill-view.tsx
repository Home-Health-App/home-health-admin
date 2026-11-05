"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  IconArrowLeft,
  IconCheck,
  IconSparkles,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconFileInvoice,
  IconLoader,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetPatientById } from "@/hooks/patient.hook"
import { useGetAllPlans, useGetPlanById, useCreatePaymentLink } from "@/hooks/billing.hook"
import { PlanType, PlanCategory } from "@/types/billing.type"
import { CreatePaymentLinkPayload } from "@/types/billing-link.type"
import CreateBillSkeleton from "./create-bill-skeleton"
import { toast } from "sonner"
import { cn } from "@/libs/utils"

interface CreateBillViewProps {
  patientId: string
}

const CATEGORIES_UI = [
  { key: "Elderly_Care", label: "Elderly Care" },
  { key: "Special_Health_Condition", label: "Special Health Condition" },
  { key: "Pediatric_Care", label: "Pediatric (Special Needs)" },
  { key: "Post_surgery_Recovery_Care", label: "Post-surgery Recovery" },
  { key: "Pre_Post_Natal_Care", label: "Pre & Post Natal Care" },
] as const

const TIER_COLORS: Record<string, string> = {
  Bronze: "text-pending-border",
  Silver: "text-zinc-500",
  Gold: "text-yellow-600",
  Diamond: "text-cyan-600",
}

const TIER_BORDER_COLORS: Record<string, string> = {
  Bronze: "border-pending-border",
  Silver: "border-[#6F6F6F]",
  Gold: "border-secondary-color",
  Diamond: "border-active-border",
}

export default function CreateBillView({ patientId }: CreateBillViewProps) {
  const router = useRouter()

  // Fetch patient details from backend
  const { data: patientResponse, isLoading: isPatientLoading } = useGetPatientById(patientId)
  const patient = patientResponse?.data

  const patientPlanId = patient?.plan_id || patient?.plan?.id || ""

  // Fetch specific plan details of the patient by plan_id
  const { data: patientPlanResponse } = useGetPlanById(patientPlanId)
  const patientPlanFromApi = patientPlanResponse?.data

  const currentPatientPlan = patientPlanFromApi || patient?.plan

  // Fetch real plans from backend
  const { data: plansResponse, isPending: isPlansLoading } = useGetAllPlans()
  const realPlans = plansResponse?.data || []

  // Active Category & Selected Plan
  const [activeCategory, setActiveCategory] = useState<PlanCategory>("Elderly_Care")
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const initialDefaultSet = useRef(false)

  // Default selection based on patient's current plan
  useEffect(() => {
    if (initialDefaultSet.current) return

    const targetPlanId = patient?.plan_id || patient?.plan?.id || patientPlanFromApi?.id
    const targetCategory = (patientPlanFromApi?.category || patient?.plan?.category) as PlanCategory | undefined

    if (targetPlanId) {
      // 1. If category is known from patient plan object or plan details API
      if (targetCategory && CATEGORIES_UI.some((c) => c.key === targetCategory)) {
        setActiveCategory(targetCategory)
        setSelectedPlanId(targetPlanId)
        initialDefaultSet.current = true
        return
      }

      // 2. If category is found in realPlans list
      if (realPlans.length > 0) {
        const matchingPlan = realPlans.find((p) => p.id === targetPlanId)
        if (matchingPlan) {
          if (matchingPlan.category) {
            setActiveCategory(matchingPlan.category as PlanCategory)
          }
          setSelectedPlanId(matchingPlan.id)
          initialDefaultSet.current = true
          return
        }
      }
    }

    // 3. Default to the first plan available if patient has no plan
    if (realPlans.length > 0 && !targetPlanId) {
      setSelectedPlanId(realPlans[0].id)
      if (realPlans[0].category) {
        setActiveCategory(realPlans[0].category as PlanCategory)
      }
      initialDefaultSet.current = true
    }
  }, [patient, patientPlanFromApi, realPlans])

  // Filter plans based on active tab category
  const filteredPlans = useMemo(() => {
    return realPlans.filter((p) => p.category === activeCategory)
  }, [realPlans, activeCategory])

  // When activeCategory changes, ensure a plan is selected in that category
  useEffect(() => {
    if (!initialDefaultSet.current) return
    if (filteredPlans.length > 0) {
      const match = filteredPlans.find((p) => p.id === selectedPlanId)
      if (!match) {
        setSelectedPlanId(filteredPlans[0].id)
      }
    }
  }, [filteredPlans, selectedPlanId])

  // Selected Plan Object
  const selectedPlan = useMemo(() => {
    // 1. Direct match in all plans
    const match = realPlans.find((p) => p.id === selectedPlanId)
    if (match) return match

    // 2. Match in patientPlanFromApi
    if (patientPlanFromApi && patientPlanFromApi.id === selectedPlanId) {
      return patientPlanFromApi
    }

    // 3. Match in patient.plan
    if (patient?.plan && (patient.plan.id === selectedPlanId || patient.plan_id === selectedPlanId)) {
      return {
        id: patient.plan.id || patient.plan_id || selectedPlanId,
        name: patient.plan.name,
        category: (patient.plan.category || activeCategory) as PlanCategory,
        tier: (patient.plan.tier || "Bronze") as any,
        price: Number(patient.plan.price || 0),
        price_in_usd: Number(patient.plan.price_in_usd || 0),
        coverage: patient.plan.coverage || [],
        created_at: patient.plan.created_at || new Date().toISOString(),
        updated_at: patient.plan.updated_at || new Date().toISOString(),
        deleted_at: null,
        isDeleted: false,
      } as PlanType
    }

    return filteredPlans[0] || realPlans[0] || null
  }, [realPlans, selectedPlanId, patientPlanFromApi, patient, activeCategory, filteredPlans])

  // Pricing calculations in Naira (NGN) directly from API `plan.price`
  const totalAmount = selectedPlan ? Number(selectedPlan.price || 0) : 0

  // Payment Link Mutation
  const { mutate: generatePaymentLink, isPending: isGeneratingLink } = useCreatePaymentLink()

  // Family details
  const familyMember = patient?.user
  const patientFullName = patient
    ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
    : "Patient"

  const familyFullName = familyMember
    ? `${familyMember.first_name || ""} ${familyMember.last_name || ""}`.trim()
    : patient?.relationship
    ? `Family Sponsor (${patient.relationship})`
    : "Primary Family Member"

  const sponsorEmail = familyMember?.email || patient?.email || ""
  const sponsorPhone = familyMember?.phone || patient?.phone || ""

  const handleGeneratePaymentLink = () => {

    console.log("Generating link...")
    if (!selectedPlan) {
      toast.error("Please select a care plan.")
      return
    }

    const firstName = familyMember?.first_name || patient?.first_name || ""
    const lastName = familyMember?.last_name || patient?.last_name || ""
    const email = sponsorEmail

    if (!email) {
      toast.error("An email address is required to create and send the payment link.")
      return
    }

    const payload: CreatePaymentLinkPayload = {
      patient_id: patientId,
      plan_id: selectedPlan.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      currency: "NGN",
    }

    generatePaymentLink(payload, {
      onSuccess: (res) => {
        toast.success(
          res?.message || "Payment link has been created and sent to family member."
        )
        // router.push(`/dashboard/patients/${patientId}`)
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to create payment link. Please try again."
        )
      },
    })
  }

  if (isPatientLoading) {
    return <CreateBillSkeleton />
  }

  return (
    <div className="w-full space-y-7 pb-16 select-none max-w-full overflow-x-hidden">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-3">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight font-dm-san-regular text-body-text">
              Create Payment Link
            </h1>
            {/* <p className="text-xs font-normal font-dm-san-regular text-zinc-500 mt-0.5">
              Select a care plan for <span className="font-semibold text-body-text">{patientFullName}</span> and generate a direct payment link for the family.
            </p> */}
          </div>
        </div>
      </div>

      {/* Patient & Family Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Patient Card */}
        <div className="p-5 sm:p-6 bg-white border border-zinc-200/80 rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-zinc-200 shrink-0">
                {patient?.profile_picture ? (
                  <AvatarImage
                    src={patient.profile_picture}
                    alt={patientFullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary-light text-primary-color font-bold text-xs">
                  {patient?.first_name?.[0] || "P"}{patient?.last_name?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-base font-bold font-dm-san-regular text-body-text truncate">
                  {patientFullName}
                </h3>
                <span className="text-xs text-zinc-500 font-dm-san-regular block">
                  Recipient of Care
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-secondary-color bg-secondary-light text-secondary-color text-xs font-dm-san-regular shrink-0"
            >
              Patient
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-dm-san-regular pt-2 border-t border-zinc-100">
            <div>
              <span className="text-zinc-400 block">Age</span>
              <span className="font-semibold text-body-text">{patient?.age || "N/A"} yrs</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Gender</span>
              <span className="font-semibold text-body-text capitalize">{patient?.gender || "N/A"}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Current Plan</span>
              <span className="font-semibold text-body-text truncate block">
                {patient?.plan?.tier
                  ? `${patient.plan.tier} Plan`
                  : patient?.plan?.name
                  ? patient.plan.name
                  : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Family Payer Card */}
        <div className="p-5 sm:p-6 bg-linear-to-br from-primary-color/5 to-secondary-color/10 border border-primary-light rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 border border-secondary-color/30 shrink-0">
                {familyMember?.profile_picture ? (
                  <AvatarImage
                    src={familyMember.profile_picture}
                    alt={familyFullName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-secondary-color text-white font-bold text-xs">
                  {familyMember?.first_name?.[0] || "F"}{familyMember?.last_name?.[0] || "M"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="text-base font-bold font-dm-san-regular text-body-text truncate">
                  {familyFullName}
                </h3>
                <span className="text-xs text-primary-color font-dm-san-regular font-medium block truncate">
                  Responsible Payer ({patient?.relationship || "Family Member"})
                </span>
              </div>
            </div>
            <Badge className="bg-primary-color text-white text-xs font-dm-san-regular shrink-0">
              Bill Recipient
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-dm-san-regular pt-2 border-t border-primary-light/40">
            <div className="flex items-center gap-1.5 text-body-text min-w-0">
              <IconMail className="size-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{sponsorEmail || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-body-text min-w-0">
              <IconPhone className="size-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{sponsorPhone || "No phone"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Category Tabs (Responsive Scrollable) */}
      <div className="w-full pt-1">
        <Tabs
          defaultValue="Elderly_Care"
          value={activeCategory}
          onValueChange={(val) => setActiveCategory(val as PlanCategory)}
          className="w-full font-dm-san-regular text-sm font-normal"
        >
          <div className="w-full overflow-x-auto no-scrollbar pb-1">
            <TabsList className="inline-flex w-max min-w-full sm:min-w-0 bg-white p-1 h-auto rounded-lg border border-zinc-200/60 gap-1 shadow-2xs">
              {CATEGORIES_UI.map((cat) => (
                <TabsTrigger
                  key={cat.key}
                  value={cat.key}
                  className="rounded-md px-4 py-2 text-xs font-normal font-dm-san-regular transition-all whitespace-nowrap shrink-0 data-active:bg-secondary-color data-active:text-white text-body-text data-active:hover:text-white shadow-none bg-transparent cursor-pointer"
                >
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {/* Main Layout: Left Side (Plans Cards) & Right Side (Payment Link Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Real Plans Cards from Backend with Fixed Width Horizontal Scroll */}
        <div className="lg:col-span-8 min-w-0 max-w-full overflow-hidden">
          {isPlansLoading ? (
            <div className="bg-white border border-zinc-200/80 rounded-[8px] p-12 flex flex-col items-center justify-center gap-3">
              <IconLoader className="size-6 text-primary-color animate-spin" />
              <span className="text-xs font-dm-san-regular text-body-text/70">
                Loading plans from server...
              </span>
            </div>
          ) : filteredPlans.length > 0 ? (
            <div className="w-full overflow-x-auto pb-4 pt-1 no-scrollbar">
              <div className="flex flex-nowrap gap-6 min-w-min">
                {filteredPlans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id
                  const tierColor = TIER_COLORS[plan.tier] || "text-body-text"
                  const tierBorderColor = TIER_BORDER_COLORS[plan.tier] || "border-zinc-200"
                  const planPrice = Number(plan.price)

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={cn(
                        "w-[300px] sm:w-[320px] shrink-0 p-6 flex flex-col justify-between min-h-[460px] rounded-[8px] border-l-4 transition-all cursor-pointer relative shadow-2xs",
                        tierBorderColor,
                        isSelected
                          ? "bg-primary-light/40 border-t-2 border-r-2 border-b-2 border-primary-color ring-2 ring-primary-color/20"
                          : "bg-white border-t border-r border-b border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/50"
                      )}
                    >
                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 size-6 rounded-full bg-primary-color text-white flex items-center justify-center shadow-xs">
                          <IconCheck className="size-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Header Tier Title */}
                        <div className="space-y-2">
                          <h3 className={`text-base font-semibold font-dm-san-regular ${tierColor}`}>
                            {plan.tier} Tier
                          </h3>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-semibold font-dm-san-regular text-body-text">
                              ₦{planPrice.toLocaleString()}
                            </span>
                            <span className="text-xs font-normal font-dm-san-regular text-zinc-500 ml-1">
                              /month
                            </span>
                          </div>
                          <p className="text-sm font-semibold font-dm-san-regular text-body-text mt-1">
                            {plan.name}
                          </p>
                        </div>

                        {/* Benefits Checklist */}
                        {plan.coverage && plan.coverage.length > 0 && (
                          <ul className="space-y-2.5 pt-3 border-t border-zinc-100">
                            {plan.coverage.map((benefit, idx) => (
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
                        )}
                      </div>

                      {/* Select Action Button */}
                      <div className="pt-5 mt-4 border-t border-zinc-100">
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPlanId(plan.id)
                          }}
                          className={cn(
                            "w-full rounded-full font-dm-san-regular text-xs h-9 cursor-pointer transition-all shadow-none",
                            isSelected
                              ? "bg-secondary-color text-white font-bold"
                              : "border border-secondary-color bg-white text-secondary-color hover:bg-secondary-light font-medium"
                          )}
                        >
                          {isSelected ? "Selected Plan" : "Select Plan"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200/80 rounded-[8px] p-12 text-center space-y-2">
              <p className="text-sm font-dm-san-regular text-body-text">
                No care plans found in this category.
              </p>
              <p className="text-xs text-zinc-400 font-dm-san-regular">
                Switch categories or create a new plan in Manage Plans.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Payment link summary in Naira (NGN) & Action */}
        <div className="lg:col-span-4 min-w-0 max-w-full lg:sticky lg:top-6 space-y-4">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="border-b border-zinc-100 pb-3.5">
              <h2 className="text-lg font-bold font-dm-san-regular text-body-text flex items-center gap-2">
                <IconFileInvoice className="size-5 text-secondary-color" />
                Payment link summary
              </h2>
            </div>

            {/* Line Items */}
            <div className="space-y-3 text-xs font-dm-san-regular">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Selected Plan:</span>
                <span className="font-bold text-body-text text-right truncate ml-2 max-w-[180px]">
                  {selectedPlan?.name || "None"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Plan Tier:</span>
                <Badge variant="outline" className="text-2xs font-dm-san-regular px-2 py-0">
                  {selectedPlan?.tier || "Tier"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Rate:</span>
                <span className="font-semibold text-body-text">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="pt-3.5 border-t border-zinc-200/80 flex justify-between items-baseline">
                <span className="text-sm font-bold text-body-text">Total Due:</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold font-dm-san-regular text-primary-color">
                    ₦{totalAmount.toLocaleString()} NGN
                  </span>
                  <span className="text-2xs text-zinc-400 block">Paystack Gateway</span>
                </div>
              </div>
            </div>

            {/* Recipient Notice */}
            <div className="p-3 bg-secondary-light/60 rounded-xl border border-border-light text-xs font-dm-san-regular text-body-text space-y-1">
              <span className="font-semibold text-body-text block text-2xs uppercase tracking-wider">
                Billed To (Family):
              </span>
              <p className="font-medium truncate">{familyFullName}</p>
              <p className="text-2xs text-zinc-500 truncate">{sponsorEmail || "No email"}</p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGeneratePaymentLink}
              disabled={!selectedPlan || isGeneratingLink}
              className="w-full rounded-full bg-secondary-color hover:bg-secondary-color/90 text-white font-dm-san-regular font-medium text-xs h-11 shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isGeneratingLink ? (
                <>
                  <IconLoader className="size-4 animate-spin" />
                  <span>Generating Payment Link...</span>
                </>
              ) : (
                <span>Generate Payment Link</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

