import { z } from "zod";

/* ==========================================================
   CREATE BUDGET
========================================================== */

export const createBudgetSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category name is too long"),

  amount: z.coerce
    .number()
    .positive("Budget amount must be greater than 0")
    .max(99999999),

  // Format: YYYY-MM
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
});

/* ==========================================================
   UPDATE BUDGET
========================================================== */

export const updateBudgetSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional(),

  amount: z.coerce
    .number()
    .positive("Budget amount must be greater than 0")
    .max(99999999)
    .optional(),
});

/* ==========================================================
   TYPES
========================================================== */

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;