
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import subscriptionsService from "@/services/subscriptions.service";
import { DASHBOARD_QUERY_KEY } from "@/hooks/useDashboard";
import toast from "react-hot-toast";
import type {
    CreateSubscriptionPayload,
    UpdateSubscriptionPayload,
} from "@/types/transaction.types";

export const SUBSCRIPTION_KEYS = {
    all: ["subscriptions"] as const,
    list: () => ["subscriptions", "list"] as const,
};

export const useSubscriptions = () => {
    return useQuery({
        queryKey: SUBSCRIPTION_KEYS.list(),
        queryFn: async () => {
            const response = await subscriptionsService.getAll();
            return response.data;
        },
        staleTime: 1000 * 30,
    });
};

export const useCreateSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateSubscriptionPayload) =>
            subscriptionsService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Subscription added!");
        },
        onError: () => toast.error("Failed to add subscription"),
    });
};

export const useUpdateSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: UpdateSubscriptionPayload;
        }) => subscriptionsService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Subscription updated!");
        },
        onError: () => toast.error("Failed to update subscription"),
    });
};

export const useDeleteSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => subscriptionsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
            queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
            toast.success("Subscription removed");
        },
        onError: () => toast.error("Failed to remove subscription"),
    });
};