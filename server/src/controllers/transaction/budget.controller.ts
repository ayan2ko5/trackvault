
import { Request, Response } from "express";
import * as budgetService from "../../services/transaction/budget.service";
import { successResponse, errorResponse } from "../../utils/response.utils";

export const getAll = async (req: Request, res: Response) => {
  try {
    const month = req.query.month as string | undefined;
    const result = await budgetService.getAll(req.userId, month);
    return successResponse(res, "Budgets fetched successfully", result);
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch budgets", 500);
  }
};

export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const budget = await budgetService.getById(req.params.id, req.userId);
    if (!budget) return errorResponse(res, "Budget not found", 404);
    return successResponse(res, "Budget fetched successfully", { budget });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch budget", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const budget = await budgetService.create(req.userId, req.body);
    return successResponse(res, "Budget created successfully", { budget }, 201);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("already exists")
    ) {
      return errorResponse(res, error.message, 409);
    }
    return errorResponse(res, "Failed to create budget", 500);
  }
};

export const update = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const budget = await budgetService.update(
        req.params.id, 
        req.userId, 
        req.body);
    if (!budget) return errorResponse(res, "Budget not found", 404);
    return successResponse(res, "Budget updated successfully", { budget });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to update budget", 500);
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const result = await budgetService.remove(req.params.id, req.userId);
    if (!result) return errorResponse(res, "Budget not found", 404);
    return successResponse(res, "Budget deleted successfully", {
      budget: result,
    });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to delete budget", 500);
  }
};
