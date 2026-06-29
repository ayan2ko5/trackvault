
import { Prisma } from "@prisma/client";

import prisma from "../../config/database";

import {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../../validators/subscription.validators";

const getMonthlyEquivalent = (amount: number, cycle: string): number => {
  switch (cycle) {
    case "WEEKLY":
      return Math.round(amount * 4.33);
    case "MONTHLY":
      return amount;
    case "YEARLY":
      return Math.round(amount / 12);
    default:
      return amount;
  }
};

const isDueSoon = (dueDate: Date): boolean => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return dueDate >= now && dueDate <= sevenDaysLater;
};

export const getAll = async (userId: string) => {
  const where: Prisma.SubscriptionWhereInput = {
    userId,
  };

  const subscriptions = await prisma.subscription.findMany({
    where,
    orderBy: [
      {
        dueDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const enriched = subscriptions.map((sub) => ({
    ...sub,
    amount: Number(sub.amount),
    monthlyEquivalent: getMonthlyEquivalent(Number(sub.amount), sub.cycle),
    isDueSoon: isDueSoon(sub.dueDate),
  }));

  const totalMonthlyActive = enriched
    .filter((s) => s.isActive)
    .reduce(
      (sum: number, s) => sum + s.monthlyEquivalent,
      0
    );

  return {
    subscriptions: enriched,
    totalMonthlyCost: totalMonthlyActive,
  };
};

export const getById = async (id: string, userId: string) => {
  return prisma.subscription.findFirst({ where: { id, userId } });
};


export const create = async (
  userId: string,
  data: CreateSubscriptionInput
) => {
  return prisma.subscription.create({
    data: {
      userId,
      name: data.name,
      amount: data.amount,
      dueDate: data.dueDate,
      cycle: data.cycle,
      isActive: data.isActive ?? true,
    },
  });
};

export const update = async (
  id: string,
  userId: string,
  data: UpdateSubscriptionInput
) => {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) return null;

  return prisma.subscription.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
      ...(data.cycle !== undefined && { cycle: data.cycle }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
};

export const remove = async (id: string, userId: string) => {
  const existing = await prisma.subscription.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const deletedSubscription =
  await prisma.subscription.delete({
    where: {
      id,
    },
  });

return deletedSubscription;
};