
import { cn } from "@/utils/cn";
import type { HealthScoreBreakdown } from "@/types/dashboard.types";

interface HealthScoreCardProps {
  score: number;
  label: "Poor" | "Average" | "Good" | "Excellent";
  breakdown: HealthScoreBreakdown;
}

const labelStyles: Record<"Poor" | "Average" | "Good" | "Excellent",{ text: string; bar: string }> = {
  Poor: { text: "text-rose-500 dark:text-rose-400", bar: "bg-rose-500" },
  Average: { text: "text-amber-500 dark:text-amber-400", bar: "bg-amber-500" },
  Good: { text: "text-indigo-500 dark:text-indigo-400", bar: "bg-indigo-500" },
  Excellent: { text: "text-violet-500 dark:text-violet-400", bar: "bg-violet-500" },
};

const HealthScoreCard = ({ score, label, breakdown }: HealthScoreCardProps) => {
  const styles = labelStyles[label] || labelStyles.Average;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      {/* Header */}
      <div className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Financial Health Score
      </div>

      {/* Big score number */}
      <div className="text-center mb-3">
        <div className={cn("text-4xl font-bold", styles.text)}>{score}</div>
        <div className={cn("text-xs font-medium mt-0.5", styles.text)}>{label}</div>
      </div>

      {/* Overall progress bar — gradient like your prototype */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-violet-500 transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      {/* Tier labels */}
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mb-4">
        <span>Poor</span>
        <span>Average</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>

      {/* Score breakdown — the 3 components of the formula */}
      <div className="space-y-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
        <ScoreBreakdownRow
          label="Savings Rate"
          value={breakdown.savingsRateScore}
          max={35}
          color="bg-emerald-500"
        />
        <ScoreBreakdownRow
          label="Budget Adherence"
          value={breakdown.budgetScore}
          max={35}
          color="bg-amber-500"
        />
        <ScoreBreakdownRow
          label="Expense Consistency"
          value={breakdown.consistencyScore}
          max={30}
          color="bg-indigo-500"
        />
      </div>
    </div>
  );
};

const ScoreBreakdownRow = ({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-200">
          {value}/{max}
        </span>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthScoreCard;