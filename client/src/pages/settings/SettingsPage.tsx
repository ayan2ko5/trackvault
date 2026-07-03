
import { useNavigate } from "react-router-dom";
import {
    User, Shield, ChevronRight, Palette, Bell,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import useUIStore from "@/store/uiStore";

const settingsSections = [
    {
        title: "Profile",
        description: "Update your name, phone number, and currency preference",
        icon: User,
        route: ROUTES.PROFILE,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/40",
    },
    {
        title: "Security",
        description: "Change your password and manage account security",
        icon: Shield,
        route: ROUTES.SECURITY,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
];

const SettingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { theme, toggleTheme } = useUIStore();

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    return (
        <div className="max-w-2xl mx-auto space-y-5">

            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Manage your account preferences
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {user?.photoUrl ? (
                            <img src={user.photoUrl} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name || "User"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                                {user?.currency || "INR"}
                            </span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                {user?.phone || "No phone"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.PROFILE)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex-shrink-0"
                    >
                        Edit
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {settingsSections.map(({ title, description, icon: Icon, route, color, bg }) => (
                    <button
                        key={route}
                        onClick={() => navigate(route)}
                        className="w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-all text-left group"
                    >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                            <Icon size={20} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 transition-colors" />
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center flex-shrink-0">
                    <Palette size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Appearance</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Currently: {theme === "dark" ? "Dark mode" : "Light mode"}
                    </div>
                </div>
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "relative w-11 h-6 rounded-full transition-colors duration-300 flex-shrink-0",
                        theme === "dark" ? "bg-indigo-600" : "bg-gray-200"
                    )}
                >
                    <span className={cn(
                        "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300",
                        theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                    )} />
                </button>
            </div>

            <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-2">
                Track-Vault · Version 1.0.0
            </div>
        </div>
    );
};

export default SettingsPage;