// ============================================================================
// Enums
// ============================================================================

export type OtpUserType = 'Admin' | 'USER';

export type AssignmentRole =
    | 'Full_Access'
    | 'Vitals'
    | 'Medication'
    | 'Incidents'
    | 'Notes';

export type AssignmentUserRole = 'CARE_GIVER' | 'FAMILY_MEMBER';

export type RoleSection =
    | 'Overview'
    | 'Users'
    | 'Patients'
    | 'Plans'
    | 'Finance'
    | 'Caregivers'
    | 'Admins';

export type RoleStatus = 'ACTIVE' | 'INACTIVE';

export type UserType = 'USER' | 'CARE_GIVER';

export type Gender = 'MALE' | 'FEMALE';

export type AssignmentStatus =
    | 'PENDING'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

export type Mode = 'HAPPY' | 'NEUTRAL' | 'IRRITABLE' | 'STRESSED' | 'SAD';

export type InvitationStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'EXPIRED';

// ============================================================================
// Models & Interfaces
// ============================================================================

export interface IUser {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    phone: string;
    address?: string | null;
    profile_picture?: string | null;
    country: string;
    state?: string | null;
    gender: Gender;
    date_of_birth?: string | Date | null;
    push_notification_token?: string | null;
    certification?: string | null;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    type: UserType;
    isDeleted: boolean;

    // Relations
    otp?: IOtp | null;
    emergencyContacts?: IEmergencyContact[];
    patients?: IPatient[];
    assignments?: IAssignment[];
    notifications?: INotification[];
}

export interface IInvitation {
    id: string;
    email: string;
    type: UserType;
    status: InvitationStatus;
    expiresAt: string | Date;
    code: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;
}

export interface IEmergencyContact {
    id: string;
    user_id: string;
    user?: IUser;
    full_name: string;
    phone: string;
    email?: string | null;
    relationship?: string | null;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;
}

export interface IPatient {
    id: string;
    user_id: string;
    user?: IUser;

    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    profile_picture?: string | null;
    country: string;
    state?: string | null;
    gender: Gender;
    date_of_birth?: string | Date | null;
    notes?: string | null;
    plan_id: string;
    plan?: IPlan;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    // Relations
    assignments?: IAssignment[];
}

export interface IVitalRecord {
    id: string;
    daily_log_id: string;

    heart_rate: number;
    respiratory_rate: number;
    systolic_bp: number;
    diastolic_bp: number;
    temperature: number;
    oxygen_saturation: number;
    pain_level: number;
    blood_glucose: string;
    weight: number;
    time_taken: string | Date;
    notes: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface IDailyCareLog {
    id: string;
    patient_id: string;
    user_id: string;
    date: string | Date;
    note: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    // Relations
    vitals?: IVitalRecord[];
    medicationRecords?: IMedicationRecord[];
    symptoms?: ISymptoms[];
    moods?: IMood[];
    activities?: IActivity[];
    incidentReports?: IIncidentReport[];
    careGiverNotes?: ICareGiverNote[];
}

export interface IMedicationRecord {
    id: string;
    daily_log_id: string;
    medication_name: string;
    dose: string;
    time_taken: string | Date;
    notes: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface ISymptoms {
    id: string;
    daily_log_id: string;
    symptom: string;
    severity: Severity;
    time_taken: string | Date;
    notes: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface IMood {
    id: string;
    daily_log_id: string;
    mode: Mode;
    time_taken: string | Date;
    notes: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface IActivity {
    id: string;
    daily_log_id: string;
    activity: string;
    time_taken: string;
    notes: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface IIncidentReport {
    id: string;
    daily_log_id: string;
    incident_type: string;
    time_taken: string;
    notes: string;
    severity: Severity;
    description: string;
    action_taken: string;
    reported_to_family?: boolean | null;
    reported_to_family_time?: string | Date | null;
    reported_to_professional?: boolean | null;
    reported_to_professional_time?: string | Date | null;
    next_follow_up_date?: string | Date | null;
    location?: string | null;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface ICareGiverNote {
    id: string;
    daily_log_id: string;
    note: string;
    time_taken: string | Date;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    daily_log?: IDailyCareLog;
}

export interface IAdmin {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    address?: string | null;
    profile_picture?: string | null;
    country: string;
    state?: string | null;
    gender: Gender;
    date_of_birth?: string | Date | null;
    role_id: string;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    role?: IRole;
    otp?: IOtp | null;
    notifications?: INotification[];
}

export interface IAssignment {
    id: string;
    patient_id: string;
    patient?: IPatient;

    user_id?: string | null;
    user?: IUser | null;

    start_date: string | Date;
    end_date?: string | Date | null;
    status: AssignmentStatus;
    assigned_by: string;

    family_access_permissions: AssignmentRole[];
    user_role: AssignmentUserRole;

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;
}

export interface IRole {
    id: string;
    name: string;
    permissions: RoleSection[];

    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    status: RoleStatus;

    admins?: IAdmin[];
}

export interface IPlan {
    id: string;
    name: string;
    price: number;
    price_in_usd: number;
    coverage: string[];
    created_at: string | Date;
    updated_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;

    patients?: IPatient[];
}

export interface INotification {
    id: string;
    user_id?: string | null;
    user?: IUser | null;
    admin_id?: string | null;
    admin?: IAdmin | null;
    title: string;
    message: string;
    is_read: boolean;
    read_by: string[];

    created_at: string | Date;
    deleted_at?: string | Date | null;
    isDeleted: boolean;
}

export interface IOtp {
    id: string;
    code: string;
    expiry_date: string | Date;
    user_type: OtpUserType;
    admin_id?: string | null;
    user_id?: string | null;

    created_at: string | Date;
    updated_at: string | Date;

    // Relations
    admin?: IAdmin | null;
    user?: IUser | null;
}
