import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrencyCompact, formatCurrency } from "../../utils/formatCurrency";
import type { MonthlyTrendItem } from "../../types/dashboard.types";

interface MonthlyTrendChartProps {
  data: MonthlyTrendItem[];
  currency?: string;
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-gray-900 dark:text-white mb-1.5">{label}</p>
      {payload.map((item: any) => (
        <div key={item.dataKey} className="flex items-center gap-2 mb-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.fill }}
          />
          <span className="text-gray-500 dark:text-gray-400 capitalize">
            {item.dataKey}:
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(item.value, currency)}
          </span>
        </div>
      ))}
    </div>
  );
};

const MonthlyTrendChart = ({ data, currency = "INR" }: MonthlyTrendChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No transaction data yet. Add some expenses to see trends.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 0, left: -16, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          className="text-gray-100 dark:text-gray-800"
        />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
          className="text-gray-400 dark:text-gray-500"
        />

        <YAxis
          tickFormatter={(value) => formatCurrencyCompact(value, currency)}
          tick={{ fontSize: 11, fill: "currentColor" }}
          axisLine={false}
          tickLine={false}
          className="text-gray-400 dark:text-gray-500"
        />

        <Tooltip
          content={<CustomTooltip currency={currency} />}
          cursor={{ fill: "rgba(99,102,241,0.04)" }}
        />

        <Bar
          dataKey="expense"
          fill="#f43f5e"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />

        <Bar
          dataKey="income"
          fill="#6366f1"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyTrendChart;
