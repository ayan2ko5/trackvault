
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Goal } from "@/types/transaction.types";

const schema = z.object({
    name: z.string().min(1, "Goal name is required").max(100),
    targetAmount: z
        .number()
        .positive("Must be greater than 0"),
    currentAmount: z
        .number()
        .min(0, "Cannot be negative"),
    deadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface GoalFormProps {
    defaultValues?: Goal;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting?: boolean;
    onCancel: () => void;
    isUpdateProgress?: boolean;
}

const GoalForm = ({
    defaultValues,
    onSubmit,
    isSubmitting = false,
    onCancel,
    isUpdateProgress = false,
}: GoalFormProps) => {
    const isEditing = !!defaultValues;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues?.name || "",
            targetAmount: defaultValues?.targetAmount || undefined,
            currentAmount: defaultValues?.currentAmount ?? 0,
            deadline: defaultValues?.deadline
                ? defaultValues.deadline.split("T")[0]
                : "",
        },
    });

    useEffect(() => {
        if (defaultValues) {
            reset({
                name: defaultValues.name,
                targetAmount: defaultValues.targetAmount,
                currentAmount: defaultValues.currentAmount ?? 0,
                deadline: defaultValues.deadline
                    ? defaultValues.deadline.split("T")[0]
                    : "",
            });
        }
    }, [defaultValues, reset]);

    const handleFormSubmit = async (data: FormData) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {!isUpdateProgress && (
                <Input
                    label="Goal Name"
                    type="text"
                    placeholder="e.g. Laptop, Goa Trip, Emergency Fund"
                    error={errors.name?.message}
                    {...register("name")}
                />
            )}

            {!isUpdateProgress && (
                <Input
                    label="Target Amount (₹)"
                    type="number"
                    placeholder="60000"
                    min="1"
                    leftIcon={<span className="text-gray-400 text-sm">₹</span>}
                    error={errors.targetAmount?.message}
                    {...register("targetAmount", { valueAsNumber: true })}
                />
            )}

            <Input
                label={isUpdateProgress ? "Updated Savings Amount (₹)" : "Current Savings (₹)"}
                type="number"
                placeholder="0"
                min="0"
                leftIcon={<span className="text-gray-400 text-sm">₹</span>}
                error={errors.currentAmount?.message}
                hint={
                    defaultValues && !isUpdateProgress
                        ? `Currently saved: ₹${defaultValues.currentAmount.toLocaleString("en-IN")}`
                        : undefined
                }
                {...register("currentAmount", { valueAsNumber: true })}
            />

            {!isUpdateProgress && (
                <Input
                    label="Target Date (optional)"
                    type="date"
                    error={errors.deadline?.message}
                    {...register("deadline")}
                />
            )}

            <div className="flex gap-3 pt-2">
                <Button variant="outline" fullWidth onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                    {isSubmitting
                        ? "Saving..."
                        : isUpdateProgress
                            ? "Update Progress"
                            : isEditing
                                ? "Update Goal"
                                : "Create Goal"}
                </Button>
            </div>
        </form>
    );
};

export default GoalForm;
