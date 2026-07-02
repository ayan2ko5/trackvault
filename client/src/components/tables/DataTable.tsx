
import { useState, useMemo } from "react";
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    searchPlaceholder?: string;
    searchKey?: keyof T;
    emptyMessage?: string;
    emptyIcon?: string;
    pagination?: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        total: number;
    };
}


const SkeletonRow = ({ cols }: { cols: number }) => (
    <tr className="animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </td>
        ))}
        <td className="px-4 py-3">
            <div className="flex gap-2">
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
        </td>
    </tr>
);

function DataTable<T extends { id: string }>({
    columns,
    data,
    isLoading = false,
    onEdit,
    onDelete,
    searchPlaceholder = "Search...",
    emptyMessage = "No data found",
    emptyIcon = "📭",
    pagination,
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        return data.filter((row) =>
            Object.values(row as object).some((val) =>
                String(val).toLowerCase().includes(q)
            )
        );
    }, [data, search]);

    const showActions = onEdit || onDelete;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="relative max-w-xs">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={cn(
                                        "px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide",
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {showActions && (
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <SkeletonRow key={i} cols={columns.length} />
                            ))}


                        {!isLoading && filteredData.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + (showActions ? 1 : 0)}
                                    className="text-center py-12"
                                >
                                    <div className="text-3xl mb-2">{emptyIcon}</div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {search ? `No results for "${search}"` : emptyMessage}
                                    </p>
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            filteredData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={cn("px-4 py-3 text-gray-800 dark:text-gray-200", col.className)}
                                        >
                                            {col.render(row)}
                                        </td>
                                    ))}

                                    {showActions && (
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(row)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(row)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total: {pagination.total} records
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronLeft size={13} />
                        </button>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <ChevronRight size={13} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;