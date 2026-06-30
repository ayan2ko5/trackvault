import api from "./api";
import type { DashboardApiResponse } from "@/types/dashboard.types";

export const getSummary = async (): Promise<DashboardApiResponse> => {
  const response = await api.get<DashboardApiResponse>("/dashboard/summary");
  return response.data;
};

const dashboardService = {
  getSummary,
};

export default dashboardService;