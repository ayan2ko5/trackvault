
import { useState } from "react";
import { Plus } from "lucide-react";
import {
    useTransactions,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
} from "@/hooks/useTransactions";
import DataTable, { Column } from "@/components/tables/DataTable";
import Modal from "@/components/ui/Modal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import TransactionForm from "@/components/forms/TransactionForm";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import {
    EXPENSE_CATEGORIES,
    getCategoryColor,
    getCategoryIcon,
    generateMonthOptions,
} from "@/constants/categories";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeDate, currentMonthValue } from "@/utils/dateHelpers";
import type { Transaction } from "@/types/transaction.types";

const ExpensesPage = () => {
    const [month, setMonth] = useState(currentMonthValue());
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);


    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Transaction | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

    const { data, isLoading } = useTransactions({
        type: "EXPENSE",
        month,
        category: category || undefined,
        page,
        limit: 15,
    });

    const createMutation = useCreateTransaction();
    const updateMutation = useUpdateTransaction();
    const deleteMutation = useDeleteTransaction();

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

    const columns: Column<Transaction>[] = [
        {
            key: "category",
            header: "Category",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(row.category)}</span>
                    <Badge color={getCategoryColor(row.category) as any}>
                        {row.category}
                    </Badge>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            render: (row) => (
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(row.amount)}
                </span>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (row) => (
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatRelativeDate(row.date)}
                </span>
            ),
        },
        {
            key: "paymentMethod",
            header: "Method",
            render: (row) => (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {row.paymentMethod || "—"}
                </span>
            ),
        },
        {
            key: "note",
            header: "Note",
            render: (row) => (
                <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate block">
                    {row.note || "—"}
                </span>
            ),
        },
    ];

    const monthOptions = generateMonthOptions();
    const transactions = data?.transactions || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-4 max-w-6xl mx-auto">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Expenses
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {pagination?.total ?? 0} expenses this month
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-rose-200"
                >
                    <Plus size={16} />
                    Add Expense
                </button>
            </div>

            <div className="flex gap-3 flex-wrap">
                <Select
                    value={month}
                    onChange={(e) => { setMonth(e.target.value); setPage(1); }}
                    className="w-40"
                >
                    {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </Select>

                <Select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="w-40"
                >
                    <option value="">All Categories</option>
                    {EXPENSE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                    ))}
                </Select>
            </div>

            <DataTable
                columns={columns}
                data={transactions}
                isLoading={isLoading}
                onEdit={(row) => setEditTarget(row)}
                onDelete={(row) => setDeleteTarget(row)}
                searchPlaceholder="Search expenses..."
                emptyMessage="No expenses found. Add your first expense!"
                emptyIcon="💸"
                pagination={
                    pagination
                        ? {
                            page: pagination.page,
                            totalPages: pagination.totalPages,
                            total: pagination.total,
                            onPageChange: setPage,
                        }
                        : undefined
                }
            />
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add Expense"
            >
                <TransactionForm
                    type="EXPENSE"
                    onSubmit={handleCreate}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit Expense"
            >
                <TransactionForm
                    type="EXPENSE"
                    defaultValues={editTarget || undefined}
                    onSubmit={handleUpdate}
                    isSubmitting={updateMutation.isPending}
                    onCancel={() => setEditTarget(null)}
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={deleteMutation.isPending}
                title="Delete Expense"
                description={`Delete ${deleteTarget?.category} expense of ${deleteTarget ? formatCurrency(deleteTarget.amount) : ""}? This cannot be undone.`}
            />
        </div>
    );
};

export default ExpensesPage;
