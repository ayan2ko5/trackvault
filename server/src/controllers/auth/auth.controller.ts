import { Request, Response } from "express";
import * as authService from "../../services/auth/auth.service";
import {
  successResponse,
  errorResponse,
} from "../../utils/response.utils";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);

    return successResponse(
      res,
      "Account created successfully.",
      result,
      201
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    if (message.includes("already exists")) {
      return errorResponse(res, message, 409);
    }

    return errorResponse(res, message, 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    if (message.includes("Invalid email or password")) {
      return errorResponse(res, message, 401);
    }

    return errorResponse(res, message, 500);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await authService.getProfile(req.userId);

    return successResponse(
      res,
      "Profile fetched successfully.",
      user
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch profile";

    if (message === "User not found") {
      return errorResponse(res, message, 404);
    }

    return errorResponse(res, message, 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await authService.updateProfile(
      req.userId,
      req.body
    );

    return successResponse(
      res,
      "Profile updated successfully.",
      user
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";

    return errorResponse(res, message, 500);
  }
};