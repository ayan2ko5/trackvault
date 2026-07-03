
export interface CategoryOption {
    value: string;
    label: string;
    icon: string;
    color: string;
}

export const EXPENSE_CATEGORIES: CategoryOption[] = [
    { value: "Food", label: "Food", icon: "🍔", color: "rose" },
    { value: "Grocery", label: "Grocery", icon: "🛒", color: "rose" },
    { value: "Rent", label: "Rent", icon: "🏠", color: "violet" },
    { value: "Bills", label: "Bills", icon: "⚡", color: "amber" },
    { value: "Travel", label: "Travel", icon: "🚗", color: "indigo" },
    { value: "Fuel", label: "Fuel", icon: "⛽", color: "indigo" },
    { value: "Education", label: "Education", icon: "📚", color: "blue" },
    { value: "Health", label: "Health", icon: "❤️", color: "rose" },
    { value: "Shopping", label: "Shopping", icon: "🛍️", color: "amber" },
    { value: "Entertainment", label: "Entertainment", icon: "🎬", color: "amber" },
    { value: "Investment", label: "Investment", icon: "📈", color: "emerald" },
    { value: "Others", label: "Others", icon: "📦", color: "gray" },
];

export const INCOME_SOURCES: CategoryOption[] = [
    { value: "SALARY", label: "Salary", icon: "💼", color: "emerald" },
    { value: "FREELANCING", label: "Freelancing", icon: "💻", color: "indigo" },
    { value: "BUSINESS", label: "Business", icon: "🏢", color: "indigo" },
    { value: "INTEREST", label: "Interest", icon: "🏦", color: "amber" },
    { value: "BONUS", label: "Bonus", icon: "⭐", color: "amber" },
    { value: "OTHER", label: "Other", icon: "📦", color: "gray" },
];

export const ALL_CATEGORIES: CategoryOption[] = [
    ...EXPENSE_CATEGORIES,
    ...INCOME_SOURCES,
];

export const PAYMENT_METHODS = [
    { value: "UPI", label: "UPI" },
    { value: "CASH", label: "Cash" },
    { value: "CARD", label: "Card" },
    { value: "NET_BANKING", label: "Net Banking" },
    { value: "OTHER", label: "Other" },
];

export const SUBSCRIPTION_CYCLES = [
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
];

export const generateMonthOptions = () => {
    const months = [];
    const date = new Date();

    for (let i = 0; i < 12; i++) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push({
            label: d.toLocaleString("default", { month: "long", year: "numeric" }),
            value: d.toISOString(),
        });
    }

    return months;
};

export const getCategoryColor = (category: string): string => {
    const found = ALL_CATEGORIES.find(
        (c) => c.value.toLowerCase() === category.toLowerCase()
    );
    return found?.color || "gray";
};

export const getCategoryIcon = (category: string): string => {
    const found = ALL_CATEGORIES.find(
        (c) => c.value.toLowerCase() === category.toLowerCase()
    );
    return found?.icon || "📦";
};