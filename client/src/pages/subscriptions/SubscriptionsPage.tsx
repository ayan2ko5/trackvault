
import { useState } from "react";
import { Plus, Repeat, Bell, Calendar, ToggleLeft, ToggleRight } from "lucide-react";
import {
    useSubscriptions,
    useCreateSubscription,
    useUpdateSubscription,
    useDeleteSubscription,
} from "@/hooks/useSubscriptions";
import Modal from "@/components/ui/Modal";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";
import { SUBSCRIPTION_CYCLES } from "@/constants/categories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Subscription, CreateSubscriptionPayload } from "@/types/transaction.types";

const subSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    amount: z.number().positive("Amount is required"),
    dueDate: z.string().min(1, "Due date is required"),
    cycle: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
    isActive: z.boolean().optional().default(true),
});

type SubFormData = z.infer<typeof subSchema>;

const SubscriptionForm = ({
    defaultValues,
    onSubmit,
    isSubmitting,
    onCancel,
}: {
    defaultValues?: Subscription;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    onCancel: () => void;
}) => {
    const isEditing = !!defaultValues;

    const { register, handleSubmit, formState: { errors } } = useForm<SubFormData>({
        resolver: zodResolver(subSchema) as any,
        defaultValues: {
            name: defaultValues?.name ?? "",
            amount: defaultValues?.amount ?? 0,
            dueDate: defaultValues?.dueDate
                ? defaultValues.dueDate.split("T")[0]
                : new Date().toISOString().split("T")[0],
            cycle: defaultValues?.cycle ?? "MONTHLY",
            isActive: defaultValues?.isActive ?? true,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Subscription Name"
                type="text"
                placeholder="Netflix, Spotify, Internet..."
                error={errors.name?.message}
                {...register("name")}
            />
            <Input
                label="Amount (₹)"
                type="number"
                placeholder="649"
                min="1"
                leftIcon={<span className="text-gray-400 text-sm">₹</span>}
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
            />
            <Input
                label="Next Due Date"
                type="date"
                error={errors.dueDate?.message}
                {...register("dueDate")}
            />
            <Select label="Billing Cycle" {...register("cycle")}>
                {SUBSCRIPTION_CYCLES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </Select>
            <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={onCancel} type="button">Cancel</Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add Subscription"}
                </Button>
            </div>
        </form>
    );
};

const SubscriptionCard = ({
    sub,
    onEdit,
    onDelete,
    onToggle,
    isTogglingId,
}: {
    sub: Subscription;
    onEdit: (s: Subscription) => void;
    onDelete: (s: Subscription) => void;
    onToggle: (s: Subscription) => void;
    isTogglingId: string | null;
}) => {
    const serviceColors: Record<string, string> = {
        netflix: "bg-red-600",
        spotify: "bg-green-500",
        amazon: "bg-amber-500",
        youtube: "bg-red-500",
        hotstar: "bg-blue-600",
        apple: "bg-gray-800 dark:bg-gray-600",
    };

    const nameLower = sub.name.toLowerCase();
    const dotColor =
        Object.entries(serviceColors).find(([key]) =>
            nameLower.includes(key)
        )?.[1] || "bg-indigo-500";

    const cycleLabel = {
        WEEKLY: "/ week",
        MONTHLY: "/ month",
        YEARLY: "/ year",
    }[sub.cycle];

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl border p-4 hover:shadow-sm transition-all",
                sub.isActive
                    ? "border-gray-100 dark:border-gray-800"
                    : "border-gray-100 dark:border-gray-800 opacity-60"
            )}
        >
            <div className="flex items-center gap-3">

                <div
                    className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                        dotColor
                    )}
                >
                    {sub.name.slice(0, 1).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {sub.name}
                        </span>
                        {sub.isDueSoon && sub.isActive && (
                            <Badge color="amber" size="sm">
                                Due Soon
                            </Badge>
                        )}
                        {!sub.isActive && (
                            <Badge color="gray" size="sm">Paused</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Calendar size={10} />
                            Due {formatDate(sub.dueDate)}
                        </span>
                        <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Repeat size={10} />
                            {sub.cycle.charAt(0) + sub.cycle.slice(1).toLowerCase()}
                        </span>
                    </div>
                </div>

                <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                        {formatCurrency(sub.amount)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{cycleLabel}</div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">

                <button
                    onClick={() => onToggle(sub)}
                    disabled={isTogglingId === sub.id}
                    className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    {sub.isActive ? (
                        <ToggleRight size={16} className="text-indigo-500" />
                    ) : (
                        <ToggleLeft size={16} />
                    )}
                    {sub.isActive ? "Active" : "Paused"}
                </button>

                <div className="flex gap-1.5">
                    <button
                        onClick={() => onEdit(sub)}
                        className="text-xs text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(sub)}
                        className="text-xs text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const SubCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
    </div>
);

const SubscriptionsPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Subscription | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const { data, isLoading } = useSubscriptions();
    const createMutation = useCreateSubscription();
    const updateMutation = useUpdateSubscription();
    const deleteMutation = useDeleteSubscription();

    const subscriptions = data?.subscriptions || [];
    const totalMonthlyCost = data?.totalMonthlyCost || 0;

    const activeCount = subscriptions.filter((s) => s.isActive).length;
    const dueSoonCount = subscriptions.filter((s) => s.isDueSoon && s.isActive).length;

    const handleCreate = async (payload: any) => {
        await createMutation.mutateAsync(payload as CreateSubscriptionPayload);
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

    const handleToggle = async (sub: Subscription) => {
        setTogglingId(sub.id);
        try {
            await updateMutation.mutateAsync({
                id: sub.id,
                payload: { isActive: !sub.isActive },
            });
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="space-y-5 max-w-6xl mx-auto">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {activeCount} active subscription{activeCount !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-indigo-200"
                >
                    <Plus size={16} />
                    Add Subscription
                </button>
            </div>

            {!isLoading && subscriptions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            label: "Monthly Cost",
                            value: formatCurrency(totalMonthlyCost),
                            color: "text-rose-600 dark:text-rose-400",
                            bg: "bg-rose-50 dark:bg-rose-950/30",
                            icon: "💸",
                        },
                        {
                            label: "Active Subscriptions",
                            value: `${activeCount}`,
                            color: "text-indigo-600 dark:text-indigo-400",
                            bg: "bg-indigo-50 dark:bg-indigo-950/30",
                            icon: "✅",
                        },
                        {
                            label: "Due This Week",
                            value: `${dueSoonCount}`,
                            color: "text-amber-600 dark:text-amber-400",
                            bg: "bg-amber-50 dark:bg-amber-950/30",
                            icon: "⏰",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
                        >
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-xl mb-2", s.bg)}>
                                {s.icon}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{s.label}</div>
                            <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && dueSoonCount > 0 && (
                <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                    <Bell size={15} className="flex-shrink-0" />
                    <span>
                        <strong>{dueSoonCount} subscription{dueSoonCount > 1 ? "s" : ""}</strong> due within 7 days.
                    </span>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => <SubCardSkeleton key={i} />)}
                </div>
            ) : subscriptions.length === 0 ? (

                <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center">
                        <Repeat size={28} className="text-indigo-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No subscriptions tracked</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add Netflix, Spotify, and other recurring bills.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-9 rounded-xl transition-colors mt-2"
                    >
                        <Plus size={15} />
                        Add first subscription
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {[...subscriptions]
                        .sort((a, b) => {
                            if (a.isDueSoon && !b.isDueSoon) return -1;
                            if (!a.isDueSoon && b.isDueSoon) return 1;
                            if (a.isActive && !b.isActive) return -1;
                            if (!a.isActive && b.isActive) return 1;
                            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                        })
                        .map((sub) => (
                            <SubscriptionCard
                                key={sub.id}
                                sub={sub}
                                onEdit={setEditTarget}
                                onDelete={setDeleteTarget}
                                onToggle={handleToggle}
                                isTogglingId={togglingId}
                            />
                        ))}
                </div>
            )}


            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Subscription">
                <SubscriptionForm
                    onSubmit={handleCreate}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Subscription">
                <SubscriptionForm
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
                title="Delete Subscription"
                description={`Remove ${deleteTarget?.name} from your tracker? This cannot be undone.`}
            />
        </div>
    );
};

export default SubscriptionsPage;