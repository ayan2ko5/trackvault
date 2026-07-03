
import api from "./api";
import type {
    Goal,
    CreateGoalPayload,
    UpdateGoalPayload,
    ApiResponse,
} from "@/types/transaction.types";

export const getAll = async (): Promise<ApiResponse<{ goals: Goal[] }>> => {
    const response = await api.get("/goals");
    return response.data;
};

export const getById = async (
    id: string
): Promise<ApiResponse<{ goal: Goal }>> => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
};

export const create = async (
    payload: CreateGoalPayload
): Promise<ApiResponse<{ goal: Goal }>> => {
    const response = await api.post("/goals", payload);
    return response.data;
};

export const update = async (
    id: string,
    payload: UpdateGoalPayload
): Promise<ApiResponse<{ goal: Goal }>> => {
    const response = await api.put(`/goals/${id}`, payload);
    return response.data;
};

export const remove = async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
};

const goalsService = { getAll, getById, create, update, remove };
export default goalsService;