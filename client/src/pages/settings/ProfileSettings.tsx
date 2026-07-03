
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import authService from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

const CURRENCIES = [
    { value: "INR", label: "₹ Indian Rupee (INR)" },
    { value: "USD", label: "$ US Dollar (USD)" },
    { value: "EUR", label: "€ Euro (EUR)" },
    { value: "GBP", label: "£ British Pound (GBP)" },
    { value: "AED", label: "د.إ UAE Dirham (AED)" },
    { value: "SGD", label: "S$ Singapore Dollar (SGD)" },
    { value: "AUD", label: "A$ Australian Dollar (AUD)" },
    { value: "CAD", label: "C$ Canadian Dollar (CAD)" },
];

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    phone: z
        .string()
        .regex(/^[+]?[\d\s\-()\\.]{7,15}$/, "Enter a valid phone number")
        .optional()
        .or(z.literal("")),
    currency: z.enum(["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD"]),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            phone: user?.phone || "",
            currency: (user?.currency as any) || "INR",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                phone: user.phone || "",
                currency: (user.currency as any) || "INR",
            });
        }
    }, [user, reset]);

    const updateMutation = useMutation({
        mutationFn: (data: { name?: string; phone?: string | null; currency?: string }) =>
            authService.updateProfile(data),
        onSuccess: (response) => {
            setUser(response.data.user);
            toast.success("Profile updated successfully!");
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate({
            name: data.name,
            phone: data.phone || null,
            currency: data.currency,
        });
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    return (
        <div className="max-w-xl mx-auto space-y-5">

            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft size={15} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
                            {user?.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-700 transition-colors">
                            <Camera size={11} className="text-white" />
                        </button>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user?.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Photo upload coming soon
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Personal Information
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Rahul Kumar"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email Address
                        </label>
                        <div className="w-full h-11 px-4 flex items-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                            {user?.email}
                            <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                Cannot change
                            </span>
                        </div>
                    </div>

                    <Input
                        label="Phone Number (optional)"
                        type="tel"
                        placeholder="+91 98765 43210"
                        error={errors.phone?.message}
                        hint="Used for account recovery only"
                        {...register("phone")}
                    />

                    <Select
                        label="Preferred Currency"
                        error={errors.currency?.message}
                        hint="Changes how amounts are displayed throughout the app"
                        {...register("currency")}
                    >
                        {CURRENCIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </Select>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={updateMutation.isPending}
                            disabled={!isDirty && !updateMutation.isPending}
                            className={cn(!isDirty ? "opacity-60" : "")}
                        >
                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        {!isDirty && (
                            <span className="ml-3 text-xs text-gray-400 dark:text-gray-500">
                                No changes to save
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;