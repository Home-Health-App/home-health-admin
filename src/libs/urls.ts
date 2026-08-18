export const URLs = {
    auth: {
        'admin-auth-login': "admin-auth/login",
        'admin-auth-verify-otp': "admin-auth/verify-otp",
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
}