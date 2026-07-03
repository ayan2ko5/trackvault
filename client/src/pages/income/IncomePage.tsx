
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
    INCOME_SOURCES,
    getCategoryIcon,
    generateMonthOptions,
} from "@/constants/categories";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatRelativeDate, currentMonthValue } from "@/utils/dateHelpers";
import type { Transaction } from "@/types/transaction.types";

const IncomePage = () => {

    const [month, setMonth] = useState(currentMonthValue());
    const [source, setSource] = useState("");
    const [page, setPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Transaction | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

    const { data, isLoading } = useTransactions({
        type: "INCOME",
        month,
        category: source || undefined,
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
            header: "Source",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="text-base">{getCategoryIcon(row.category)}</span>
                    <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {row.category}
                        </div>
                        {row.note && (
                            <div className="text-xs text-gray-400 truncate max-w-[160px]">
                                {row.note}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "amount",
            header: "Amount",
            render: (row) => (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(row.amount)}
                </span>
            ),
        },
        {
            key: "date",
            header: "Date",
            render: (row) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeDate(row.date)}
                </span>
            ),
        },
        {
            key: "source",
            header: "Type",
            render: (row) => (
                <Badge color="emerald" size="sm">
                    {row.source || row.category}
                </Badge>
            ),
        },
    ];

    const monthOptions = generateMonthOptions();
    const transactions = data?.transactions || [];
    const pagination = data?.pagination;

    const totalThisMonth = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="space-y-4 max-w-6xl mx-auto">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Income
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {pagination?.total ?? 0} income entries
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-emerald-200"
                >
                    <Plus size={16} />
                    Add Income
                </button>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
                <p className="text-emerald-100 text-sm mb-1">Total income this month</p>
                <p className="text-3xl font-bold">{formatCurrency(totalThisMonth)}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
                <Select
                    value={month}
                    onChange={(e) => { setMonth(e.target.value); setPage(1); }}
                    className="w-44"
                >
                    {monthOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </Select>

                <Select
                    value={source}
                    onChange={(e) => { setSource(e.target.value); setPage(1); }}
                    className="w-40"
                >
                    <option value="">All Sources</option>
                    {INCOME_SOURCES.map((s) => (
                        <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                    ))}
                </Select>
            </div>

            <DataTable
                columns={columns}
                data={transactions}
                isLoading={isLoading}
                onEdit={(row) => setEditTarget(row)}
                onDelete={(row) => setDeleteTarget(row)}
                searchPlaceholder="Search income..."
                emptyMessage="No income recorded yet. Add your first income!"
                emptyIcon="💰"
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
                title="Add Income"
            >
                <TransactionForm
                    type="INCOME"
                    onSubmit={handleCreate}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <Modal
                isOpen={!!editTarget}
                onClose={() => setEditTarget(null)}
                title="Edit Income"
            >
                <TransactionForm
                    type="INCOME"
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
                title="Delete Income Entry"
                description={`Delete ${deleteTarget?.category} income of ${deleteTarget ? formatCurrency(deleteTarget.amount) : ""}? This cannot be undone.`}
            />
        </div>
    );
};

export default IncomePage;
