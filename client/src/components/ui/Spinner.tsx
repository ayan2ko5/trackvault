import { cn } from "../../utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

const Spinner = ({ size = "md", className, label = "Loading..." }: SpinnerProps) => {
  const sizeStyles = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "animate-spin rounded-full border-gray-200 border-t-indigo-600",
        sizeStyles[size],
        className
      )}
    />
  );
};

export const FullPageSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 gap-4">
    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
      <span className="text-white text-xl font-bold">T</span>
    </div>
    <Spinner size="lg" />
    <p className="text-sm text-gray-500 dark:text-gray-400">Loading TrackVault...</p>
  </div>
);

export default Spinner;
