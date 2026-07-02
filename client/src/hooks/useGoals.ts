
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import goalsService from "@/services/goals.service";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import toast from "react-hot-toast";
import type { CreateGoalPayload, UpdateGoalPayload } from "@/types/transaction.types";

export const GOAL_KEYS = {
    all: ["goals"] as const,
    list: () => ["goals", "list"] as const,
};

export const useGoals = () => {
    return useQuery({
        queryKey: GOAL_KEYS.list(),
        queryFn: async () => {
            const response = await goalsService.getAll();
            return response.data.goals;
        },
        staleTime: 1000 * 30,
    });
};

export const useCreateGoal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateGoalPayload) => goalsService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Goal created! Keep saving 🎯");
        },
        onError: () => toast.error("Failed to create goal"),
    });
};

export const useUpdateGoal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
            goalsService.update(id, payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            const goal = response.data.goal;
            if (goal?.isCompleted) {
                toast.success("🎉 Goal completed! Congratulations!");
            } else {
                toast.success("Goal updated!");
            }
        },
        onError: () => toast.error("Failed to update goal"),
    });
};

export const useDeleteGoal = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => goalsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Goal deleted");
        },
        onError: () => toast.error("Failed to delete goal"),
    });
};