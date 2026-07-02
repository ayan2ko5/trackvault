import { useState } from "react";
import {
    useBudgets,
    useCreateBudget,
    useUpdateBudget,
    useDeleteBudget,
} from "@/hooks/useBudgets";
import { Plus, Wallet, AlertTriangle, CheckCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import BudgetForm from "@/components/forms/BudgetForm";
import ProgressBar from "@/components/ui/ProgressBar";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatMonth, currentMonthValue } from "@/utils/dateHelpers";
import { generateMonthOptions } from "@/constants/categories";
import { cn } from "@/utils/cn";
import type { Budget, BudgetAlertStatus } from "@/types/transaction.types";


// Alert styles per status
const alertStyles: Record<
    BudgetAlertStatus,
    { card: string; bar: "auto" | "emerald" | "amber" | "rose"; badge: string; icon: React.ComponentType<{ size?: number; className?: string }>; }
> = {
    OK: {
        card: "border-gray-100 dark:border-gray-800",
        bar: "emerald",
        badge: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
        icon: CheckCircle,
    },
    WARNING: {
        card: "border-amber-200 dark:border-amber-800/50",
        bar: "amber",
        badge: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400",
        icon: AlertTriangle,
    },
    EXCEEDED: {
        card: "border-rose-200 dark:border-rose-800/50",
        bar: "rose",
        badge: "text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400",
        icon: AlertTriangle,
    },
};

// Single budget card component
const BudgetCard = ({
    budget,
    onEdit,
    onDelete,
}: {
    budget: Budget;
    onEdit: (b: Budget) => void;
    onDelete: (b: Budget) => void;
}) => {
    const styles = alertStyles[budget.alertStatus ?? "OK"];
    const AlertIcon = styles.icon;

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl border p-5 hover:shadow-sm transition-shadow",
                styles.card
            )}
        >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                        <Wallet size={17} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {budget.category}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                            {formatMonth(budget.month)}
                        </div>
                    </div>
                </div>

                {/* Alert status badge */}
                <div
                    className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        styles.badge
                    )}
                >
                    <AlertIcon size={11} />
                    {budget.alertStatus === "OK"
                        ? "On Track"
                        : budget.alertStatus === "WARNING"
                            ? "Warning"
                            : "Exceeded"}
                </div>
            </div>

            {/* Spending info */}
            <div className="flex items-end justify-between mb-2">
                <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Spent</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(budget.currentSpending ?? 0)}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Budget</div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {formatCurrency(budget.amount)}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <ProgressBar
                value={budget.currentSpending ?? 0}
                max={budget.amount}
                color={styles.bar}
                size="md"
                className="mb-2"
            />

            {/* Bottom row */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {budget.percentageUsed}% used ·{" "}
                    {budget.alertStatus === "EXCEEDED" ? (
                        <span className="text-rose-500 font-medium">
                            Over by {formatCurrency((budget.currentSpending ?? 0) - budget.amount)}
                        </span>
                    ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {formatCurrency(budget.remainingAmount ?? 0)} left
                        </span>
                    )}
                </span>

                {/* Edit / Delete buttons */}
                <div className="flex gap-1.5">
                    <button
                        onClick={() => onEdit(budget)}
                        className="text-xs text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(budget)}
                        className="text-xs text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---- Skeleton card shown while loading ----
const BudgetCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </div>
        <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
);

// ---- Main BudgetsPage component ----
const BudgetsPage = () => {
    const [month, setMonth] = useState(currentMonthValue());
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Budget | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);

    // React Query hooks
    const { data: budgets, isLoading } = useBudgets(month);
    const createMutation = useCreateBudget();
    const updateMutation = useUpdateBudget();
    const deleteMutation = useDeleteBudget();

    const monthOptions = generateMonthOptions();
    const budgetList: Budget[] = Array.isArray(budgets) ? budgets : [];

    // Separate budgets by alert status for stats row
    const exceeded = budgetList.filter((b) => b.alertStatus === "EXCEEDED").length;
    const warning = budgetList.filter((b) => b.alertStatus === "WARNING").length;
    const onTrack = budgetList.filter((b) => b.alertStatus === "OK").length;
    const totalBudgeted = budgetList.reduce((s, b) => s + b.amount, 0);
    const totalSpent = budgetList.reduce((s, b) => s + (b.currentSpending ?? 0), 0);

    // ---- Handlers ----
    const handleCreate = async (payload: any) => {
        await createMutation.mutateAsync(payload);
        setShowAddModal(false);
    };

    const handleUpdate = async (payload: any) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, payload });
        setEditTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteMutation.mutateAsync(deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-5 max-w-6xl mx-auto">

            {/* ---- Page header ---- */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budgets</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {budgetList.length} budgets set for this period
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-indigo-200"
                >
                    <Plus size={16} />
                    Set Budget
                </button>
            </div>

            {/* ---- Summary stats ---- */}
            {!isLoading && budgetList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Total Budgeted", value: formatCurrency(totalBudgeted), color: "text-indigo-600 dark:text-indigo-400" },
                        { label: "Total Spent", value: formatCurrency(totalSpent), color: "text-rose-600 dark:text-rose-400" },
                        { label: "On Track", value: `${onTrack} budgets`, color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Alerts", value: `${exceeded + warning} budgets`, color: "text-amber-600 dark:text-amber-400" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</div>
                            <div className={cn("text-lg font-bold", s.color)}>{s.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---- Alert banners ---- */}
            {!isLoading && exceeded > 0 && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 rounded-xl p-3 flex items-center gap-2.5 text-sm text-rose-700 dark:text-rose-300">
                    <AlertTriangle size={16} className="flex-shrink-0" />
                    <span>
                        <strong>{exceeded} budget{exceeded > 1 ? "s" : ""} exceeded</strong> — review your spending below.
                    </span>
                </div>
            )}

            {/* ---- Month filter ---- */}
            <div className="flex gap-3">
                <Select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-48"
                >
                    {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </Select>
            </div>

            {/* ---- Budget cards grid ---- */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <BudgetCardSkeleton key={i} />)}
                </div>
            ) : budgetList.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center">
                        <Wallet size={28} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No budgets set</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Set spending limits per category to stay on track.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors mt-2"
                    >
                        <Plus size={15} />
                        Set your first budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Sort: exceeded first, then warnings, then OK */}
                    {[...budgetList]
                        .sort((a, b) => {
                            const order = { EXCEEDED: 0, WARNING: 1, OK: 2 };
                            return order[a.alertStatus ?? "OK"] - order[b.alertStatus ?? "OK"];
                        })
                        .map((budget) => (
                            <BudgetCard
                                key={budget.id}
                                budget={budget}
                                onEdit={setEditTarget}
                                onDelete={setDeleteTarget}
                            />
                        ))}
                </div>
            )}

            {/* ---- Add Modal ---- */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Set Budget"
            >
                <BudgetForm
                    onSubmit={handleCreate}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            {/* ---- Edit Modal ---- */}
            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit Budget"
            >
                <BudgetForm
                    defaultValues={editTarget || undefined}
                    onSubmit={handleUpdate}
                    isSubmitting={updateMutation.isPending}
                    onCancel={() => setEditTarget(null)}
                />
            </Modal>

            {/* ---- Delete Confirm ---- */}
            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={deleteMutation.isPending}
                title="Delete Budget"
                description={`Delete the ${deleteTarget?.category} budget of ${deleteTarget ? formatCurrency(deleteTarget.amount) : ""}? This cannot be undone.`}
            />
        </div>
    );
};

export default BudgetsPage;