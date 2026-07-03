
export type InsightSeverity = "danger" | "warning" | "good" | "info";

export interface Insight {
    id: string;
    severity: InsightSeverity;
    title: string;
    description: string;
    icon: string;
    category?: string;
    changePercent?: number;
}

export interface MonthData {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
    categoryBreakdown: Array<{
        category: string;
        amount: number;
        count: number;
    }>;
    budgets: Array<{
        category: string;
        amount: number;
        currentSpending: number;
        percentageUsed: number;
        alertStatus: "OK" | "WARNING" | "EXCEEDED";
    }>;
}

const percentChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

const fmt = (n: number): string =>
    `₹${Math.round(n).toLocaleString("en-IN")}`;

export const generateInsights = (
    thisMonth: MonthData,
    lastMonth: MonthData
): Insight[] => {
    const insights: Insight[] = [];

    const savingsRate =
        thisMonth.totalIncome > 0
            ? (thisMonth.savings / thisMonth.totalIncome) * 100
            : 0;
    const lastSavingsRate =
        lastMonth.totalIncome > 0
            ? (lastMonth.savings / lastMonth.totalIncome) * 100
            : 0;
    const savingsChange = percentChange(savingsRate, lastSavingsRate);

    if (savingsRate >= 30) {
        insights.push({
            id: "savings-excellent",
            severity: "good",
            title: "Excellent savings rate!",
            description: `You're saving ${Math.round(savingsRate)}% of your income (${fmt(thisMonth.savings)}). That's above the recommended 30%.`,
            icon: "🏆",
            changePercent: savingsChange,
        });
    } else if (savingsRate >= 20) {
        insights.push({
            id: "savings-good",
            severity: "good",
            title: `Savings rate: ${Math.round(savingsRate)}%`,
            description: `You saved ${fmt(thisMonth.savings)} this month. Try to reach 30% for long-term financial health.`,
            icon: "💰",
            changePercent: savingsChange,
        });
    } else if (savingsRate > 0) {
        insights.push({
            id: "savings-low",
            severity: "warning",
            title: `Low savings rate: ${Math.round(savingsRate)}%`,
            description: `You only saved ${fmt(thisMonth.savings)} this month. The recommended rate is at least 20% of income.`,
            icon: "⚠️",
            changePercent: savingsChange,
        });
    } else if (thisMonth.totalExpenses > thisMonth.totalIncome) {
        insights.push({
            id: "savings-negative",
            severity: "danger",
            title: "Spending exceeds income!",
            description: `You spent ${fmt(thisMonth.totalExpenses - thisMonth.totalIncome)} more than you earned this month. Review your expenses immediately.`,
            icon: "🚨",
        });
    }

    const incomeChange = percentChange(
        thisMonth.totalIncome,
        lastMonth.totalIncome
    );
    if (Math.abs(incomeChange) >= 10 && lastMonth.totalIncome > 0) {
        if (incomeChange > 0) {
            insights.push({
                id: "income-up",
                severity: "good",
                title: `Income increased by ${incomeChange}%`,
                description: `Your income rose from ${fmt(lastMonth.totalIncome)} to ${fmt(thisMonth.totalIncome)} — great progress!`,
                icon: "📈",
                changePercent: incomeChange,
            });
        } else {
            insights.push({
                id: "income-down",
                severity: "warning",
                title: `Income decreased by ${Math.abs(incomeChange)}%`,
                description: `Your income fell from ${fmt(lastMonth.totalIncome)} to ${fmt(thisMonth.totalIncome)}. Consider your savings cushion.`,
                icon: "📉",
                changePercent: incomeChange,
            });
        }
    }

    const expenseChange = percentChange(
        thisMonth.totalExpenses,
        lastMonth.totalExpenses
    );
    if (Math.abs(expenseChange) >= 10 && lastMonth.totalExpenses > 0) {
        if (expenseChange > 0) {
            insights.push({
                id: "expense-up",
                severity: expenseChange > 25 ? "danger" : "warning",
                title: `Total spending up ${expenseChange}%`,
                description: `You spent ${fmt(thisMonth.totalExpenses)} vs ${fmt(lastMonth.totalExpenses)} last month — an increase of ${fmt(thisMonth.totalExpenses - lastMonth.totalExpenses)}.`,
                icon: "📊",
                changePercent: expenseChange,
            });
        } else {
            insights.push({
                id: "expense-down",
                severity: "good",
                title: `Spending decreased by ${Math.abs(expenseChange)}%`,
                description: `Great job cutting back! You spent ${fmt(Math.abs(thisMonth.totalExpenses - lastMonth.totalExpenses))} less than last month.`,
                icon: "✂️",
                changePercent: expenseChange,
            });
        }
    }

    const lastMonthByCategory = new Map(
        lastMonth.categoryBreakdown.map((c) => [c.category, c.amount])
    );

    for (const cat of thisMonth.categoryBreakdown) {
        const lastAmount = lastMonthByCategory.get(cat.category) || 0;
        const change = percentChange(cat.amount, lastAmount);

        if (cat.amount > 500 && Math.abs(change) >= 20 && lastAmount > 0) {
            if (change > 0) {
                insights.push({
                    id: `cat-up-${cat.category}`,
                    severity: change > 50 ? "danger" : "warning",
                    title: `${cat.category} spending up ${change}%`,
                    description: `${cat.category} expenses rose from ${fmt(lastAmount)} to ${fmt(cat.amount)} this month.`,
                    icon: getCategoryIcon(cat.category),
                    category: cat.category,
                    changePercent: change,
                });
            } else {
                insights.push({
                    id: `cat-down-${cat.category}`,
                    severity: "good",
                    title: `${cat.category} spending down ${Math.abs(change)}%`,
                    description: `You reduced ${cat.category} spending from ${fmt(lastAmount)} to ${fmt(cat.amount)} — saving ${fmt(lastAmount - cat.amount)}.`,
                    icon: getCategoryIcon(cat.category),
                    category: cat.category,
                    changePercent: change,
                });
            }
        }

        if (lastAmount === 0 && cat.amount > 2000) {
            insights.push({
                id: `cat-new-${cat.category}`,
                severity: "info",
                title: `New ${cat.category} expense: ${fmt(cat.amount)}`,
                description: `You had no ${cat.category} expenses last month. This month you spent ${fmt(cat.amount)}.`,
                icon: getCategoryIcon(cat.category),
                category: cat.category,
            });
        }
    }

    for (const budget of thisMonth.budgets) {
        if (budget.alertStatus === "EXCEEDED") {
            insights.push({
                id: `budget-exceeded-${budget.category}`,
                severity: "danger",
                title: `${budget.category} budget exceeded`,
                description: `You spent ${fmt(budget.currentSpending)} against a ${fmt(budget.amount)} budget — ${budget.percentageUsed}% used.`,
                icon: "🚨",
                category: budget.category,
            });
        } else if (budget.alertStatus === "WARNING") {
            insights.push({
                id: `budget-warning-${budget.category}`,
                severity: "warning",
                title: `${budget.category} budget at ${budget.percentageUsed}%`,
                description: `You've used ${fmt(budget.currentSpending)} of your ${fmt(budget.amount)} ${budget.category} budget. Slow down to stay within limits.`,
                icon: "⚠️",
                category: budget.category,
            });
        }
    }

    if (thisMonth.categoryBreakdown.length > 0) {
        const top = thisMonth.categoryBreakdown[0];
        const topPercent =
            thisMonth.totalExpenses > 0
                ? Math.round((top.amount / thisMonth.totalExpenses) * 100)
                : 0;
        if (topPercent > 40) {
            insights.push({
                id: "top-category",
                severity: "info",
                title: `${top.category} is ${topPercent}% of spending`,
                description: `${top.category} (${fmt(top.amount)}) makes up ${topPercent}% of your total expenses. Consider if this aligns with your priorities.`,
                icon: getCategoryIcon(top.category),
                category: top.category,
            });
        }
    }

    if (thisMonth.totalIncome === 0) {
        insights.push({
            id: "no-income",
            severity: "info",
            title: "No income recorded this month",
            description: "Add your salary, freelancing, or other income to get accurate financial insights.",
            icon: "💼",
        });
    }

    const allOnTrack =
        thisMonth.budgets.length > 0 &&
        thisMonth.budgets.every((b) => b.alertStatus === "OK");
    if (allOnTrack) {
        insights.push({
            id: "budgets-all-ok",
            severity: "good",
            title: "All budgets are on track! 🎉",
            description: `All ${thisMonth.budgets.length} budgets are within limits this month. Great financial discipline!`,
            icon: "✅",
        });
    }

    const order: Record<InsightSeverity, number> = {
        danger: 0,
        warning: 1,
        good: 2,
        info: 3,
    };

    return insights.sort((a, b) => order[a.severity] - order[b.severity]);
};

const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
        Food: "🍔",
        Grocery: "🛒",
        Rent: "🏠",
        Bills: "⚡",
        Travel: "🚗",
        Fuel: "⛽",
        Education: "📚",
        Health: "❤️",
        Shopping: "🛍️",
        Entertainment: "🎬",
        Investment: "📈",
        Salary: "💼",
        Freelancing: "💻",
        Business: "🏢",
    };
    return icons[category] || "📦";
};