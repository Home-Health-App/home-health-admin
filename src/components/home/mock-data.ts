export interface KpiData {
  totalPatients: string
  totalCaregivers: string
  totalRevenue: string
  expiredSubscriptions: string
}

export interface PatientGrowthPoint {
  name: string
  patients: number
  labelVal: number
}

export interface RevenuePoint {
  name: string
  Revenue: number
  Refunds: number
}

export interface NotificationItem {
  id: number
  title: string
  label: string
  time: string
  snippet: string
}

export interface DashboardData {
  kpis: KpiData
  patientGrowth: PatientGrowthPoint[]
  revenueOverview: RevenuePoint[]
  notifications: NotificationItem[]
}

export const EMPTY_STATE_DATA: DashboardData = {
  kpis: {
    totalPatients: "0",
    totalCaregivers: "0",
    totalRevenue: "$0",
    expiredSubscriptions: "0",
  },
  patientGrowth: [],
  revenueOverview: [],
  notifications: [],
}

export const CONTENT_STATE_DATA: DashboardData = {
  kpis: {
    totalPatients: "1220",
    totalCaregivers: "800",
    totalRevenue: "$122k",
    expiredSubscriptions: "12",
  },
  patientGrowth: [
    { name: "Mar", patients: 950, labelVal: 950 },
    { name: "Apr", patients: 1000, labelVal: 140 },
    { name: "May", patients: 1040, labelVal: 1040 },
    { name: "Jun", patients: 1100, labelVal: 1100 },
    { name: "Jul", patients: 1150, labelVal: 1150 },
    { name: "Aug", patients: 1220, labelVal: 1220 },
  ],
  revenueOverview: [
    { name: "Q1", Revenue: 80, Refunds: 10 },
    { name: "Q2", Revenue: 105, Refunds: 15 },
    { name: "Q3", Revenue: 98, Refunds: 8 },
    { name: "Q4", Revenue: 130, Refunds: 20 },
  ],
  notifications: [
    {
      id: 1,
      title: "Notification Title",
      label: "Label",
      time: "Time",
      snippet: "This is going to be a snippet of the notification",
    },
    {
      id: 2,
      title: "Notification Title",
      label: "Label",
      time: "Time",
      snippet: "This is going to be a snippet of the notification",
    },
    {
      id: 3,
      title: "Notification Title",
      label: "Label",
      time: "Time",
      snippet: "This is going to be a snippet of the notification",
    },
  ],

  // kpis: {
  //   totalPatients: "0",
  //   totalCaregivers: "0",
  //   totalRevenue: "$0",
  //   expiredSubscriptions: "0",
  // },
  // patientGrowth: [],
  // revenueOverview: [],
  // notifications: [],
}
