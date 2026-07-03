
export type HealthScoreLabel = "Poor" | "Average" | "Good" | "Excellent";

export interface HealthScoreResult {
    score: number;
    label: HealthScoreLabel;
    color: string;
    breakdown: {
        savingsRateScore: number;
        budgetScore: number;
        consistencyScore: number;
        savingsRate: number;
        budgetsAdherence: number;
        expenseVariance: number;
    };
}

interface ScoreInputBudget {
    alertStatus: "OK" | "WARNING" | "EXCEEDED";
}

export const calculateHealthScore = (
    totalIncome: number,
    totalExpenses: number,
    budgets: ScoreInputBudget[],
    lastMonthExpenses: number = 0
): HealthScoreResult => {

    let savingsRateScore = 0;
    let savingsRate = 0;

    if (totalIncome > 0) {
        const savings = Math.max(totalIncome - totalExpenses, 0);
        savingsRate = (savings / totalIncome) * 100;

        savingsRateScore = Math.min(Math.round((savingsRate / 30) * 35), 35);
        savingsRateScore = Math.max(savingsRateScore, 0);
    }

    let budgetScore = 35;
    let budgetsAdherence = 100;

    if (budgets.length > 0) {
        const exceededCount = budgets.filter(
            (b) => b.alertStatus === "EXCEEDED"
        ).length;
        const warningCount = budgets.filter(
            (b) => b.alertStatus === "WARNING"
        ).length;

        budgetsAdherence =
            ((budgets.length - exceededCount) / budgets.length) * 100;
        budgetScore = Math.round((budgetsAdherence / 100) * 35);

        budgetScore = Math.max(budgetScore - warningCount * 2, 0);
    }

    let consistencyScore = 20;
    let expenseVariance = 0;

    if (lastMonthExpenses > 0 && totalExpenses > 0) {
        expenseVariance = Math.abs(
            ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        );

        if (expenseVariance < 10) {
            consistencyScore = 30;
        } else if (expenseVariance < 25) {
            consistencyScore = 20;
        } else if (expenseVariance < 50) {
            consistencyScore = 10;
        } else {
            consistencyScore = 0;
        }
    } else if (totalExpenses > 0) {
        consistencyScore = 15;
    }

    const score = Math.min(
        savingsRateScore + budgetScore + consistencyScore,
        100
    );

    let label: HealthScoreLabel;
    let color: string;

    if (score >= 81) {
        label = "Excellent";
        color = "text-violet-600 dark:text-violet-400";
    } else if (score >= 61) {
        label = "Good";
        color = "text-indigo-600 dark:text-indigo-400";
    } else if (score >= 41) {
        label = "Average";
        color = "text-amber-600 dark:text-amber-400";
    } else {
        label = "Poor";
        color = "text-rose-600 dark:text-rose-400";
    }

    return {
        score,
        label,
        color,
        breakdown: {
            savingsRateScore,
            budgetScore,
            consistencyScore,
            savingsRate: Math.round(savingsRate),
            budgetsAdherence: Math.round(budgetsAdherence),
            expenseVariance: Math.round(expenseVariance),
        },
    };
};

export const getScoreGradient = (score: number): string => {
    if (score >= 81) return "from-violet-500 to-indigo-500";
    if (score >= 61) return "from-indigo-500 to-blue-500";
    if (score >= 41) return "from-amber-400 to-orange-500";
    return "from-rose-500 to-red-600";
};