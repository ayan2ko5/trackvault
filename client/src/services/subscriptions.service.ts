
import api from "./api";
import type {
    Subscription,
    CreateSubscriptionPayload,
    UpdateSubscriptionPayload,
    ApiResponse,
} from "@/types/transaction.types";

interface SubscriptionListData {
    subscriptions: Subscription[];
    totalMonthlyCost: number;
}

export const getAll = async (): Promise<ApiResponse<SubscriptionListData>> => {
    const response = await api.get("/subscriptions");
    return response.data;
};

export const getById = async (
    id: string
): Promise<ApiResponse<{ subscription: Subscription }>> => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
};

export const create = async (
    payload: CreateSubscriptionPayload
): Promise<ApiResponse<{ subscription: Subscription }>> => {
    const response = await api.post("/subscriptions", payload);
    return response.data;
};

export const update = async (
    id: string,
    payload: UpdateSubscriptionPayload
): Promise<ApiResponse<{ subscription: Subscription }>> => {
    const response = await api.put(`/subscriptions/${id}`, payload);
    return response.data;
};

export const remove = async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
};

const subscriptionsService = { getAll, getById, create, update, remove };
export default subscriptionsService;