
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import budgetsService from "@/services/budgets.service";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import toast from "react-hot-toast";
import { useEffect } from "react";
import type {
    CreateBudgetPayload,
    UpdateBudgetPayload,
} from "@/types/transaction.types";

export const BUDGET_KEYS = {
    all: ["budgets"] as const,
    list: (month?: string) => ["budgets", "list", month] as const,
};

export const useBudgets = (month?: string) => {
    const query = useQuery({
        queryKey: BUDGET_KEYS.list(month),
        queryFn: async () => {
            const response = await budgetsService.getAll(month);
            return response.data;
        },
        staleTime: 1000 * 30,
    });

    useEffect(() => {
        if (!query.data) return;

        const budgets = query.data ?? [];
        budgets.forEach((budget) => {
            if (budget.alertStatus === "EXCEEDED") {
                toast.error(
                    `🚨 ${budget.category} Budget Exceeded! Spent ${budget.percentageUsed}%`,
                    { id: `budget-exceeded-${budget.id}`, duration: 6000 }
                );
            } else if (budget.alertStatus === "WARNING") {
                toast(
                    `⚠️ ${budget.category} Budget is ${budget.percentageUsed}% used`,
                    {
                        id: `budget-warning-${budget.id}`,
                        duration: 5000,
                        icon: "⚠️",
                    }
                );
            }
        });
    }, [query.data]);

    return query;
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBudgetPayload) =>
            budgetsService.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Budget created successfully!");
        },

        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Failed to create budget";
            toast.error(msg);
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateBudgetPayload;
        }) => budgetsService.update(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Budget updated!");
        },

        onError: () => toast.error("Failed to update budget"),
    });
};

export const useDeleteBudget = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => budgetsService.remove(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Budget deleted");
        },

        onError: () => toast.error("Failed to delete budget"),
    });
};