import { Request, Response } from "express";
import * as subscriptionService from "../../services/transaction/subscription.service";
import { successResponse, errorResponse } from "../../utils/response.utils";

export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await subscriptionService.getAll(req.userId);
    return successResponse(res, "Subscriptions fetched successfully", result);
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch subscriptions", 500);
  }
};

export const getById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const subscription = await subscriptionService.getById(
      req.params.id,
      req.userId
    );
    if (!subscription) return errorResponse(res, "Subscription not found", 404);
    return successResponse(res, "Subscription fetched", { subscription });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch subscription", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const subscription = await subscriptionService.create(req.userId, req.body);
    return successResponse(res, "Subscription created successfully", { subscription }, 201);
  } catch (error: unknown) {
    return errorResponse(res, "Failed to create subscription", 500);
  }
};

export const update = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const subscription = await subscriptionService.update(
      req.params.id,
      req.userId,
      req.body
    );
    if (!subscription) return errorResponse(res, "Subscription not found", 404);
    return successResponse(res, "Subscription updated successfully", { subscription });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to update subscription", 500);
  }
};

export const remove = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const result = await subscriptionService.remove(req.params.id, req.userId);
    if (!result) return errorResponse(res, "Subscription not found", 404);
    return successResponse(res, "Subscription deleted successfully", {
      subscription: result,
    });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to delete subscription", 500);
  }
};
