export type GeneralResponse<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    page?: number;
    total?: number;
}

export type PaginationType = {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
}

export type PaginatedResponse<T = unknown> = {
    success: boolean;
    message: string;
    data: T;
    error: string | null;
    pagination: PaginationType;
}
