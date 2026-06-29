import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQuery,
} from "../../validators/transaction.validators";

export const getAll = async (userId: string, query: TransactionQuery) => {
  const { type, category, month, year, page, limit, search } = query;

  const where: Prisma.TransactionWhereInput = { userId };

  if (type) where.type = type;

  if (category) {
    where.category = { contains: category, mode: "insensitive" };
  }

  if (month) {
    const [yearStr, monthStr] = month.split("-");
    const startDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);
    const endDate = new Date(
      Number(yearStr),
      Number(monthStr),
      0,
      23,
      59,
      59,
      999
    );
    where.date = { gte: startDate, lte: endDate };
  }

  if (year && !month) {
    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);
    where.date = { gte: startDate, lte: endDate };
  }

  if (search) {
    where.note = { contains: search, mode: "insensitive" };
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    transactions: transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getById = async (id: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  return transaction ? { ...transaction, amount: Number(transaction.amount) } : null;
};

export const create = async (userId: string, data: CreateTransactionInput) => {
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: data.type,
      amount: data.amount,
      category: data.category,
      date: data.date,
      note: data.note,
      paymentMethod: data.paymentMethod,
      source: data.source,
    },
  });
  return { ...transaction, amount: Number(transaction.amount) };
};

export const update = async (
  id: string,
  userId: string,
  data: UpdateTransactionInput
) => {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.note !== undefined && { note: data.note }),
      ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
      ...(data.source !== undefined && { source: data.source }),
    },
  });

  return { ...updated, amount: Number(updated.amount) };
};

export const remove = async (id: string, userId: string) => {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const deletedTransaction = await prisma.transaction.delete({ where: { id } });
  return { ...deletedTransaction, amount: Number(deletedTransaction.amount) };
};

export const getSummary = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "INCOME", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = Number(incomeResult._sum.amount ?? 0);
  const totalExpenses = Number(expenseResult._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    incomeCount: incomeResult._count,
    expenseCount: expenseResult._count,
  };
};

export const getCategoryBreakdown = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const breakdown = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
  });

  return breakdown.map((item) => ({
    category: item.category,
    amount: Number(item._sum.amount ?? 0),
    count: item._count,
  }));
};

export const getMonthlyTrend = async (userId: string, months: number = 6) => {
  const results: { month: string; income: number; expense: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth() - i + 1,
      0,
      23,
      59,
      59,
      999
    );

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: "INCOME", date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE", date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
    ]);

    results.push({
      month: startDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      income: Number(income._sum.amount ?? 0),
      expense: Number(expense._sum.amount ?? 0),
    });
  }

  return results;
};
