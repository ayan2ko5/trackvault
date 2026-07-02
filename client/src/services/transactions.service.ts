
import api from "./api";
import type {
    TransactionListResponse,
    Transaction,
    CreateTransactionPayload,
    UpdateTransactionPayload,
    TransactionFilters,
    ApiResponse,
} from "@/types/transaction.types";

export const getAll = async (
    filters: TransactionFilters = {}
): Promise<ApiResponse<TransactionListResponse>> => {

    const params = {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 20,
    };
    const response = await api.get("/transactions", { params });
    return response.data;
};

export const getById = async (
    id: string
): Promise<ApiResponse<{ transaction: Transaction }>> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
};

export const create = async (
    payload: CreateTransactionPayload
): Promise<ApiResponse<{ transaction: Transaction }>> => {
    const response = await api.post("/transactions", payload);
    return response.data;
};

export const update = async (
    id: string,
    payload: UpdateTransactionPayload
): Promise<ApiResponse<{ transaction: Transaction }>> => {
    const response = await api.put(`/transactions/${id}`, payload);
    return response.data;
};

export const remove = async (
    id: string
): Promise<ApiResponse<{}>> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
};

const transactionsService = { getAll, getById, create, update, remove };
export default transactionsService;