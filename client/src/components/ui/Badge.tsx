
import { cn } from "@/utils/cn";

type BadgeColor =
    | "rose" | "emerald" | "indigo" | "amber"
    | "violet" | "blue" | "gray" | "red" | "green";

interface BadgeProps {
    children: React.ReactNode;
    color?: BadgeColor;
    size?: "sm" | "md";
    className?: string;
}

const colorStyles: Record<BadgeColor, string> = {
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    red: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    green: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
};

const Badge = ({
    children,
    color = "gray",
    size = "sm",
    className,
}: BadgeProps) => {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full",
                size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
                colorStyles[color],
                className
            )}
        >
            {children}
        </span>
    );
};

export default Badge;