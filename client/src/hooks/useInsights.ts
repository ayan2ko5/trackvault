
import { useQuery } from "@tanstack/react-query";
import { generateInsights } from "@/utils/insightEngine";
import { calculateHealthScore } from "@/utils/healthScore";
import api from "@/services/api";

const getMonthStrings = () => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;

    const lastDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastYear = lastDate.getFullYear();
    const lastMonth = lastDate.getMonth() + 1;

    return {
        thisMonth: `${thisYear}-${String(thisMonth).padStart(2, "0")}`,
        lastMonth: `${lastYear}-${String(lastMonth).padStart(2, "0")}`,
    };
};

const useInsights = () => {
    const { thisMonth, lastMonth } = getMonthStrings();

    return useQuery({
        queryKey: ["insights", thisMonth, lastMonth],
        queryFn: async () => {
            const [thisRes, lastRes, budgetsRes] = await Promise.all([
                api.get("/dashboard/summary").then((r) => r.data.data),

                api
                    .get("/transactions", {
                        params: { month: lastMonth, limit: 200 },
                    })
                    .then((r) => r.data.data),

                api
                    .get("/budgets", { params: { month: thisMonth } })
                    .then((r) => r.data.data),
            ]);

            const thisMonthData = {
                totalIncome: thisRes.totalIncome || 0,
                totalExpenses: thisRes.totalExpenses || 0,
                savings: thisRes.savings || 0,
                categoryBreakdown: thisRes.categoryBreakdown || [],
                budgets: Array.isArray(budgetsRes) ? budgetsRes : [],
            };

            const lastTransactions = lastRes?.transactions || [];

            const lastCategoryMap = new Map<string, number>();
            for (const txn of lastTransactions) {
                if (txn.type === "EXPENSE") {
                    const prev = lastCategoryMap.get(txn.category) || 0;
                    lastCategoryMap.set(txn.category, prev + txn.amount);
                }
            }

            const lastMonthIncome = lastTransactions
                .filter((t: any) => t.type === "INCOME")
                .reduce((s: number, t: any) => s + t.amount, 0);

            const lastMonthExpenses = lastTransactions
                .filter((t: any) => t.type === "EXPENSE")
                .reduce((s: number, t: any) => s + t.amount, 0);

            const lastMonthData = {
                totalIncome: lastMonthIncome,
                totalExpenses: lastMonthExpenses,
                savings: Math.max(lastMonthIncome - lastMonthExpenses, 0),
                categoryBreakdown: Array.from(lastCategoryMap.entries()).map(
                    ([category, amount]) => ({ category, amount, count: 1 })
                ),
                budgets: [],
            };

            const insights = generateInsights(thisMonthData, lastMonthData);

            const healthScore = calculateHealthScore(
                thisMonthData.totalIncome,
                thisMonthData.totalExpenses,
                thisMonthData.budgets,
                lastMonthData.totalExpenses
            );

            return {
                insights,
                healthScore,
                thisMonthData,
                lastMonthData,
                period: thisRes.period || {
                    month: new Date().toLocaleString("default", { month: "long" }),
                    year: new Date().getFullYear(),
                },
            };
        },
        staleTime: 1000 * 60,
        retry: 1,
    });
};

export default useInsights;