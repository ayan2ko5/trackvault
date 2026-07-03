
import { useState } from "react";
import { Plus, Target, CheckCircle2, Calendar, TrendingUp } from "lucide-react";
import {
    useGoals,
    useCreateGoal,
    useUpdateGoal,
    useDeleteGoal,
} from "@/hooks/useGoals";
import Modal from "@/components/ui/Modal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import GoalForm from "@/components/forms/GoalForm";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate, daysUntil } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";
import type { Goal } from "@/types/transaction.types";

const GoalCard = ({
    goal,
    onEdit,
    onDelete,
    onUpdateProgress,
}: {
    goal: Goal;
    onEdit: (g: Goal) => void;
    onDelete: (g: Goal) => void;
    onUpdateProgress: (g: Goal) => void;
}) => {
    const daysLeft = goal.deadline ? daysUntil(goal.deadline) : null;

    const progressPercentage = goal.progressPercentage ?? 0;
    const progressColor =
        progressPercentage >= 100
            ? "violet"
            : progressPercentage >= 75
                ? "emerald"
                : progressPercentage >= 40
                    ? "indigo"
                    : "amber";

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl border p-5 hover:shadow-sm transition-shadow",
                goal.isCompleted
                    ? "border-violet-200 dark:border-violet-800/50"
                    : "border-gray-100 dark:border-gray-800"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            goal.isCompleted
                                ? "bg-violet-50 dark:bg-violet-950/40"
                                : "bg-indigo-50 dark:bg-indigo-950/40"
                        )}
                    >
                        {goal.isCompleted ? (
                            <CheckCircle2
                                size={20}
                                className="text-violet-600 dark:text-violet-400"
                            />
                        ) : (
                            <Target size={20} className="text-indigo-600 dark:text-indigo-400" />
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {goal.name}
                        </div>
                        {goal.deadline && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-xs mt-0.5",
                                    daysLeft !== null && daysLeft <= 30
                                        ? "text-amber-500 dark:text-amber-400"
                                        : "text-gray-400 dark:text-gray-500"
                                )}
                            >
                                <Calendar size={10} />
                                {daysLeft !== null && daysLeft < 0
                                    ? "Deadline passed"
                                    : daysLeft === 0
                                        ? "Due today!"
                                        : `${daysLeft} days left`}
                            </div>
                        )}
                    </div>
                </div>

                {goal.isCompleted && (
                    <span className="text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2 py-1 rounded-full">
                        ✓ Complete
                    </span>
                )}
            </div>

            <div className="flex items-end gap-3 mb-3">
                <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {progressPercentage}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(goal.currentAmount)} saved
                    </div>
                </div>
                <div className="text-right ml-auto">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <TrendingUp size={14} />
                        Goal: {formatCurrency(goal.targetAmount)}
                    </div>
                    {!goal.isCompleted && (
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {formatCurrency(goal.remainingAmount ?? (goal.targetAmount - goal.currentAmount))} to go
                        </div>
                    )}
                </div>
            </div>

            <ProgressBar
                value={progressPercentage}
                max={100}
                color={progressColor as any}
                size="md"
                className="mb-4"
            />

            <div className="flex items-center gap-2">
                {!goal.isCompleted && (
                    <button
                        onClick={() => onUpdateProgress(goal)}
                        className="flex-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 py-2 rounded-xl transition-colors"
                    >
                        Update Progress
                    </button>
                )}
                <button
                    onClick={() => onEdit(goal)}
                    className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-colors font-medium"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(goal)}
                    className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

const GoalCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
        <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div>
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
        </div>
        <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
        <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
);

const GoalsPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Goal | null>(null);
    const [progressTarget, setProgressTarget] = useState<Goal | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

    const { data: goals, isLoading } = useGoals();
    const createMutation = useCreateGoal();
    const updateMutation = useUpdateGoal();
    const deleteMutation = useDeleteGoal();

    const goalList = goals || [];
    const activeGoals = goalList.filter((g) => !g.isCompleted);
    const completedGoals = goalList.filter((g) => g.isCompleted);

    const totalSaved = activeGoals.reduce((s, g) => s + g.currentAmount, 0);
    const totalTarget = activeGoals.reduce((s, g) => s + g.targetAmount, 0);

    const handleCreate = async (payload: any) => {
        await createMutation.mutateAsync(payload);
        setShowAddModal(false);
    };

    const handleUpdate = async (payload: any) => {
        if (!editTarget) return;
        await updateMutation.mutateAsync({ id: editTarget.id, payload });
        setEditTarget(null);
    };

    const handleUpdateProgress = async (payload: any) => {
        if (!progressTarget) return;
        await updateMutation.mutateAsync({ id: progressTarget.id, payload });
        setProgressTarget(null);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteMutation.mutateAsync(deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Savings Goals
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-indigo-200"
                >
                    <Plus size={16} />
                    Add Goal
                </button>
            </div>

            {!isLoading && activeGoals.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-indigo-200 text-xs mb-1">Total saved across all goals</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalSaved)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-200 text-xs mb-1">Total target</p>
                            <p className="text-lg font-semibold">{formatCurrency(totalTarget)}</p>
                        </div>
                    </div>
                    <ProgressBar
                        value={totalSaved}
                        max={totalTarget}
                        color="violet"
                        size="md"
                    />
                    <p className="text-indigo-200 text-xs mt-2">
                        {totalTarget > 0
                            ? `${Math.round((totalSaved / totalTarget) * 100)}% of total target achieved`
                            : "Set targets to track progress"}
                    </p>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => <GoalCardSkeleton key={i} />)}
                </div>
            ) : activeGoals.length === 0 && completedGoals.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center">
                        <Target size={28} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            No savings goals yet
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Create a goal for your next big purchase or milestone.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors mt-2"
                    >
                        <Plus size={15} />
                        Create your first goal
                    </button>
                </div>
            ) : (
                <>
                    {activeGoals.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeGoals.map((goal) => (
                                <GoalCard
                                    key={goal.id}
                                    goal={goal}
                                    onEdit={setEditTarget}
                                    onDelete={setDeleteTarget}
                                    onUpdateProgress={setProgressTarget}
                                />
                            ))}
                        </div>
                    )}

                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                Completed Goals 🎉
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {completedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onEdit={setEditTarget}
                                        onDelete={setDeleteTarget}
                                        onUpdateProgress={setProgressTarget}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Create Savings Goal"
            >
                <GoalForm
                    onSubmit={handleCreate}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit Goal"
            >
                <GoalForm
                    defaultValues={editTarget || undefined}
                    onSubmit={handleUpdate}
                    isSubmitting={updateMutation.isPending}
                    onCancel={() => setEditTarget(null)}
                />
            </Modal>

            <Modal
                isOpen={!!progressTarget}
                onClose={() => setProgressTarget(null)}
                title={`Update Progress — ${progressTarget?.name}`}
                size="sm"
            >
                <GoalForm
                    defaultValues={progressTarget || undefined}
                    onSubmit={handleUpdateProgress}
                    isSubmitting={updateMutation.isPending}
                    onCancel={() => setProgressTarget(null)}
                    isUpdateProgress
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={deleteMutation.isPending}
                title="Delete Goal"
                description={`Delete "${deleteTarget?.name}"? All progress will be lost and this cannot be undone.`}
            />
        </div>
    );
};

export default GoalsPage;
