
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, Shield, AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";
import { removeToken } from "@/utils/token.utils";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";
import api from "@/services/api";

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must have at least one uppercase letter")
            .regex(/[a-z]/, "Must have at least one lowercase letter")
            .regex(/[0-9]/, "Must have at least one number"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

const SecuritySettings = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

    const newPwd = watch("newPassword", "");

    const checks = [
        { label: "8+ characters", pass: newPwd.length >= 8 },
        { label: "Uppercase", pass: /[A-Z]/.test(newPwd) },
        { label: "Lowercase", pass: /[a-z]/.test(newPwd) },
        { label: "Number", pass: /[0-9]/.test(newPwd) },
    ];

    const onSubmit = async (data: PasswordFormData) => {
        setIsSubmitting(true);
        try {
            await api.put("/auth/change-password", {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success("Password changed! Please log in again.");
            reset();
            setTimeout(() => {
                logout();
                removeToken();
                navigate(ROUTES.LOGIN, { replace: true });
            }, 2000);
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                "Failed to change password. Check your current password.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogoutAll = () => {
        logout();
        removeToken();
        toast.success("Logged out successfully");
        navigate(ROUTES.LOGIN, { replace: true });
    };

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
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Security</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account security</p>
                </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 flex items-center gap-3">
                <Shield size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                    <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Account Secured
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Your account is protected with a password. Keep it strong and unique.
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Change Password
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Input
                        label="Current Password"
                        type={showCurrent ? "text" : "password"}
                        placeholder="Your current password"
                        error={errors.currentPassword?.message}
                        rightElement={
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} tabIndex={-1}>
                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        }
                        {...register("currentPassword")}
                    />

                    <div>
                        <Input
                            label="New Password"
                            type={showNew ? "text" : "password"}
                            placeholder="Min 8 chars, with uppercase & number"
                            error={errors.newPassword?.message}
                            rightElement={
                                <button type="button" onClick={() => setShowNew(!showNew)} tabIndex={-1}>
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            }
                            {...register("newPassword")}
                        />

                        {newPwd && (
                            <div className="grid grid-cols-2 gap-1 mt-2">
                                {checks.map(({ label, pass }) => (
                                    <div
                                        key={label}
                                        className={cn(
                                            "flex items-center gap-1 text-xs",
                                            pass
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-gray-400 dark:text-gray-500"
                                        )}
                                    >
                                        <span>{pass ? "✓" : "○"}</span>
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm New Password"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your new password"
                        error={errors.confirmPassword?.message}
                        rightElement={
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        }
                        {...register("confirmPassword")}
                    />

                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 flex gap-2">
                        <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            After changing your password, you'll be logged out and need to log in again.
                        </p>
                    </div>

                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        {isSubmitting ? "Changing..." : "Change Password"}
                    </Button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Sign Out
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Sign out of your account on this device.
                </p>
                <Button variant="outline" onClick={handleLogoutAll} leftIcon={<LogOut size={15} />}>
                    Sign Out
                </Button>
            </div>
        </div>
    );
};

export default SecuritySettings;