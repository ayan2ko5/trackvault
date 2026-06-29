import { z } from "zod";

export const createGoalSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Goal name is required")
      .max(100, "Goal name is too long"),

    targetAmount: z.coerce
      .number()
      .positive("Target amount must be greater than 0")
      .max(99999999, "Amount is too large"),

    currentAmount: z.coerce
      .number()
      .min(0, "Current amount cannot be negative")
      .max(99999999)
      .default(0),

    deadline: z.coerce.date().optional().nullable(),
  })
  .refine(
    (data) => data.currentAmount <= data.targetAmount,
    {
      message: "Current amount cannot exceed target amount",
      path: ["currentAmount"],
    }
  );

export const updateGoalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Goal name is required")
    .max(100, "Goal name is too long")
    .optional(),

  targetAmount: z.coerce
    .number()
    .positive("Target amount must be greater than 0")
    .max(99999999)
    .optional(),

  currentAmount: z.coerce
    .number()
    .min(0, "Current amount cannot be negative")
    .max(99999999)
    .optional(),

  deadline: z.coerce.date().optional().nullable(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;