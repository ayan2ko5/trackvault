import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { errorResponse } from "../utils/response.utils";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "Access denied. No token provided. Please log in.",
        401
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(
        res,
        "Access denied. Invalid token format.",
        401
      );
    }

    const decoded = verifyAccessToken(token);

    req.userId = decoded.userId;

    next();
  } catch {
    return errorResponse(
      res,
      "Access denied. Token is invalid or expired. Please log in again.",
      401
    );
  }
};