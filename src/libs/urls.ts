export const URLs = {
    auth: {
        'admin-auth-login': "admin-auth/login",
        'admin-auth-verify-otp': "admin-auth/verify-otp",
        'register': "auth/register",
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
    },
    users: {
        'get-users': "users",
        'get-user-by-id': (id: string) => `users/${id}`,
        'suspend-caregiver': (id: string) => `caregiver/${id}/suspend`,
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
    },

    chat: {
        'create-admin-chat': "chat/admin/create",
    },

    activityLogs: {
        'get-activity-logs': "activity-log",
    },
}