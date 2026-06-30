
import { useQuery } from "@tanstack/react-query";
import dashboardService from "@/services/dashboard.service";

export const DASHBOARD_QUERY_KEY = ["dashboard", "summary"] as const;

const useDashboard = () => {
  const query = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,

    queryFn: async () => {
      const response = await dashboardService.getSummary();
      return response.data; 
    },

    staleTime: 1000 * 30,

    retry: 1,
  });

  return {
    summary: query.data,

    isLoading: query.isLoading,

    isFetching: query.isFetching,

    isError: query.isError,
    error: query.error,

    refetch: query.refetch,
  };
};

export default useDashboard;