import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { ROUTES } from "../../constants/routes";
import type { CategoryBreakdownItem } from "../../types/dashboard.types";

interface CategoryPieChartProps {
  data: CategoryBreakdownItem[];
  currency?: string;
}

const COLORS = ["#f43f5e", "#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, currency }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900 dark:text-white">{item.category}</p>
      <p className="text-gray-500 dark:text-gray-400">
        {formatCurrency(item.amount, currency)} · {item.percentage}%
      </p>
    </div>
  );
};

const CategoryPieChart = ({ data, currency = "INR" }: CategoryPieChartProps) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div className="h-[140px] flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
        No expenses recorded yet this month.
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const top5 = data.slice(0, 5);
  const others = data.slice(5);
  const othersTotal = others.reduce((sum, item) => sum + item.amount, 0);

  const chartData = [
    ...top5.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
    })),
    ...(othersTotal > 0
      ? [
          {
            category: "Others",
            amount: othersTotal,
            count: others.reduce((sum, item) => sum + item.count, 0),
            percentage: total > 0 ? Math.round((othersTotal / total) * 100) : 0,
          },
        ]
      : []),
  ];

  const handleCategoryClick = (category: string) => {
    if (category === "Others") return;
    navigate(`${ROUTES.EXPENSES}?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <ResponsiveContainer width={110} height={110}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={50}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleCategoryClick(chartData[index].category)}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {chartData.map((item, index) => (
          <button
            key={item.category}
            onClick={() => handleCategoryClick(item.category)}
            disabled={item.category === "Others"}
            className="flex items-center gap-2 w-full text-left group disabled:cursor-default"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
              {item.category}
            </span>
            <span className="text-xs font-semibold text-gray-900 dark:text-white flex-shrink-0">
              {item.percentage}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
