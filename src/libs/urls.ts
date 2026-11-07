export const URLs = {
    auth: {
        'admin-auth-login': "admin-auth/login",
        'admin-auth-verify-otp': "admin-auth/verify-otp",
        'admin-auth-create': "admin-auth/create",
        'register': "auth/register",
    },
    admin: {
        'get-admins': "admin",
        'create-admin': "admin-auth/create",
        'update-admin': (id: string) => `admin-auth/${id}`,
    },
    plans: {
        'create-plan': "plans",
        'get-all-plans': "plans",
        'update-plan': (id: string) => `plans/${id}`,
        'delete-plan': (id: string) => `plans/${id}`,
        'get-plan-by-id': (id: string) => `plans/${id}`,
        'get-categories': "plans/categories",
        'get-tiers': "plans/tiers",
    },
    invitation: {
        'send-invitation': "invitation/send",
        'get-invitations': "invitation",
        'get-invitation-by-id': (id: string) => `invitation/${id}`,
    },
    users: {
        'get-users': "users",
        'get-user-by-id': (id: string) => `users/${id}`,
        'suspend-caregiver': (id: string) => `caregiver/${id}/suspend`,
        'suspend-user': (id: string) => `users/${id}/suspend`,
    },

    analytics: {
        'admin-analytic': 'analytics/admin',
        'user-analytic': (userId: string) => `analytics/user/${userId}`,
        'caregiver-analytic': 'analytics/caregivers',
    },

    notificationPreferences: {
        'admin-preferences': (adminId: string) => `notification-preferences/admin/${adminId}`,
    },

    notification: {
        'get-admin-notifications': "notification/admin",
        'mark-read': "notification/mark-read",
        'delete-notification': (id: string) => `notification/${id}`,
        'mark-as-read': (id: string) => `notification/${id}/read`,
        'mark-all-read': "notification/read-all",
    },

    notifications: {
        'get-admin-notifications': "notification/admin",
        'mark-read': "notification/mark-read",
        'delete-notification': (id: string) => `notification/${id}`,
        'mark-as-read': (id: string) => `notification/${id}/read`,
        'mark-all-read': "notification/read-all",
    },

    adminRoles: {
        'get-roles': "admin-roles",
        'create-role': "admin-roles",
        'update-role': (id: string) => `admin-roles/${id}`,
        'delete-role': (id: string) => `admin-roles/${id}`,
        'get-role-by-id': (id: string) => `admin-roles/${id}`,
    },

    patient: {
        'create-patient': "patient/admin",
        'get-patients-admin': "patient/admin",
        'get-patient-by-id': (id: string) => `patient/${id}`,
        'update-patient': (id: string) => `patient/${id}`,
        'suspend-patient': (id: string) => `patient/${id}/suspend`,
        'assign-patient': "patient/assign",
        'unassign-patient': "patient/unassign",
        'get-daily-logs': (patientId: string) => `patient/admin/daily-logs/${patientId}`,
        'get-daily-log-by-id': (logId: string) => `patient/admin/daily-log/${logId}`,
        'get-user-patients': (userId: string) => `patient/admin/user/${userId}`,
    },

    chat: {
        'create-admin-chat': "chat/admin/create",
        'get-admin-chats': "chat/admin",
        'get-chat-messages': (chatId: string) => `chat/${chatId}/messages`,
        'send-admin-message': "chat/admin/message",
    },

    activityLogs: {
        'get-activity-logs': "activity-log",
        'get-user-activity-logs': (userId: string) => `activity-log/${userId}/activity-log`,
    },

    aiReport: {
        'get-patient-reports': (patientId: string) => `ai-report/patient/${patientId}`,
        'get-report-by-id': (reportId: string) => `ai-report/${reportId}`,
        'download-report': (reportId: string) => `ai-report/${reportId}/download`,
    },

    upload: {
        single: "upload",
        multiple: "upload/multiple",
    },

    payment: {
        'get-admin-payments': "payment/admin",
        'get-patient-payment': (patientId: string) => `payment/patient/${patientId}`,
        'create-payment-link': "payment-link",
        'get-payment-by-id': (id: string) => `payment-link/${id}`,
        // 'verify-payment': (paymentId: string) => `payment/verify/${paymentId}`,
        'verify-payment-link': (paymentId: string) => `payment-link/verify/${paymentId}`,
    },
}