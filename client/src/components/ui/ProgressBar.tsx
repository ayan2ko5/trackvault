
import { cn } from "@/utils/cn";

interface ProgressBarProps {
    value: number;
    max?: number;
    color?: "auto" | "emerald" | "amber" | "rose" | "indigo" | "violet";
    size?: "sm" | "md";
    showLabel?: boolean;
    className?: string;
}

const ProgressBar = ({
    value,
    max = 100,
    color = "auto",
    size = "sm",
    showLabel = false,
    className,
}: ProgressBarProps) => {
    const percentage = Math.min(Math.round((value / max) * 100), 100);


    const autoColor =
        percentage >= 100 ? "bg-rose-500"
            : percentage >= 80 ? "bg-amber-500"
                : "bg-emerald-500";

    const fixedColors: Record<string, string> = {
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
        indigo: "bg-indigo-500",
        violet: "bg-violet-500",
    };

    const barColor = color === "auto" ? autoColor : fixedColors[color];
    const height = size === "sm" ? "h-1.5" : "h-2.5";

    return (
        <div className={className}>
            <div
                className={cn(
                    "w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden",
                    height
                )}
            >
                <div
                    className={cn("h-full rounded-full transition-all duration-700", barColor)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{percentage}% used</span>
                    <span>{100 - percentage}% left</span>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;