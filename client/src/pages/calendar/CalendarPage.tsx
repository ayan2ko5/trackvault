
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { getCategoryIcon } from "@/constants/categories";
import { cn } from "@/utils/cn";

interface Transaction {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    category: string;
    date: string;
    note: string | null;
}

const groupByDay = (transactions: Transaction[], year: number, month: number) => {
    const map = new Map<number, Transaction[]>();
    for (const txn of transactions) {
        const d = new Date(txn.date);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!map.has(day)) map.set(day, []);
            map.get(day)!.push(txn);
        }
    }
    return map;
};

const monthName = (month: number, year: number) =>
    new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" });

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarPage = () => {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;

    const { data, isLoading } = useQuery({
        queryKey: ["calendar", monthStr],
        queryFn: async () => {
            const res = await api.get("/transactions", {
                params: { month: monthStr, limit: 200 },
            });
            return res.data.data?.transactions as Transaction[];
        },
        staleTime: 1000 * 30,
    });

    const transactions = data || [];
    const byDay = groupByDay(transactions, year, month);

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
        setSelectedDay(null);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
        setSelectedDay(null);
    };

    const dayTotals = (day: number) => {
        const txns = byDay.get(day) || [];
        const income = txns.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
        const expense = txns.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
        return { income, expense, count: txns.length };
    };

    const selectedTxns = selectedDay ? byDay.get(selectedDay) || [] : [];
    const today = now.getDate();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

    return (
        <div className="max-w-5xl mx-auto space-y-4">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calendar</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {transactions.length} transactions in {monthName(month, year)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChevronLeft size={15} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[140px] text-center">
                        {monthName(month, year)}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ChevronRight size={15} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            <div className={cn("grid gap-4", selectedDay ? "grid-cols-1 lg:grid-cols-[1fr_280px]" : "grid-cols-1")}>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
                        {DAYS_OF_WEEK.map((d) => (
                            <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-50 dark:border-gray-800/50" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const { income, expense, count } = dayTotals(day);
                            const isToday = isCurrentMonth && day === today;
                            const isSelected = selectedDay === day;
                            const hasData = count > 0;

                            return (
                                <div
                                    key={day}
                                    onClick={() => setSelectedDay(isSelected ? null : day)}
                                    className={cn(
                                        "min-h-[80px] p-2 border-b border-r border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors",
                                        "hover:bg-gray-50/80 dark:hover:bg-gray-800/50",
                                        isSelected && "bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50",
                                        hasData && !isSelected && "bg-gray-50/40 dark:bg-gray-800/20"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mb-1",
                                        isToday
                                            ? "bg-indigo-600 text-white"
                                            : isSelected
                                                ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                                                : "text-gray-700 dark:text-gray-300"
                                    )}>
                                        {day}
                                    </div>

                                    {isLoading ? (
                                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                                    ) : (
                                        <div className="space-y-0.5">
                                            {expense > 0 && (
                                                <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium truncate">
                                                    -{formatCurrency(expense)}
                                                </div>
                                            )}
                                            {income > 0 && (
                                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                                                    +{formatCurrency(income)}
                                                </div>
                                            )}
                                            {count > 0 && (
                                                <div className="flex gap-0.5 mt-1">
                                                    {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                                                        <div key={i} className="w-1 h-1 rounded-full bg-indigo-400 dark:bg-indigo-500" />
                                                    ))}
                                                    {count > 4 && <div className="text-[8px] text-gray-400">+{count - 4}</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedDay && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden h-fit">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {new Date(year, month, selectedDay).toLocaleDateString("en-IN", {
                                        weekday: "long", day: "numeric", month: "long",
                                    })}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {selectedTxns.length} transaction{selectedTxns.length !== 1 ? "s" : ""}
                                </div>
                            </div>
                            <button onClick={() => setSelectedDay(null)}>
                                <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                            </button>
                        </div>

                        {selectedTxns.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">
                                No transactions on this day
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {selectedTxns.map((txn) => (
                                    <div key={txn.id} className="flex items-center gap-3 px-4 py-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0",
                                            txn.type === "INCOME"
                                                ? "bg-emerald-50 dark:bg-emerald-950/30"
                                                : "bg-rose-50 dark:bg-rose-950/30"
                                        )}>
                                            {getCategoryIcon(txn.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {txn.category}
                                            </div>
                                            {txn.note && (
                                                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{txn.note}</div>
                                            )}
                                        </div>
                                        <div className={cn(
                                            "text-sm font-semibold flex-shrink-0",
                                            txn.type === "INCOME"
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400"
                                        )}>
                                            {txn.type === "INCOME" ? "+" : "-"}{formatCurrency(txn.amount)}
                                        </div>
                                    </div>
                                ))}

                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-gray-600 dark:text-gray-400">Day Total</span>
                                        <span className={cn(
                                            dayTotals(selectedDay).income >= dayTotals(selectedDay).expense
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400"
                                        )}>
                                            {formatCurrency(Math.abs(dayTotals(selectedDay).income - dayTotals(selectedDay).expense))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Income
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Expense
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Transaction dot
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;