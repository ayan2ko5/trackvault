import { Link } from "react-router-dom";
import {
  Utensils, Car, Briefcase, ShoppingBag, Zap, Home,
  GraduationCap, Heart, Film, TrendingUp, Receipt, Fuel,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";
import type { RecentTransaction } from "../../types/dashboard.types";

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  currency?: string;
}

const categoryStyles: Record<string, { icon: any; bg: string; text: string }> = {
  Food: { icon: Utensils, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-500" },
  Grocery: { icon: ShoppingBag, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-500" },
  Travel: { icon: Car, bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-500" },
  Fuel: { icon: Fuel, bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-500" },
  Salary: { icon: Briefcase, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-500" },
  Freelancing: { icon: Briefcase, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-500" },
  Business: { icon: Briefcase, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-500" },
  Shopping: { icon: ShoppingBag, bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-500" },
  Bills: { icon: Zap, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-500" },
  Rent: { icon: Home, bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-500" },
  Education: { icon: GraduationCap, bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-500" },
  Health: { icon: Heart, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-500" },
  Entertainment: { icon: Film, bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-500" },
  Investment: { icon: TrendingUp, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-500" },
};

const defaultStyle = { icon: Receipt, bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-500" };

const formatTransactionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
  }

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

const RecentTransactions = ({
  transactions,
  currency = "INR",
}: RecentTransactionsProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">
            No transactions yet
          </p>
          <Link
            to={ROUTES.EXPENSES}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Add your first transaction →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>
        <Link
          to={ROUTES.EXPENSES}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {transactions.map((txn) => {
          const style = categoryStyles[txn.category] || defaultStyle;
          const Icon = style.icon;
          const isIncome = txn.type === "INCOME";

          return (
            <div key={txn.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  style.bg,
                  style.text
                )}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {txn.category}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {formatTransactionDate(txn.date)}
                  {txn.note && ` · ${txn.note}`}
                </div>
              </div>

              <div
                className={cn(
                  "text-sm font-semibold flex-shrink-0",
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500 dark:text-rose-400"
                )}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(txn.amount, currency)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
