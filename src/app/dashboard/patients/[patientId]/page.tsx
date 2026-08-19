import React, { Suspense } from "react"
import PatientDetailsView from "@/components/patients/patient-details/patient-details-view"
import PatientLoader from "@/components/patients/patients-list/loader"

interface PageProps {
  params: Promise<{ patientId: string }>
}

export default async function PatientDetailsPage({ params }: PageProps) {
  const { patientId } = await params

   return <PatientDetailsView patientId={patientId} />
}