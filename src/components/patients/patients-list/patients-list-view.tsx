"use client"

import React, { useState, useMemo } from "react"
import { IconSearch, IconFileDownload } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { columns, PatientItem } from "./columns"
import { DataTable } from "@/components/shared/data-table"
import { PaginatedResponse } from "@/types/response.type"
import { PatientType } from "@/types/patient.type"
import { useSuspendPatient, useUnassignPatient } from "@/hooks/patient.hook"
import ConfirmationModal, { useConfirmation } from "@/components/modal/confirmation-modal"
import AssignPatientModal from "@/components/modal/assign-patient-modal"
import { toast } from "sonner"

interface PatientsListViewProps {
  patientsData?: PaginatedResponse<PatientType[]>
}

export default function PatientsView({ patientsData }: PatientsListViewProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [globalFilter, setGlobalFilter] = useState<string>("")

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assigningPatient, setAssigningPatient] = useState<{
    id: string
    name: string
  } | null>(null)

  const { state: confirmState, confirm, close: closeConfirm } = useConfirmation()
  const { mutate: suspendMutate, isPending: suspendPending } = useSuspendPatient()
  const { mutate: unassignMutate, isPending: unassignPending } = useUnassignPatient()

  // Transform backend response into table items
  const tableData = useMemo<PatientItem[]>(() => {
    if (!patientsData?.data) return []

    return patientsData.data.map((patient) => {
      const caregiverAssignment = patient.assignments?.[0]
      const caregiverName = caregiverAssignment?.caregiver
        ? `${caregiverAssignment.caregiver.first_name || ""} ${caregiverAssignment.caregiver.last_name || ""}`.trim()
        : caregiverAssignment?.user
        ? `${caregiverAssignment.user.first_name || ""} ${caregiverAssignment.user.last_name || ""}`.trim()
        : "Unassigned"

      const familyName = patient.user
        ? `${patient.user.first_name || ""} ${patient.user.last_name || ""}`.trim()
        : patient.relationship || "-"

      return {
        id: patient.id,
        name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim() || "Unnamed Patient",
        familyMember: familyName || "-",
        familyMemberId: patient.user?.id || patient.user_id,
        caregiver: caregiverName || "Unassigned",
        subscription: patient.plan?.tier || patient.plan?.name || "No Plan",
        status: patient.isSuspended ? "Suspended" : "Active",
        rawPatient: patient,
      }
    })
  }, [patientsData])

  // Filter data by status tab
  const filteredData = useMemo(() => {
    return tableData.filter((patient) => {
      if (statusFilter === "All") return true
      if (statusFilter === "Active") return patient.status === "Active"
      if (statusFilter === "Inactive") return patient.status === "Suspended" || patient.status === "Inactive"
      return true
    })
  }, [tableData, statusFilter])

  const handleToggleSuspend = (patientId: string, currentStatus: boolean) => {
    const actionText = currentStatus ? "unsuspend" : "suspend"
    confirm({
      title: `${currentStatus ? "Unsuspend" : "Suspend"} Patient`,
      description: `Are you sure you want to ${actionText} this patient's account?`,
      confirmText: currentStatus ? "Unsuspend" : "Suspend",
      variant: currentStatus ? "primary" : "danger",
      onConfirm: () => {
        suspendMutate(
          { id: patientId, payload: { isSuspended: !currentStatus } },
          {
            onSuccess: () => {
              toast.success(`Patient ${currentStatus ? "unsuspended" : "suspended"} successfully!`)
              closeConfirm()
            },
            onError: () => {
              toast.error(`Failed to ${actionText} patient.`)
            },
          }
        )
      },
    })
  }

  const handleAssignCaregiver = (patient: { id: string; name: string }) => {
    setAssigningPatient(patient)
    setIsAssignModalOpen(true)
  }

  const handleUnassignCaregiver = (patient: PatientItem) => {
    const assignment = patient.rawPatient.assignments?.[0]
    const caregiverUserId =
      assignment?.caregiver?.id ||
      assignment?.user?.id ||
      assignment?.user_id ||
      ""

    confirm({
      title: "Unassign Caregiver",
      description: `Are you sure you want to unassign ${patient.caregiver} from ${patient.name}?`,
      confirmText: "Unassign",
      variant: "danger",
      onConfirm: () => {
        unassignMutate(
          {
            patient_id: patient.id,
            user_id: caregiverUserId,
          },
          {
            onSuccess: () => {
              toast.success("Caregiver unassigned successfully!")
              closeConfirm()
            },
            onError: () => {
              toast.error("Failed to unassign caregiver.")
            },
          }
        )
      },
    })
  }

  return (
    <div className="w-full pb-8">
      {/* Top Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-zinc-900">
          Patient Directory
        </h1>
        <p className="text-zinc-500 font-sans mt-1 text-sm">
          Manage and monitor all active and inactive patient records.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-8 mb-4">
        {/* Search Field */}
        <div className="relative h-14 w-full sm:w-110">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-6 text-body-text opacity-40" />
          <Input
            type="text"
            placeholder="Search Patients"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 pr-4 h-full rounded-full border border-[#A1A1A1] shadow-none font-sans text-sm focus-visible:border-[#999999] focus-visible:ring-0 outline-hidden text-body-text bg-white w-full placeholder:text-zinc-400"
          />
        </div>

        {/* Filters and Export button */}
        <div className="flex flex-wrap gap-4 items-center h-9 self-start sm:self-auto">
          {/* Status buttons */}
          <div className="flex items-center gap-2 h-full">
            <span className="text-sm font-bold text-body-text font-dm-san-regular select-none">
              Status
            </span>
            <div className="flex bg-white p-1 rounded-[8px] border border-zinc-100">
              {["All", "Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`text-sm font-normal px-3 py-1 rounded-md transition-all cursor-pointer outline-hidden ${
                    statusFilter === tab
                      ? "bg-secondary-color text-white shadow-xs"
                      : "text-body-text hover:text-black hover:bg-zinc-200/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Export CSV button */}
          <Button
            variant="outline"
            className="rounded-full border border-secondary-color bg-transparent shadow-none font-sans font-normal text-xs text-body-text flex items-center gap-1.5 px-4.5 h-8.5 hover:bg-zinc-50 cursor-pointer outline-hidden"
          >
            <IconFileDownload className="size-4 text-secondary-color font-bold" />
            <span className="text-secondary-color">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Directory Table component */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-zinc-200/70 text-center">
          <h3 className="font-dm-san-medium font-bold text-zinc-950 text-xl">
            No patients found
          </h3>
          <p className="text-zinc-500 font-sans text-sm max-w-sm leading-relaxed mt-1">
            There are currently no patients matching your selected filter.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          pageSize={6}
          meta={{
            onToggleSuspend: handleToggleSuspend,
            onAssignCaregiver: handleAssignCaregiver,
            onUnassignCaregiver: handleUnassignCaregiver,
          }}
        />
      )}

      <AssignPatientModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        patient={assigningPatient}
      />

      <ConfirmationModal
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) closeConfirm()
        }}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        onConfirm={confirmState.onConfirm}
        variant={confirmState.variant}
        isPending={suspendPending || unassignPending}
      />
    </div>
  )
}
