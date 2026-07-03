
import { useState } from "react";
import { Plus, Tag, Trash2, Lock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from "@/constants/categories";
import { cn } from "@/utils/cn";
import toast from "react-hot-toast";

const EMOJI_OPTIONS = [
    "🏋️", "☕", "🐾", "📱", "🎮", "🎵", "✈️", "🎁",
    "🍕", "🚿", "💊", "🎨", "🏊", "🚲", "🌿", "💈",
    "🏠", "📦", "🎯", "🔧", "💻", "📸", "🎭", "🧘",
];

const COLOR_OPTIONS = [
    { label: "Indigo", value: "#6366f1", tw: "bg-indigo-500" },
    { label: "Rose", value: "#f43f5e", tw: "bg-rose-500" },
    { label: "Emerald", value: "#10b981", tw: "bg-emerald-500" },
    { label: "Amber", value: "#f59e0b", tw: "bg-amber-500" },
    { label: "Violet", value: "#8b5cf6", tw: "bg-violet-500" },
    { label: "Cyan", value: "#06b6d4", tw: "bg-cyan-500" },
    { label: "Orange", value: "#f97316", tw: "bg-orange-500" },
    { label: "Teal", value: "#14b8a6", tw: "bg-teal-500" },
];

interface CustomCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    isCustom: boolean;
}

const AddCategoryForm = ({
    onSubmit,
    isSubmitting,
    onCancel,
}: {
    onSubmit: (data: { name: string; icon: string; color: string }) => void;
    isSubmitting: boolean;
    onCancel: () => void;
}) => {
    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("📦");
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].value);
    const [nameError, setNameError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setNameError("Category name is required");
            return;
        }
        if (name.trim().length < 2) {
            setNameError("Name must be at least 2 characters");
            return;
        }
        onSubmit({ name: name.trim(), icon: selectedIcon, color: selectedColor });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <Input
                label="Category Name"
                type="text"
                placeholder="e.g. Gym, Coffee, Pets..."
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
                error={nameError}
                autoFocus
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedIcon(emoji)}
                            className={cn(
                                "w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all",
                                selectedIcon === emoji
                                    ? "bg-indigo-100 dark:bg-indigo-950/50 ring-2 ring-indigo-500 scale-110"
                                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose Color
                </label>
                <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => setSelectedColor(color.value)}
                            className={cn(
                                "w-8 h-8 rounded-full transition-all",
                                color.tw,
                                selectedColor === color.value
                                    ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                                    : "hover:scale-105"
                            )}
                            title={color.label}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: selectedColor + "22" }}
                >
                    {selectedIcon}
                </div>
                <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {name || "Category Name"}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Custom category</div>
                </div>
            </div>

            <div className="flex gap-3 pt-1">
                <Button variant="outline" fullWidth onClick={onCancel} type="button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Category"}
                </Button>
            </div>
        </form>
    );
};

const CategoriesPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<CustomCategory | null>(null);
    const queryClient = useQueryClient();

    const { data: customCategories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await api.get("/categories");
                return (res.data.data as CustomCategory[]) || [];
            } catch {
                return [];
            }
        },
        staleTime: 1000 * 60,
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string; icon: string; color: string }) =>
            api.post("/categories", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setShowAddModal(false);
            toast.success("Category added!");
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Failed to add category";
            toast.error(msg);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setDeleteTarget(null);
            toast.success("Category deleted");
        },
        onError: () => toast.error("Failed to delete category"),
    });

    return (
        <div className="max-w-4xl mx-auto space-y-5">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Manage expense categories for your transactions
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 h-10 rounded-xl transition-colors shadow-sm shadow-indigo-200"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Custom Categories
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Created by you — shown alongside default categories
                        </p>
                    </div>
                    <Badge color="indigo">{customCategories.length}</Badge>
                </div>

                {isLoading ? (
                    <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : customCategories.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="text-3xl mb-2">🏷️</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No custom categories yet
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                            Create your first custom category →
                        </button>
                    </div>
                ) : (
                    <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {customCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                                    style={{ backgroundColor: (cat.color || "#6366f1") + "22" }}
                                >
                                    {cat.icon || "📦"}
                                </div>
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate flex-1">
                                    {cat.name}
                                </span>
                                <button
                                    onClick={() => setDeleteTarget(cat)}
                                    className="opacity-0 group-hover:opacity-100 absolute right-2 top-2 w-5 h-5 flex items-center justify-center rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Default Expense Categories
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Built-in categories · Cannot be deleted
                        </p>
                    </div>
                    <Lock size={13} className="text-gray-400" />
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <div
                            key={cat.value}
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-2.5"
                        >
                            <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-lg flex-shrink-0">
                                {cat.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Default Income Sources
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            Built-in income sources · Cannot be deleted
                        </p>
                    </div>
                    <Lock size={13} className="text-gray-400" />
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {INCOME_SOURCES.map((src) => (
                        <div
                            key={src.value}
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-2.5"
                        >
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-lg flex-shrink-0">
                                {src.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                {src.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Custom Category">
                <AddCategoryForm
                    onSubmit={(data) => createMutation.mutate(data)}
                    isSubmitting={createMutation.isPending}
                    onCancel={() => setShowAddModal(false)}
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                isDeleting={deleteMutation.isPending}
                title="Delete Category"
                description={`Delete "${deleteTarget?.name}"? Existing transactions with this category won't be affected.`}
            />
        </div>
    );
};

export default CategoriesPage;