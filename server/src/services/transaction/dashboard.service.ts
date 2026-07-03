import { Prisma } from "@prisma/client";

import prisma from "../../config/database";

import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrend,
} from "./transaction.service";

const calculateHealthScore = (
  totalIncome: number,
  totalExpenses: number,
  budgets: {
    alertStatus: string;
  }[]
): { score: number; label: string; breakdown: object } => {

  let savingsRateScore = 0;
  if (totalIncome > 0) {
    const savingsRate =
      ((totalIncome - totalExpenses) / totalIncome) * 100;
    savingsRateScore = Math.min(Math.round((savingsRate / 30) * 35), 35);
    savingsRateScore = Math.max(savingsRateScore, 0); // no negative scores
  }


  let budgetScore = 35;
  if (budgets.length > 0) {
    const exceededCount = budgets.filter(
      (b) => b.alertStatus === "EXCEEDED"
    ).length;
    const adherenceRate =
      ((budgets.length - exceededCount) / budgets.length) * 100;
    budgetScore = Math.round((adherenceRate / 100) * 35);
  }

  const consistencyScore = totalExpenses > 0 ? 24 : 0;

  const totalScore = savingsRateScore + budgetScore + consistencyScore;

  let label = "Poor";
  if (totalScore > 80) label = "Excellent";
  else if (totalScore > 60) label = "Good";
  else if (totalScore > 40) label = "Average";

  return {
    score: totalScore,
    label,
    breakdown: {
      savingsRateScore,
      budgetScore,
      consistencyScore,
    },
  };
};

export const getSummaryData = async (userId: string, monthStr?: string) => {

  const now = new Date();
  let baseDate = now;
  if (monthStr) {
    const [year, month] = monthStr.split("-").map(Number);
    baseDate = new Date(year, month - 1, 1);
  }

  const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const endOfMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0,
    23, 59, 59, 999
  );

  const [
    monthlySummary,
    categoryBreakdown,
    monthlyTrend,
    recentTransactions,
    budgets,
    goals,
    subscriptions,
  ] = await Promise.all([
    getSummary(userId, startOfMonth, endOfMonth),
    getCategoryBreakdown(userId, startOfMonth, endOfMonth),
    getMonthlyTrend(userId, 6, baseDate),


    prisma.transaction.findMany({
      where: { userId },
      orderBy: [
        {
          date: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 5,
    }),


    prisma.budget.findMany({
      where: {
        userId,
        month: { gte: startOfMonth, lte: endOfMonth },
      },
    }),


    prisma.goal.findMany({
      where: { userId, isCompleted: false },
      orderBy: { createdAt: "desc" },
      take: 3, // top 3 goals for dashboard widget
    }),


    prisma.subscription.findMany({
      where: { userId, isActive: true },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const savings: number = Math.max(
    monthlySummary.totalIncome - monthlySummary.totalExpenses,
    0
  );


  const budgetsWithStatus = await Promise.all(
    budgets.map(async (budget) => {
      const spendingResult = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          category: { equals: budget.category, mode: "insensitive" },
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      });

      const currentSpending = Number(spendingResult._sum.amount ?? 0);
      const budgetAmount = Number(budget.amount);
      const percentageUsed =
        budgetAmount > 0
          ? Math.round((currentSpending / budgetAmount) * 100)
          : 0;

      return {
        ...budget,
        currentSpending,
        percentageUsed,
        alertStatus:
          percentageUsed >= 100
            ? "EXCEEDED"
            : percentageUsed >= 80
              ? "WARNING"
              : "OK",
      };
    })
  );


  const healthScore: ReturnType<typeof calculateHealthScore> = calculateHealthScore(
    monthlySummary.totalIncome,
    monthlySummary.totalExpenses,
    budgetsWithStatus
  );

  const totalSubscriptionCost = subscriptions.reduce(
    (sum: number, sub) => {
      const amount = Number(sub.amount);
      if (sub.cycle === "WEEKLY") return sum + amount * 4.33;
      if (sub.cycle === "YEARLY") return sum + amount / 12;
      return sum + amount;
    }, 0);


  const formattedTransactions = recentTransactions.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }));


  const formattedGoals = goals.map((g) => {
    const current = Number(g.currentAmount);
    const target = Number(g.targetAmount);
    return {
      ...g,
      currentAmount: current,
      targetAmount: target,
      progressPercentage:
        target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0,
      remainingAmount: Math.max(target - current, 0),
    };
  });


  return {

    totalIncome: monthlySummary.totalIncome,
    totalExpenses: monthlySummary.totalExpenses,
    balance: monthlySummary.balance,
    savings,


    healthScore: healthScore.score,
    healthScoreLabel: healthScore.label,
    healthScoreBreakdown: healthScore.breakdown,


    categoryBreakdown,
    monthlyTrend,

    recentTransactions: formattedTransactions,
    budgetAlerts: budgetsWithStatus.filter((b) => b.alertStatus !== "OK"),
    goals: formattedGoals,
    totalSubscriptionCost: Math.round(totalSubscriptionCost),

    period: {
      month: baseDate.toLocaleDateString("en-IN", {
        month: "long",
      }),
      year: baseDate.getFullYear(),
    },
  };
};