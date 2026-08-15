"use client"

import React, { useState } from "react"
import PlansListView, { SubscriptionPlan } from "@/components/billing/plans-list-view"
import PlanFormView from "@/components/billing/plan-form-view"

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Bronze Tier Plan",
    category: "Elderly Care",
    staffingLevel: "Caregiver",
    tier: "Bronze",
    monthlyRate: 50,
    yearlyRate: 500,
    benefits: [
      "Bathing & Grooming",
      "Toilet Care & Hygiene",
      "Vital Signs Monitoring",
      "Feeding Assistance",
      "Medication Management & Reminders (Non-administered)",
      "Mobility Assistance & Fall Prevention",
      "Companionship & Mental Stimulation",
      "Escorting to Appointments & Social Functions",
      "Emotional Support & Reducing Isolation",
      "Communication Management (Phone, email, etc.)",
    ],
  },
  {
    id: 2,
    name: "Silver Tier Plan",
    category: "Elderly Care",
    staffingLevel: "Caregiver",
    tier: "Silver",
    monthlyRate: 50,
    yearlyRate: 500,
    benefits: [
      "Bathing & Grooming",
      "Toilet Care & Hygiene",
      "Vital Signs Monitoring",
      "Feeding Assistance",
      "Medication Management & Reminders (Non-administered)",
      "Mobility Assistance & Fall Prevention",
      "Companionship & Mental Stimulation",
      "Escorting to Appointments & Social Functions",
      "Emotional Support & Reducing Isolation",
      "Communication Management (Phone, email, etc.)",
    ],
  },
  {
    id: 3,
    name: "Gold Tier Plan",
    category: "Elderly Care",
    staffingLevel: "Caregiver",
    tier: "Gold",
    monthlyRate: 50,
    yearlyRate: 500,
    benefits: [
      "Bathing & Grooming",
      "Toilet Care & Hygiene",
      "Vital Signs Monitoring",
      "Feeding Assistance",
      "Medication Management & Reminders (Non-administered)",
      "Mobility Assistance & Fall Prevention",
      "Companionship & Mental Stimulation",
      "Escorting to Appointments & Social Functions",
      "Emotional Support & Reducing Isolation",
      "Communication Management (Phone, email, etc.)",
    ],
  },
  {
    id: 4,
    name: "Diamond Tier Plan",
    category: "Elderly Care",
    staffingLevel: "Caregiver",
    tier: "Diamond",
    monthlyRate: 50,
    yearlyRate: 500,
    benefits: [
      "Bathing & Grooming",
      "Toilet Care & Hygiene",
      "Vital Signs Monitoring",
      "Feeding Assistance",
      "Medication Management & Reminders (Non-administered)",
      "Mobility Assistance & Fall Prevention",
      "Companionship & Mental Stimulation",
      "Escorting to Appointments & Social Functions",
      "Emotional Support & Reducing Isolation",
      "Communication Management (Phone, email, etc.)",
    ],
  },
]

export default function ManagePlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS)
  const [view, setView] = useState<"list" | "create" | "edit">("list")
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null)

  const handleCreatePlan = () => {
    setEditingPlanId(null)
    setView("create")
  }

  const handleEditPlan = (id: number) => {
    setEditingPlanId(id)
    setView("edit")
  }

  const handleDeletePlan = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCancelForm = () => {
    setView("list")
    setEditingPlanId(null)
  }

  const handleSavePlan = (planData: Omit<SubscriptionPlan, "id"> & { id?: number }) => {
    if (view === "edit" && planData.id !== undefined) {
      setPlans((prev) =>
        prev.map((p) => (p.id === planData.id ? (planData as SubscriptionPlan) : p))
      )
    } else {
      const newPlan: SubscriptionPlan = {
        ...planData,
        id: plans.length > 0 ? Math.max(...plans.map((p) => p.id)) + 1 : 1,
      }
      setPlans((prev) => [...prev, newPlan])
    }
    setView("list")
    setEditingPlanId(null)
  }

  const planToEdit = editingPlanId
    ? plans.find((p) => p.id === editingPlanId) || null
    : null

  return (
    <div className="w-full">
      {view === "list" && (
        <PlansListView
          plans={plans}
          onCreatePlan={handleCreatePlan}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
        />
      )}

      {(view === "create" || view === "edit") && (
        <PlanFormView
          planToEdit={planToEdit}
          onSave={handleSavePlan}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}
