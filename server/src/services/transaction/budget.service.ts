import { Prisma } from "@prisma/client";

import prisma from "../../config/database";

import {CreateBudgetInput,UpdateBudgetInput,} from "../../validators/budget.validators";

const getMonthRange = (monthStr: string) => {
  const [year, month] = monthStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

type AlertStatus = "OK" | "WARNING" | "EXCEEDED";

const getAlertStatus = (
  percentageUsed: number
): AlertStatus => {
  if (percentageUsed >= 100) return "EXCEEDED";  
  if (percentageUsed >= 80) return "WARNING";    
  return "OK";                                   
};

export const getAll = async (userId: string, month?: string) => {
  const where: Prisma.BudgetWhereInput = {
  userId,
};

  if (month) {
    const { startDate, endDate } = getMonthRange(month);
    where.month = { gte: startDate, lte: endDate };
  }

  const budgets = await prisma.budget.findMany({
    where,
   orderBy: [
  {
    month: "desc",
  },
  {
    createdAt: "desc",
  },
],
  });

  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
     const budgetMonth = budget.month;
      const startDate = new Date(
        budgetMonth.getFullYear(),
        budgetMonth.getMonth(),
        1
      );
      const endDate = new Date(
        budgetMonth.getFullYear(),
        budgetMonth.getMonth() + 1,
        0,
        23, 59, 59, 999
      );

      const spendingResult = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "EXPENSE",
          category: { equals: budget.category, mode: "insensitive" },
          date: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      });

      const currentSpending = Number(spendingResult._sum.amount ?? 0);
      const budgetAmount = Number(budget.amount);
      const remainingAmount = budgetAmount - currentSpending;
      const percentageUsed =
        budgetAmount > 0
          ? Math.round((currentSpending / budgetAmount) * 100)
          : 0;
      const alertStatus = getAlertStatus(percentageUsed);

      return {
        ...budget,
        amount: budgetAmount,
        currentSpending,
        remainingAmount,
        percentageUsed,
        alertStatus,
      };
    })
  );

  return budgetsWithSpending;
};


export const getById = async (id: string, userId: string) => {
  return prisma.budget.findFirst({ where: { id, userId } });
};


export const create = async (userId: string, data: CreateBudgetInput) => {
  const [year, month] = data.month.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);

  const existing = await prisma.budget.findFirst({
    where: {
      userId,
      category: { equals: data.category, mode: "insensitive" },
      month: monthDate,
    },
  });

  if (existing) {
    throw new Error(
      `A budget for ${data.category} already exists for this month`
    );
  }

  return prisma.budget.create({
    data: {
      userId,
      category: data.category,
      amount: data.amount,
      month: monthDate,
    },
  });
};

export const update = async (
  id: string,
  userId: string,
  data: UpdateBudgetInput
) => {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.budget.update({
    where: { id },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.category !== undefined && { category: data.category }),
    },
  });
};

export const remove = async (id: string, userId: string) => {
  const existing = await prisma.budget.findFirst({ where: { id, userId } });
  if (!existing) return null;

const deletedBudget = await prisma.budget.delete({
  where: {
    id,
  },
});

return deletedBudget;
};