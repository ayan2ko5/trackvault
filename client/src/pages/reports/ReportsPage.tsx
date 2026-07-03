
import { useState } from "react";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useExport from "@/hooks/useExport";
import ProgressBar from "@/components/ui/ProgressBar";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/utils/formatCurrency";
import { currentMonthValue } from "@/utils/dateHelpers";
import { getCategoryIcon } from "@/constants/categories";
import { cn } from "@/utils/cn";
import api from "@/services/api";

const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleString("default", { month: "long", year: "numeric" });
        options.push({ value, label });
    }
    return options;
};

const ReportsPage = () => {
    const [month, setMonth] = useState(currentMonthValue());
    const { isExporting, downloadCSV, downloadExcel, downloadPDF } = useExport();
    const monthOptions = getMonthOptions();

    const { data: summary, isLoading } = useQuery({
        queryKey: ["reports", "summary", month],
        queryFn: async () => {
            const res = await api.get("/dashboard/summary", {
                params: { month },
            });
            return res.data.data;
        },
        staleTime: 1000 * 60,
    });

    const { data: txnData } = useQuery({
        queryKey: ["reports", "transactions", month],
        queryFn: async () => {
            const res = await api.get("/transactions", {
                params: { month, limit: 500 },
            });
            return res.data.data;
        },
        staleTime: 1000 * 60,
    });

    const transactions = txnData?.transactions || [];
    const categoryBreakdown = summary?.categoryBreakdown || [];
    const totalIncome = summary?.totalIncome || 0;
    const totalExpenses = summary?.totalExpenses || 0;
    const savings = summary?.savings || 0;
    const monthlyTrend = summary?.monthlyTrend || [];

    const exportData = {
        transactions,
        categoryBreakdown,
        totalIncome,
        totalExpenses,
        savings,
        period: month,
    };

    const selectedMonthLabel =
        monthOptions.find((m) => m.value === month)?.label || month;

    return (
        <div className="max-w-6xl mx-auto space-y-5">

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {selectedMonthLabel} financial summary
                    </p>
                </div>

                <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-48"
                >
                    {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </Select>
            </div>

            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => downloadCSV(exportData)}
                    disabled={isExporting || transactions.length === 0}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={15} />
                    Export CSV
                </button>
                <button
                    onClick={() => downloadExcel(exportData)}
                    disabled={isExporting || transactions.length === 0}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileSpreadsheet size={15} />
                    Export Excel
                </button>
                <button
                    onClick={() => downloadPDF(exportData)}
                    disabled={isExporting || transactions.length === 0}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-rose-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileText size={15} />
                    Export PDF
                </button>
                {isExporting && (
                    <span className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                        Generating...
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { label: "Total Income", value: formatCurrency(totalIncome), color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                    { label: "Total Expenses", value: formatCurrency(totalExpenses), color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
                    { label: "Net Savings", value: formatCurrency(savings), color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/30" },
                ].map((s) => (
                    <div key={s.label} className={cn("rounded-2xl p-4", s.bg)}>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{s.label}</div>
                        <div className={cn("text-2xl font-bold", s.color)}>{isLoading ? "—" : s.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Category Breakdown
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Expenses by category · {selectedMonthLabel}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="p-5 space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="flex justify-between mb-1">
                                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : categoryBreakdown.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
                            No expense data for this month
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {categoryBreakdown.slice(0, 8).map((cat: any) => {
                                const pct = totalExpenses > 0
                                    ? Math.round((cat.amount / totalExpenses) * 100)
                                    : 0;
                                return (
                                    <div key={cat.category} className="px-5 py-3">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span>{getCategoryIcon(cat.category)}</span>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                                    {cat.category}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    ({cat.count} txn{cat.count !== 1 ? "s" : ""})
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                                                    {formatCurrency(cat.amount)}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-2">{pct}%</span>
                                            </div>
                                        </div>
                                        <ProgressBar value={pct} max={100} color="auto" size="sm" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Monthly Trend
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Last 6 months income vs expenses
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="p-5 space-y-3 animate-pulse">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                            ))}
                        </div>
                    ) : monthlyTrend.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
                            No monthly data available yet
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Month</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Income</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Expenses</th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Saved</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {[...monthlyTrend].reverse().map((m: any) => {
                                        const saved = m.income - m.expense;
                                        return (
                                            <tr key={m.month} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                                <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{m.month}</td>
                                                <td className="px-5 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {formatCurrency(m.income)}
                                                </td>
                                                <td className="px-5 py-3 text-right text-rose-600 dark:text-rose-400 font-medium">
                                                    {formatCurrency(m.expense)}
                                                </td>
                                                <td className={cn(
                                                    "px-5 py-3 text-right font-semibold",
                                                    saved >= 0
                                                        ? "text-indigo-600 dark:text-indigo-400"
                                                        : "text-rose-600 dark:text-rose-400"
                                                )}>
                                                    {saved >= 0 ? "+" : ""}{formatCurrency(saved)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {!isLoading && transactions.length > 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                    {transactions.length} transactions in {selectedMonthLabel} · Export includes all records
                </p>
            )}
        </div>
    );
};

export default ReportsPage;