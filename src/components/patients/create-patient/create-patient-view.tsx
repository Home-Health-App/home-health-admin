"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreatePatient } from "@/hooks/patient.hook"
import { useGetAllPlans } from "@/hooks/billing.hook"
import { toast } from "sonner"
import CustomTimeModal from "@/components/modal/custom-time-modal"
import { MedicationSchedule } from "@/types/patient.type"

import PatientStepper, { Step } from "./stepper"
import StepPatient from "./step-patient"
import StepMedical from "./step-medical"
import StepPlan from "./step-plan"
import { STATIC_FALLBACK_PLANS } from "./constants"
import {
  PatientDemographicsData,
  PatientMedicalData,
  PatientPlanData,
} from "./types"
import { calculateAge } from "@/libs/utils"

interface CreatePatientViewProps {
  userId: string
}

export default function CreatePatientView({ userId }: CreatePatientViewProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)

  // Step 1: Demographics Structured State
  const [demographics, setDemographics] = useState<PatientDemographicsData>({
    profilePicPreview: null,
    profilePicUrl: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    relationship: "",
    address: "",
    country: "",
    state: "",
  })

  // Step 2: Medical Structured State
  const [medical, setMedical] = useState<PatientMedicalData>({
    conditions: [],
    allergies: [],
    medicationsList: [],
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
    bloodGroup: "",
    genotype: "",
    additionalHeight: "",
    specialInstructions: "",
  })

  // Step 3: Plan Structured State
  const [plan, setPlan] = useState<PatientPlanData>({
    selectedCategory: "Elderly_Care",
    billingPeriod: "monthly",
    selectedPlanId: "elderly_care-bronze-plan",
  })

  // State update helpers
  const updateDemographics = (fields: Partial<PatientDemographicsData>) => {
    setDemographics((prev) => ({ ...prev, ...fields }))
  }

  const updateMedical = (
    fields:
      | Partial<PatientMedicalData>
      | ((prev: PatientMedicalData) => Partial<PatientMedicalData>)
  ) => {
    setMedical((prev) => {
      const next = typeof fields === "function" ? fields(prev) : fields
      return { ...prev, ...next }
    })
  }

  const updatePlan = (fields: Partial<PatientPlanData>) => {
    setPlan((prev) => ({ ...prev, ...fields }))
  }

  // Modals state
  const [customTimeModalOpen, setCustomTimeModalOpen] = useState(false)
  const [customTimeModalInitialData, setCustomTimeModalInitialData] = useState<{
    name: string
    dosage: string
  }>({ name: "", dosage: "" })

  // Live and Fallback Plans
  const { data: plansResponse } = useGetAllPlans()
  const livePlans = plansResponse?.data || []
  const availablePlans = livePlans.length > 0 ? livePlans : STATIC_FALLBACK_PLANS

  // Mutation
  const { mutate: createPatientMutate, isPending: isSubmitting } = useCreatePatient()

  // Custom Time Confirmation Handler
  const handleConfirmCustomTime = (schedule: MedicationSchedule) => {
    updateMedical((prev) => ({
      medicationsList: [
        ...prev.medicationsList,
        {
          ...schedule,
          name: customTimeModalInitialData.name || schedule.name || "Medication",
          dosage: customTimeModalInitialData.dosage || schedule.dosage || undefined,
        },
      ],
    }))
  }

  // Open Custom Time Modal from StepMedical
  const handleOpenCustomTimeModal = (info: { name: string; dosage: string }) => {
    setCustomTimeModalInitialData(info)
    setCustomTimeModalOpen(true)
  }

  // Format ISO date_of_birth
  const formatIsoDate = (dobString: string): string => {
    if (!dobString) return new Date().toISOString()
    const d = new Date(dobString)
    return isNaN(d.getTime()) ? dobString : d.toISOString()
  }

  // Final Submission Handler (triggered directly on clicking "Create Patients")
  const handleFinalSubmit = () => {
    const formattedMedications = medical.medicationsList.map((m) => ({
      name: m.name,
      doseage: m.dosage || (m as any).doseage || "",
      frequency: m.frequency || "Once Daily",
    }))

    createPatientMutate(
      {
        plan_id: plan.selectedPlanId,
        first_name: demographics.firstName.trim(),
        last_name: demographics.lastName.trim(),
        email: demographics.email.trim(),
        phone: demographics.phone.trim(),
        relationship: demographics.relationship.trim() || undefined,
        address: demographics.address.trim(),
        profile_picture: demographics.profilePicUrl || undefined,
        country: demographics.country || "Nigeria",
        state: demographics.state,
        gender: demographics.gender.toUpperCase(),
        date_of_birth: formatIsoDate(demographics.dateOfBirth),
        notes: medical.specialInstructions.trim() || undefined,
        height: parseFloat(medical.height) || 0,
        weight: parseFloat(medical.weight) || 0,
        allergies: medical.allergies,
        chronic_conditions: medical.conditions,
        age: calculateAge(demographics.dateOfBirth) || 0,
        blood_group: medical.bloodGroup,
        genotype: medical.genotype,
        medications: formattedMedications,
        user_id: userId,
      },
      {
        onSuccess: () => {
          toast.success("Patient created successfully!")
          router.push("/dashboard/patients")
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Failed to create patient."
          toast.error(message)
        },
      }
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 font-sans select-none">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-sans text-[#1E1E1E]">
          Add New Patient
        </h1>
      </div>

      {/* Stepper Progress Bar */}
      <PatientStepper
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Step 1: Patient Demographics */}
      {currentStep === 1 && (
        <div className="">
          <StepPatient
            data={demographics}
            updateData={updateDemographics}
            onContinue={() => setCurrentStep(2)}
          />
        </div>
      )}

      {/* Step 2: Medical Details */}
      {currentStep === 2 && (
        <div className="">
          <StepMedical
            data={medical}
            updateData={updateMedical}
            onOpenCustomTimeModal={handleOpenCustomTimeModal}
            onBack={() => setCurrentStep(1)}
            onContinue={() => setCurrentStep(3)}
          />
        </div>
      )}

      {/* Step 3: Plan Selection */}
      {currentStep === 3 && (
        <div className="">
          <StepPlan
            data={plan}
            updateData={updatePlan}
            availablePlans={availablePlans}
            isSubmitting={isSubmitting}
            onBack={() => setCurrentStep(2)}
            onSubmit={handleFinalSubmit}
          />
        </div>
      )}

      {/* Custom Time Modal */}
      <CustomTimeModal
        open={customTimeModalOpen}
        onOpenChange={setCustomTimeModalOpen}
        initialData={customTimeModalInitialData}
        onConfirm={handleConfirmCustomTime}
      />
    </div>
  )
}
