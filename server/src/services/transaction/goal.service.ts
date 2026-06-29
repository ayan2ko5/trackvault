import { Prisma } from "@prisma/client";

import prisma from "../../config/database";

import {
  CreateGoalInput,
  UpdateGoalInput,
} from "../../validators/goal.validators";

const calculateProgress = (
  current: number,
  target: number
): {
  progressPercentage: number;
  remainingAmount: number;
  isCompleted: boolean;
} => {
  const progressPercentage =
    target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  const remainingAmount = Math.max(target - current, 0);
  const isCompleted = current >= target;
  return { progressPercentage, remainingAmount, isCompleted };
};

export const getAll = async (userId: string) => {
  const goals = await prisma.goal.findMany({
    where: { userId },
   orderBy: [ {isCompleted: "asc",},{createdAt: "desc",},],
  });

  return goals.map((goal) => {
    const current = Number(goal.currentAmount);
    const target = Number(goal.targetAmount);
    const progress = calculateProgress(current, target);

    return {
      ...goal,
      currentAmount: current,
      targetAmount: target,
      ...progress,
    };
  });
};

export const getById = async (id: string, userId: string) => {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) return null;

  const current = Number(goal.currentAmount);
  const target = Number(goal.targetAmount);
const progress = calculateProgress(current, target);

return {
  ...goal,
  currentAmount: current,
  targetAmount: target,
  ...progress,
};
};

export const create = async (userId: string, data: CreateGoalInput) => {
  const goal = await prisma.goal.create({
    data: {
      userId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount ?? 0,
      deadline: data.deadline ?? null,
    },
  });

  const current = Number(goal.currentAmount);
  const target = Number(goal.targetAmount);
const progress = calculateProgress(current, target);

return {
  ...goal,
  currentAmount: current,
  targetAmount: target,
  ...progress,
};
};

export const update = async (
  id: string,
  userId: string,
  data: UpdateGoalInput
) => {
  const existing = await prisma.goal.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const newCurrent =
    data.currentAmount !== undefined
      ? data.currentAmount
      : Number(existing.currentAmount);
  const newTarget =
    data.targetAmount !== undefined
      ? data.targetAmount
      : Number(existing.targetAmount);
  const autoCompleted = newCurrent >= newTarget;

  const updated = await prisma.goal.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
      ...(data.currentAmount !== undefined && { currentAmount: data.currentAmount }),
      ...(data.deadline !== undefined && { deadline: data.deadline }),
      isCompleted: autoCompleted,
    },
  });

  const current = Number(updated.currentAmount);
  const target = Number(updated.targetAmount);
return {
  ...updated,
  currentAmount: current,
  targetAmount: target,
  ...calculateProgress(current, target),
};
};

export const remove = async (id: string, userId: string) => {
  const existing = await prisma.goal.findFirst({ where: { id, userId } });
  if (!existing) return null;

const deletedGoal = await prisma.goal.delete({
  where: {
    id,
  },
});

return deletedGoal;
};