// ============================================================
// FILE: client/src/components/forms/TransactionForm.tsx
// PURPOSE: Single form used for both Add Expense AND Add Income
//          AND Edit on both. The "type" prop controls which
//          fields appear (category vs source, paymentMethod).
//
// USED IN: ExpensesPage.tsx, IncomePage.tsx
// ============================================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { EXPENSE_CATEGORIES, INCOME_SOURCES, PAYMENT_METHODS } from "@/constants/categories";
import { todayAsInputValue } from "@/utils/dateHelpers";
import type { Transaction, TransactionType } from "@/types/transaction.types";

// ---- Schema ----
const schema = z.object({
    amount: z
        .number()
        .positive("Amount must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    note: z.string().max(500).optional(),
    paymentMethod: z.string().optional(),
    source: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
    type: TransactionType;
    defaultValues?: Transaction;  // if provided → edit mode
    onSubmit: (data: any) => Promise<void>;
    isSubmitting?: boolean;
    onCancel: () => void;
}

const TransactionForm = ({
    type,
    defaultValues,
    onSubmit,
    isSubmitting = false,
    onCancel,
}: TransactionFormProps) => {
    const isEditing = !!defaultValues;
    const isExpense = type === "EXPENSE";

    const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_SOURCES;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            amount: defaultValues?.amount || undefined,
            category: defaultValues?.category || "",
            date: defaultValues?.date
                ? defaultValues.date.split("T")[0]
                : todayAsInputValue(),
            note: defaultValues?.note || "",
            paymentMethod: defaultValues?.paymentMethod || "",
            source: defaultValues?.source || "",
        },
    });

    // Reset form when defaultValues change (switching between edit targets)
    useEffect(() => {
        if (defaultValues) {
            reset({
                amount: defaultValues.amount,
                category: defaultValues.category,
                date: defaultValues.date.split("T")[0],
                note: defaultValues.note || "",
                paymentMethod: defaultValues.paymentMethod || "",
                source: defaultValues.source || "",
            });
        }
    }, [defaultValues, reset]);

    const handleFormSubmit = async (data: FormData) => {
        // Build payload matching your backend's createTransactionSchema
        const payload: any = {
            type,
            amount: data.amount,
            category: data.category,
            date: data.date,
            ...(data.note && { note: data.note }),
            ...(isExpense && data.paymentMethod && { paymentMethod: data.paymentMethod }),
            ...(!isExpense && data.source && { source: data.source }),
        };
        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {/* Amount */}
            <Input
                label="Amount (₹)"
                type="number"
                placeholder="0"
                step="1"
                min="1"
                leftIcon={<span className="text-gray-400 text-sm font-medium">₹</span>}
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
            />

            {/* Category / Source */}
            <Select
                label={isExpense ? "Category" : "Income Source"}
                error={errors.category?.message}
                {...register("category")}
            >
                <option value="">
                    {isExpense ? "Select category" : "Select source"}
                </option>
                {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                    </option>
                ))}
            </Select>

            {/* Date */}
            <Input
                label="Date"
                type="date"
                error={errors.date?.message}
                {...register("date")}
            />

            {/* Payment method — only for expenses */}
            {isExpense && (
                <Select label="Payment Method" {...register("paymentMethod")}>
                    <option value="">Select method (optional)</option>
                    {PAYMENT_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </Select>
            )}

            {/* Note */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Note (optional)
                </label>
                <textarea
                    placeholder="Add a note..."
                    rows={2}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    {...register("note")}
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant={isExpense ? "danger" : "secondary"}
                    fullWidth
                    isLoading={isSubmitting}
                >
                    {isSubmitting
                        ? "Saving..."
                        : isEditing
                            ? "Update"
                            : isExpense
                                ? "Add Expense"
                                : "Add Income"}
                </Button>
            </div>
        </form>
    );
};

export default TransactionForm;