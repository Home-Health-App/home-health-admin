export type AdminAnalyticType = {
  totalPatients: number
  totalCaregivers: number
  totalRevenue: number
  totalExpiredPatient: number
}

export type PatientGrowthPointType = {
  month: string
  year: number
  monthKey: string
  totalPatients: number
  newPatients: number
}

export type RevenueQuarterPointType = {
  quarter: "Q1" | "Q2" | "Q3" | "Q4"
  revenue: number
  refunds: number
}

export type AdminGraphsAnalyticType = {
  patientGrowth: {
    months: number
    series: PatientGrowthPointType[]
  }
  revenueOverview: {
    year: number
    currency: string
    quarters: RevenueQuarterPointType[]
  }
}

export type AdminGraphsQueryParams = {
  months?: number
  year?: number
  currency?: "NGN" | "USD"
}

export type AdminUserLastPaymentType = {
  id: string
  amount: number
  currency: "NGN" | "USD" | string
  status: string
  created_at: string
  patient: {
    id: string
    first_name: string | null
    last_name: string | null
  } | null
  plan: {
    id: string
    name: string
    tier: string
    category: string
  } | null
}

export type AdminUserAnalyticType = {
  totalPatients: number
  totalActivePatientsWithActiveSubscriptions: number
  lastPayment: AdminUserLastPaymentType | null
}

export type CaregiverAnalyticType = {
  totalCaregivers: number
  pendingInvitations: number
  suspendedAccounts: number
}

export type UserAnalyticType = {
  linkedPatients: number
  activeSubscriptions: number
  lastPayment: string | null
}

export type PatientPaymentAnalyticType = {
  totalAmount: number
  totalSubscriptionCount: number
}
