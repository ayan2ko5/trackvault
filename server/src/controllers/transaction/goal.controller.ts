
import { Request, Response } from "express";
import * as goalService from "../../services/transaction/goal.service";
import { successResponse, errorResponse } from "../../utils/response.utils";

export const getAll = async (req: Request, res: Response) => {
  try {
    const goals = await goalService.getAll(req.userId);
    return successResponse(res, "Goals fetched successfully", { goals });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch goals", 500);
  }
};

export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const goal = await goalService.getById(req.params.id, req.userId);
    if (!goal) return errorResponse(res, "Goal not found", 404);
    return successResponse(res, "Goal fetched successfully", { goal });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch goal", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const goal = await goalService.create(req.userId, req.body);
    return successResponse(res, "Goal created successfully", { goal }, 201);
  } catch (error: unknown) {
    return errorResponse(res, "Failed to create goal", 500);
  }
};

export const update = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const goal = await goalService.update(
      req.params.id,
      req.userId,
      req.body
    );
    if (!goal) 
        return errorResponse(res, "Goal not found", 404);
    return successResponse(res, "Goal updated successfully", { goal });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to update goal", 500);
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const result = await goalService.remove(req.params.id, req.userId);
    if (!result) 
        return errorResponse(res, "Goal not found", 404);
    return successResponse(res, "Goal deleted successfully", {
      goal: result,
    });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to delete goal", 500);
  }
};
