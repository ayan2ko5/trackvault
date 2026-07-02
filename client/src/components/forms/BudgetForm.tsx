
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { EXPENSE_CATEGORIES, generateMonthOptions } from "@/constants/categories";
import { currentMonthValue } from "@/utils/dateHelpers";
import type { Budget } from "@/types/transaction.types";

const schema = z.object({
    category: z.string().min(1, "Category is required"),
    amount: z
        .number()
        .positive("Amount must be greater than 0"),
    month: z.string().min(1, "Month is required"),
});

type FormData = z.infer<typeof schema>;

interface BudgetFormProps {
    defaultValues?: Budget;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting?: boolean;
    onCancel: () => void;
}

const BudgetForm = ({
    defaultValues,
    onSubmit,
    isSubmitting = false,
    onCancel,
}: BudgetFormProps) => {
    const isEditing = !!defaultValues;
    const monthOptions = generateMonthOptions();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            category: defaultValues?.category || "",
            amount: defaultValues?.amount || undefined,
            month: currentMonthValue(),
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                category: defaultValues.category,
                amount: defaultValues.amount,
                month: currentMonthValue(),
            });
        }
    }, [defaultValues, reset]);

    const handleFormSubmit = async (data: FormData) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            <Select
                label="Category"
                error={errors.category?.message}
                disabled={isEditing}
                {...register("category")}
            >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                    </option>
                ))}
            </Select>

            <Input
                label="Budget Amount (₹)"
                type="number"
                placeholder="5000"
                min="1"
                leftIcon={<span className="text-gray-400 text-sm">₹</span>}
                error={errors.amount?.message}
                {...register("amount", { valueAsNumber: true })}
            />

            <Select
                label="Month"
                error={errors.month?.message}
                disabled={isEditing}
                {...register("month")}
            >
                {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                        {m.label}
                    </option>
                ))}
            </Select>

            <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                    {isSubmitting ? "Saving..." : isEditing ? "Update Budget" : "Set Budget"}
                </Button>
            </div>
        </form>
    );
};

export default BudgetForm;