// ============================================================
// FILE: client/src/pages/dashboard/DashboardPage.tsx
// PURPOSE: The complete dashboard page. Fetches data with
//          useDashboard(), shows skeletons while loading, and
//          renders all 5 stat cards, 2 charts, recent transactions,
//          and quick actions — matching your prototype layout.
//
// LAYOUT (matches prototype's .dash-grid):
//   Row 1: 5 stat cards in a row
//   Row 2: [Bar chart + Recent Transactions] | [Quick Actions + Pie + Health Score]
// ============================================================

import { TrendingUp, TrendingDown, Scale, PiggyBank, AlertTriangle } from "lucide-react";
import useDashboard from "@/hooks/useDashboard";
import useAuthStore from "@/store/authStore";
import StatCard from "@/components/cards/StatCard";
import StatCardSkeleton from "@/components/cards/StatCardSkeleton";
import HealthScoreCard from "@/components/cards/HealthScoreCard";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import RecentTransactions from "./RecentTransactions";
import QuickActions from "./QuickActions";
import { formatCurrency } from "@/utils/formatCurrency";

const DashboardPage = () => {
  const { summary, isLoading, isError, refetch } = useDashboard();
  const { user } = useAuthStore();
  const currency = user?.currency || "INR";

  // ---- ERROR STATE ----
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-rose-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Couldn't load your dashboard
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Something went wrong fetching your data.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* ============================================================
          ROW 1 — Five Summary Cards
          Shows skeletons while loading, real cards once data arrives
      ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {isLoading ? (
          // Show 5 skeleton placeholders matching real card dimensions
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Income"
              value={formatCurrency(summary!.totalIncome, currency)}
              change={`This ${summary!.period.month}`}
              changeDirection="up"
              color="emerald"
              icon={<TrendingUp size={15} />}
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(summary!.totalExpenses, currency)}
              change={`This ${summary!.period.month}`}
              changeDirection="down"
              color="rose"
              icon={<TrendingDown size={15} />}
            />
            <StatCard
              label="Balance"
              value={formatCurrency(summary!.balance, currency)}
              change={summary!.balance >= 0 ? "Healthy surplus" : "Spending over income"}
              changeDirection={summary!.balance >= 0 ? "up" : "down"}
              color="indigo"
              icon={<Scale size={15} />}
            />
            <StatCard
              label="Savings"
              value={formatCurrency(summary!.savings, currency)}
              change={
                summary!.totalIncome > 0
                  ? `${Math.round((summary!.savings / summary!.totalIncome) * 100)}% savings rate`
                  : "No income recorded"
              }
              changeDirection="up"
              color="amber"
              icon={<PiggyBank size={15} />}
            />
            <StatCard
              label="Health Score"
              value={`${summary!.healthScore}`}
              change={summary!.healthScoreLabel}
              changeDirection={summary!.healthScore >= 61 ? "up" : "down"}
              color="violet"
              icon={<Scale size={15} />}
            />
          </>
        )}
      </div>

      {/* ============================================================
          BUDGET ALERTS — shown only if any budgets need attention
          (matches your Module 6 alert spec: "Food Budget 80% Used")
      ============================================================ */}
      {!isLoading && summary && summary.budgetAlerts.length > 0 && (
        <div className="space-y-2">
          {summary.budgetAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm border ${
                alert.alertStatus === "EXCEEDED"
                  ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300"
                  : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300"
              }`}
            >
              <AlertTriangle size={15} className="flex-shrink-0" />
              <span>
                <strong>{alert.category} Budget</strong>{" "}
                {alert.alertStatus === "EXCEEDED"
                  ? `exceeded by ${formatCurrency(alert.currentSpending - alert.amount, currency)}`
                  : `${alert.percentageUsed}% used — ${formatCurrency(
                      alert.amount - alert.currentSpending,
                      currency
                    )} remaining`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================
          ROW 2 — Main content grid
          Left (wider): Bar chart + Recent Transactions
          Right (narrower): Quick Actions + Pie Chart + Health Score
      ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* ---- LEFT COLUMN ---- */}
        <div className="space-y-4 min-w-0">

          {/* Monthly Trend Bar Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Monthly Expense Trend
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Expense
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="h-[220px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <MonthlyTrendChart data={summary!.monthlyTrend} currency={currency} />
            )}
          </div>

          {/* Recent Transactions */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 h-64 animate-pulse" />
          ) : (
            <RecentTransactions transactions={summary!.recentTransactions} />
          )}
        </div>

        {/* ---- RIGHT COLUMN ---- */}
        <div className="space-y-4 min-w-0">

          {/* Quick Actions */}
          <QuickActions />

          {/* Category Breakdown Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Category Breakdown
            </h3>
            {isLoading ? (
              <div className="h-[110px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <CategoryPieChart data={summary!.categoryBreakdown} />
            )}
          </div>

          {/* Financial Health Score */}
          {isLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 h-56 animate-pulse" />
          ) : (
            <HealthScoreCard
              score={summary!.healthScore}
              label={summary!.healthScoreLabel}
              breakdown={summary!.healthScoreBreakdown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;