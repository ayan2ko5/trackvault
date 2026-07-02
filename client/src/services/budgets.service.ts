
import api from "./api";
import type {
    Budget,
    CreateBudgetPayload,
    UpdateBudgetPayload,
    ApiResponse,
} from "@/types/transaction.types";

export const getAll = async (
    month?: string
): Promise<ApiResponse<Budget[]>> => {
    const params = month ? { month } : {};
    const response = await api.get("/budgets", { params });
    return response.data;
};

export const getById = async (
    id: string
): Promise<ApiResponse<{ budget: Budget }>> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
};

export const create = async (
    payload: CreateBudgetPayload
): Promise<ApiResponse<{ budget: Budget }>> => {
    const response = await api.post("/budgets", payload);
    return response.data;
};

export const update = async (
    id: string,
    payload: UpdateBudgetPayload
): Promise<ApiResponse<{ budget: Budget }>> => {
    const response = await api.put(`/budgets/${id}`, payload);
    return response.data;
};

export const remove = async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
};

const budgetsService = { getAll, getById, create, update, remove };
export default budgetsService;