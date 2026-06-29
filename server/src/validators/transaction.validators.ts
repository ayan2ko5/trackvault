import { z } from "zod";

/* ==========================================================
   CREATE TRANSACTION
========================================================== */

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),

  amount: z
    .coerce.number()
    .positive("Amount must be greater than 0")
    .max(99999999, "Amount is too large"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category name is too long"),

  date: z.coerce.date(),

  note: z
    .string()
    .trim()
    .max(500, "Note cannot exceed 500 characters")
    .optional(),

  paymentMethod: z
    .enum(["UPI", "CASH", "CARD", "NET_BANKING", "OTHER"])
    .optional(),

  source: z
    .enum([
      "SALARY",
      "FREELANCING",
      "BUSINESS",
      "INTEREST",
      "BONUS",
      "OTHER",
    ])
    .optional(),
});

/* ==========================================================
   UPDATE TRANSACTION
========================================================== */

export const updateTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),

  amount: z
    .coerce.number()
    .positive("Amount must be greater than 0")
    .max(99999999)
    .optional(),

  category: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .optional(),

  date: z.coerce.date().optional(),

  note: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable(),

  paymentMethod: z
    .enum(["UPI", "CASH", "CARD", "NET_BANKING", "OTHER"])
    .optional()
    .nullable(),

  source: z
    .enum([
      "SALARY",
      "FREELANCING",
      "BUSINESS",
      "INTEREST",
      "BONUS",
      "OTHER",
    ])
    .optional()
    .nullable(),
});

/* ==========================================================
   QUERY FILTERS
========================================================== */

export const transactionQuerySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),

  category: z.string().trim().optional(),

  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM")
    .optional(),

  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be YYYY")
    .optional(),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),

  search: z.string().trim().optional(),
});

/* ==========================================================
   TYPES
========================================================== */

export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>;

export type UpdateTransactionInput = z.infer<
  typeof updateTransactionSchema
>;

export type TransactionQuery = z.infer<
  typeof transactionQuerySchema
>;