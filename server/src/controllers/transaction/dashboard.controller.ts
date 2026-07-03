import { Request, Response } from "express";
import * as dashboardService from "../../services/transaction/dashboard.service";
import { successResponse, errorResponse } from "../../utils/response.utils";

export const getSummary = async (req: Request, res: Response) => {
  try {
    const month = req.query.month as string | undefined;
    const data = await dashboardService.getSummaryData(req.userId, month);

    return successResponse(
      res,
      "Dashboard summary fetched successfully",
      data
    );
  } catch (error: unknown) {
    console.error("Dashboard error:", error);

    return errorResponse(
      res,
      "Failed to fetch dashboard data",
      500
    );
  }
};