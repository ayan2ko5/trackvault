// ============================================================
// FILE: client/src/types/transaction.types.ts
// ============================================================

export type TransactionType = "INCOME" | "EXPENSE";
export type PaymentMethod = string;
export type IncomeSource = string;

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    note: string | null;
    paymentMethod: PaymentMethod | null;
    source: IncomeSource | null;
    createdAt: string;
    updatedAt: string;
}

export interface TransactionFilters {
    type?: TransactionType;
    category?: string;
    month?: string;
    year?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface TransactionPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface TransactionListResponse {
    transactions: Transaction[];
    pagination: TransactionPagination;
}

export interface CreateTransactionPayload {
    type: TransactionType;
    amount: number;
    category: string;
    date: string;
    note?: string;
    paymentMethod?: PaymentMethod;
    source?: IncomeSource;
}

export interface UpdateTransactionPayload {
    type?: TransactionType;
    amount?: number;
    category?: string;
    date?: string;
    note?: string | null;
    paymentMethod?: PaymentMethod | null;
    source?: IncomeSource | null;
}

export type BudgetAlertStatus = "OK" | "WARNING" | "EXCEEDED";

export interface Budget {
    id: string;
    userId: string;
    category: string;
    amount: number;
    month: string;
    currentSpending?: number;
    remainingAmount?: number;
    percentageUsed?: number;
    alertStatus?: BudgetAlertStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBudgetPayload {
    category: string;
    amount: number;
    month: string;
}

export interface UpdateBudgetPayload {
    amount?: number;
    category?: string;
}

export interface Goal {
    id: string;
    userId: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string | null;
    isCompleted: boolean;
    progressPercentage?: number;
    remainingAmount?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateGoalPayload {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: string | null;
}

export interface UpdateGoalPayload {
    name?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: string | null;
    isCompleted?: boolean;
}

export type SubscriptionCycle = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Subscription {
    id: string;
    userId: string;
    name: string;
    amount: number;
    dueDate: string;
    cycle: SubscriptionCycle;
    isActive: boolean;
    monthlyEquivalent?: number;
    isDueSoon?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSubscriptionPayload {
    name: string;
    amount: number;
    dueDate: string;
    cycle: SubscriptionCycle;
    isActive?: boolean;
}

export interface UpdateSubscriptionPayload {
    name?: string;
    amount?: number;
    dueDate?: string;
    cycle?: SubscriptionCycle;
    isActive?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}