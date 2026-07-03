
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import transactionsService from "@/services/transactions.service";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import toast from "react-hot-toast";
import type {
    TransactionFilters,
    CreateTransactionPayload,
    UpdateTransactionPayload,
} from "@/types/transaction.types";

export const TRANSACTION_KEYS = {
    all: ["transactions"] as const,
    list: (filters: TransactionFilters) =>
        ["transactions", "list", filters] as const,
    detail: (id: string) => ["transactions", "detail", id] as const,
};

export const useTransactions = (filters: TransactionFilters = {}) => {
    return useQuery({
        queryKey: TRANSACTION_KEYS.list(filters),
        queryFn: async () => {
            const response = await transactionsService.getAll(filters);
            return response.data;
        },
        staleTime: 1000 * 30,
        placeholderData: (prev) => prev,
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTransactionPayload) =>
            transactionsService.create(payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });

            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });

            const type = variables.type === "INCOME" ? "Income" : "Expense";
            toast.success(`${type} added successfully! 💰`);
        },

        onError: (error: any) => {
            const msg =
                error?.response?.data?.message || "Failed to add transaction";
            toast.error(msg);
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateTransactionPayload;
        }) => transactionsService.update(id, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
            queryClient.invalidateQueries({
                queryKey: TRANSACTION_KEYS.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Transaction updated!");
        },

        onError: (error: any) => {
            const msg =
                error?.response?.data?.message || "Failed to update transaction";
            toast.error(msg);
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => transactionsService.remove(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTION_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Transaction deleted");
        },

        onError: () => {
            toast.error("Failed to delete transaction");
        },
    });
};