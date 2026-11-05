"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { cn } from "@/libs/utils"
import { IconX } from "@tabler/icons-react"
import { PatientMedicalData } from "./types"

export interface StepMedicalProps {
  data: PatientMedicalData
  updateData: (fields: Partial<PatientMedicalData> | ((prev: PatientMedicalData) => Partial<PatientMedicalData>)) => void
  onOpenCustomTimeModal: (info: { name: string; dosage: string }) => void
  onBack: () => void
  onContinue: () => void
}

export default function StepMedical({
  data,
  updateData,
  onOpenCustomTimeModal,
  onBack,
  onContinue,
}: StepMedicalProps) {
  const [newCondition, setNewCondition] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  // Medications Row State
  const [medName, setMedName] = useState("")
  const [medDosage, setMedDosage] = useState("")
  const [medFrequency, setMedFrequency] = useState("Once Daily")

  // Condition Handlers
  const handleAddCondition = () => {
    if (newCondition.trim() && !data.conditions.includes(newCondition.trim())) {
      updateData((prev) => ({
        conditions: [...prev.conditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const handleRemoveCondition = (cond: string) => {
    updateData((prev) => ({
      conditions: prev.conditions.filter((c) => c !== cond),
    }))
  }

  // Allergy Handlers
  const handleAddAllergy = () => {
    if (newAllergy.trim() && !data.allergies.includes(newAllergy.trim())) {
      updateData((prev) => ({
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (allg: string) => {
    updateData((prev) => ({
      allergies: prev.allergies.filter((a) => a !== allg),
    }))
  }

  // Medication Add Handler
  const handleAddMedication = () => {
    if (medFrequency === "Custom Time...") {
      onOpenCustomTimeModal({ name: medName.trim(), dosage: medDosage.trim() })
      return
    }
    if (medName.trim()) {
      updateData((prev) => ({
        medicationsList: [
          ...prev.medicationsList,
          {
            name: medName.trim(),
            dosage: medDosage.trim() || undefined,
            frequency: medFrequency,
            schedule_type: "Specific Times",
            times: ["08:00 AM"],
            days_of_week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        ],
      }))
      setMedName("")
      setMedDosage("")
      setMedFrequency("Once Daily")
    }
  }

  const handleRemoveMedication = (index: number) => {
    updateData((prev) => ({
      medicationsList: prev.medicationsList.filter((_, idx) => idx !== index),
    }))
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 bg-white p-4 rounded-[16px]">
      {/* 1. Underlying Conditions */}
      <Field className="space-y-2">
        <FieldLabel className="text-sm font-medium text-body-text block">
          Underlying Conditions
        </FieldLabel>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Diabetes"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddCondition()
              }
            }}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text flex-1 focus:outline-hidden focus:border-primary-color"
          />
          <button
            type="button"
            onClick={handleAddCondition}
            className="!h-12 px-6 rounded-full border border-secondary-color bg-white font-sans font-semibold text-sm text-secondary-color hover:bg-secondary-color/10 cursor-pointer transition-colors outline-hidden shadow-none"
          >
            Add
          </button>
        </div>

        {/* Pills with yellow outline */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {data.conditions.map((cond) => (
            <span
              key={cond}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pending-border bg-pending-btn text-xs font-medium text-pending-border font-sans"
            >
              {cond}
              <button
                type="button"
                onClick={() => handleRemoveCondition(cond)}
                className="hover:text-error cursor-pointer outline-hidden"
              >
                <IconX className="size-3.5 stroke-[2.5]" />
              </button>
            </span>
          ))}
        </div>
      </Field>

      {/* 2. Allergies */}
      <Field className="space-y-2">
        <FieldLabel className="text-sm font-medium text-body-text block">
          Allergies
        </FieldLabel>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Latex"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddAllergy()
              }
            }}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text flex-1 focus:outline-hidden focus:border-primary-color"
          />
          <button
            type="button"
            onClick={handleAddAllergy}
            className="!h-12 px-6 rounded-full border border-secondary-color bg-white font-sans font-semibold text-sm text-secondary-color hover:bg-secondary-color/10 cursor-pointer transition-colors outline-hidden shadow-none"
          >
            Add
          </button>
        </div>

        {/* Pills with yellow outline */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {data.allergies.map((allg) => (
            <span
              key={allg}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pending-border bg-pending-btn text-xs font-medium text-pending-border font-sans"
            >
              {allg}
              <button
                type="button"
                onClick={() => handleRemoveAllergy(allg)}
                className="hover:text-error cursor-pointer outline-hidden"
              >
                <IconX className="size-3.5 stroke-[2.5]" />
              </button>
            </span>
          ))}
        </div>
      </Field>

      {/* 3. Current Medications (Horizontal Row) */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
              Current Medications
            </FieldLabel>
            <Input
              type="text"
              placeholder="Metformin"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:outline-hidden focus:border-primary-color"
            />
          </div>

          <div className="sm:col-span-3">
            <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
              Dosage
            </FieldLabel>
            <Input
              type="text"
              placeholder="500mg"
              value={medDosage}
              onChange={(e) => setMedDosage(e.target.value)}
              className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:outline-hidden focus:border-primary-color"
            />
          </div>

          <div className="sm:col-span-3">
            <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
              Frequency
            </FieldLabel>
            <Select
              value={medFrequency}
              onValueChange={(val) => {
                const selected = val ?? "Once Daily"
                setMedFrequency(selected)
                if (selected === "Custom Time...") {
                  onOpenCustomTimeModal({ name: medName.trim(), dosage: medDosage.trim() })
                }
              }}
            >
              <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:ring-0 focus:border-primary-color focus:outline-hidden shadow-none">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
                <SelectItem value="Once Daily" className="font-sans text-sm">Once Daily</SelectItem>
                <SelectItem value="Twice Daily" className="font-sans text-sm">Twice Daily</SelectItem>
                <SelectItem value="Three Times Daily" className="font-sans text-sm">Three Times Daily</SelectItem>
                <SelectItem value="Custom Time..." className="font-sans text-sm font-semibold text-secondary-color">Custom Time...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleAddMedication}
              className="w-full !h-12 rounded-full border border-secondary-color bg-white font-sans font-semibold text-sm text-secondary-color hover:bg-secondary-color/10 cursor-pointer transition-colors outline-hidden shadow-none flex items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>

        {/* Added Medications List */}
        {data.medicationsList.length > 0 && (
          <div className="space-y-2 pt-2">
            {data.medicationsList.map((med, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-[8px] bg-secondary-light border border-zinc-200 text-sm font-sans"
              >
                <div>
                  <span className="font-bold text-body-text">
                    {med.name}
                  </span>
                  {med.dosage && (
                    <span className="text-zinc-500 ml-2">({med.dosage})</span>
                  )}
                  <span className="text-xs text-secondary-color font-semibold ml-3">
                    {med.frequency}
                  </span>
                  {med.days_of_week && med.days_of_week.length > 0 && (
                    <span className="text-xs text-zinc-400 ml-2">
                      [{med.days_of_week.join(", ")}]
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(idx)}
                  className="text-zinc-500 hover:text-error cursor-pointer"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Weight & Height with Unit Switcher Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Weight */}
        <Field>
          <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
            Weight
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="70"
              value={data.weight}
              onChange={(e) => updateData({ weight: e.target.value })}
              className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text flex-1 focus:outline-hidden focus:border-primary-color"
            />
            <div className="flex rounded-[8px] border border-zinc-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => updateData({ weightUnit: "kg" })}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer",
                  data.weightUnit === "kg"
                    ? "bg-secondary-color text-white"
                    : "text-body-text hover:bg-zinc-100"
                )}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => updateData({ weightUnit: "lbs" })}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer",
                  data.weightUnit === "lbs"
                    ? "bg-secondary-color text-white"
                    : "text-body-text hover:bg-zinc-100"
                )}
              >
                lbs
              </button>
            </div>
          </div>
        </Field>

        {/* Height */}
        <Field>
          <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
            Height
          </FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="70"
              value={data.height}
              onChange={(e) => updateData({ height: e.target.value })}
              className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text flex-1 focus:outline-hidden focus:border-primary-color"
            />
            <div className="flex rounded-[8px] border border-zinc-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => updateData({ heightUnit: "cm" })}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer",
                  data.heightUnit === "cm"
                    ? "bg-secondary-color text-white"
                    : "text-body-text hover:bg-zinc-100"
                )}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => updateData({ heightUnit: "in" })}
                className={cn(
                  "px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer",
                  data.heightUnit === "in"
                    ? "bg-secondary-color text-white"
                    : "text-body-text hover:bg-zinc-100"
                )}
              >
                in
              </button>
            </div>
          </div>
        </Field>
      </div>

      {/* 5. Blood Group, Genotype & Additional Height/Metric (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Blood Group */}
        <Field>
          <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
            Blood Group
          </FieldLabel>
          <Select
            value={data.bloodGroup}
            onValueChange={(val) => updateData({ bloodGroup: val ?? "AB" })}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:ring-0 focus:border-primary-color focus:outline-hidden shadow-none">
              <SelectValue placeholder="Blood Group" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "AB", "O+", "O-"].map((bg) => (
                <SelectItem key={bg} value={bg} className="font-sans text-sm">
                  {bg}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Genotype */}
        <Field>
          <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
            Genotype
          </FieldLabel>
          <Select
            value={data.genotype}
            onValueChange={(val) => updateData({ genotype: val ?? "AC" })}
          >
            <SelectTrigger className="w-full !h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:ring-0 focus:border-primary-color focus:outline-hidden shadow-none">
              <SelectValue placeholder="Genotype" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-zinc-200 shadow-lg rounded-lg">
              {["AA", "AS", "SS", "AC", "SC"].map((gt) => (
                <SelectItem key={gt} value={gt} className="font-sans text-sm">
                  {gt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Target Height / Metric */}
        <Field>
          <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
            Height
          </FieldLabel>
          <Input
            type="number"
            placeholder="100"
            value={data.additionalHeight}
            onChange={(e) => updateData({ additionalHeight: e.target.value })}
            className="!h-12 px-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:outline-hidden focus:border-primary-color"
          />
        </Field>
      </div>

      {/* 6. Special Care Instructions */}
      <Field>
        <FieldLabel className="text-sm font-medium text-body-text mb-1 block">
          Special Care Instructions
        </FieldLabel>
        <textarea
          rows={4}
          placeholder="Start typing"
          value={data.specialInstructions}
          onChange={(e) => updateData({ specialInstructions: e.target.value })}
          className="w-full p-4 rounded-[8px] border border-zinc-300 bg-secondary-light font-sans text-sm text-body-text focus:outline-hidden focus:border-primary-color resize-none"
        />
      </Field>

      {/* Step 2 Actions */}
      <div className="flex items-center justify-center gap-4 pt-6 flex-wrap sm:flex-nowrap">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-[388px] max-w-full !h-13 rounded-full border border-secondary-color bg-white font-sans font-semibold text-base text-secondary-color hover:bg-secondary-color/10 cursor-pointer transition-colors shadow-none"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="w-[388px] max-w-full !h-13 rounded-full bg-primary-color hover:bg-primary-color/90 text-white font-sans font-semibold text-base transition-all cursor-pointer border-none shadow-none outline-hidden"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
