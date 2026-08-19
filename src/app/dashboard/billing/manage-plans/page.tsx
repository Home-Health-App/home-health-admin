"use client"

import React, { useState } from "react"
import PlansListView from "@/components/billing/plans-list-view"
import PlanFormView from "@/components/billing/plan-form-view"
import {
  useGetAllPlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from "@/hooks/billing.hook"
import { CreatePlanType } from "@/types/billing.type"

export default function ManagePlansPage() {
  const { data: plansData, isPending: isLoadingPlans } = useGetAllPlans()
  const { mutate: createPlan } = useCreatePlan()
  const { mutate: updatePlan } = useUpdatePlan()
  const { mutate: deletePlan } = useDeletePlan()

  const [view, setView] = useState<"list" | "create" | "edit">("list")
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)

  const handleCreatePlan = () => {
    setEditingPlanId(null)
    setView("create")
  }

  const handleEditPlan = (id: string) => {
    setEditingPlanId(id)
    setView("edit")
  }

  const handleDeletePlan = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription plan?")) {
      deletePlan(id)
    }
  }

  const handleCancelForm = () => {
    setView("list")
    setEditingPlanId(null)
  }

  const handleSavePlan = (planData: CreatePlanType & { id?: string }) => {
    if (view === "edit" && planData.id) {
      updatePlan(
        { id: planData.id, payload: planData },
        {
          onSuccess: () => {
            setView("list")
            setEditingPlanId(null)
          },
        }
      )
    } else {
      createPlan(planData, {
        onSuccess: () => {
          setView("list")
          setEditingPlanId(null)
        },
      })
    }
  }

  const plans = plansData?.data || []
  const planToEdit = editingPlanId
    ? plans.find((p) => p.id === editingPlanId) || null
    : null

  if (isLoadingPlans) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center space-y-3">
        <div className="size-8 rounded-full border-4 border-zinc-200 border-t-[#0B1E3F] animate-spin" />
        <p className="text-sm font-normal text-zinc-500 font-dm-san-regular">
          Loading subscription plans...
        </p>
      </div>
    )
  }

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
