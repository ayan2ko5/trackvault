
const StatCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
      {/* Icon + label row placeholder */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Value placeholder */}
      <div className="h-7 w-24 rounded bg-gray-200 dark:bg-gray-800 mb-2" />

      {/* Change text placeholder */}
      <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
};

export default StatCardSkeleton;