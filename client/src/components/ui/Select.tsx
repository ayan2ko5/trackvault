
import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, className, id, children, ...props }, ref) => {
        const selectId = id || `select-${Math.random().toString(36).slice(2)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        className={cn(
                            "w-full appearance-none rounded-xl border bg-white dark:bg-gray-900",
                            "text-sm text-gray-900 dark:text-gray-100",
                            "pl-4 pr-10 py-2.5 h-11",
                            "focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            !error
                                ? "border-gray-200 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                                : "border-rose-400 dark:border-rose-500 focus:ring-rose-400",
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>


                    <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>

                {error && (
                    <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">
                        ⚠ {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
export default Select;