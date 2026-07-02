import type { ReactNode } from "react";
import { cn } from "@/utils/cn";


type StatCardColor = "indigo" | "emerald" | "rose" | "amber" | "violet";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  color: StatCardColor;
  icon: ReactNode;
}

const colorStyles: Record<
  StatCardColor,
  { iconBg: string; iconText: string; valueText: string; blob: string }
> = {
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-950/40",
    iconText: "text-indigo-600 dark:text-indigo-400",
    valueText: "text-indigo-600 dark:text-indigo-400",
    blob: "bg-indigo-500/10",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconText: "text-emerald-600 dark:text-emerald-400",
    valueText: "text-emerald-600 dark:text-emerald-400",
    blob: "bg-emerald-500/10",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconText: "text-rose-600 dark:text-rose-400",
    valueText: "text-rose-600 dark:text-rose-400",
    blob: "bg-rose-500/10",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconText: "text-amber-600 dark:text-amber-400",
    valueText: "text-amber-600 dark:text-amber-400",
    blob: "bg-amber-500/10",
  },
  violet: {
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconText: "text-violet-600 dark:text-violet-400",
    valueText: "text-violet-600 dark:text-violet-400",
    blob: "bg-violet-500/10",
  },
};

const StatCard = ({
  label,
  value,
  change,
  changeDirection = "neutral",
  color,
  icon,
}: StatCardProps) => {
  const styles = colorStyles[color];

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 overflow-hidden hover:shadow-sm transition-shadow duration-200">

      {/* Decorative corner blob — matches prototype's ::before accent */}
      <div
        className={cn(
          "absolute -top-6 -right-6 w-20 h-20 rounded-full",
          styles.blob
        )}
      />

      {/* Content sits above the blob */}
      <div className="relative z-10">
        {/* Label row with icon */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
              styles.iconBg,
              styles.iconText
            )}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>

        {/* Main value */}
        <div className={cn("text-2xl font-bold mb-1", styles.valueText)}>
          {value}
        </div>

        {/* Change indicator */}
        {change && (
          <div
            className={cn(
              "text-xs font-medium",
              changeDirection === "up" && "text-emerald-600 dark:text-emerald-400",
              changeDirection === "down" && "text-rose-500 dark:text-rose-400",
              changeDirection === "neutral" && "text-gray-500 dark:text-gray-400"
            )}
          >
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;