import { z } from "zod";

export const createSubscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subscription name is required")
    .max(100, "Subscription name is too long"),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(99999999, "Amount is too large"),

  dueDate: z.coerce.date(),

  cycle: z
    .enum(["WEEKLY", "MONTHLY", "YEARLY"])
    .default("MONTHLY"),

  isActive: z.boolean().default(true),
});

export const updateSubscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subscription name is required")
    .max(100, "Subscription name is too long")
    .optional(),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(99999999)
    .optional(),

  dueDate: z.coerce.date().optional(),

  cycle: z
    .enum(["WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),

  isActive: z.boolean().optional(),
});

export type CreateSubscriptionInput = z.infer<
  typeof createSubscriptionSchema
>;

export type UpdateSubscriptionInput = z.infer<
  typeof updateSubscriptionSchema
>;