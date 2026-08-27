export type AdminAnalyticType = {
    totalPatients: number;
    totalCaregivers: number;
    totalRevenue: number;
    totalExpiredPatient: number;
}

export type CaregiverAnalyticType = {
    totalCaregivers: number,
    pendingInvitations: number,
    suspendedAccounts: number
}

export type UserAnalyticType = {
    linkedPatients: number,
    activeSubscriptions: number,
    lastPayment: null
}