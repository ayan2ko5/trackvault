import { Request, Response } from "express";
import * as transactionService from "../../services/transaction/transaction.service";
import { transactionQuerySchema } from "../../validators/transaction.validators";
import { successResponse, errorResponse } from "../../utils/response.utils";

export const getAll = async (req: Request, res: Response) => {
  try {

    const query = transactionQuerySchema.parse(req.query);
    const result = await transactionService.getAll(req.userId, query);
    return successResponse(res, "Transactions fetched successfully", result);
  } catch (error: unknown) {
    return errorResponse(res, "Failed to fetch transactions", 500);
  }
};

export const getById = async (req: Request<{ id: string }>,res: Response) => {
  try {
    const transaction = await transactionService.getById(
      req.params.id,
      req.userId
    );

    if (!transaction) {
      return errorResponse(res, "Transaction not found", 404);
    }

    return successResponse(res, "Transaction fetched successfully", {
      transaction,
    });
 } catch (error: unknown) {return errorResponse( res, "Failed to fetch transaction", 500 );}
};

export const create = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.create(req.userId, req.body);
    return successResponse(
      res,
      "Transaction created successfully",
      { transaction },
      201
    );
  } catch (error: unknown) {
    return errorResponse(res, "Failed to create transaction", 500);
  }
};

export const update = async (req: Request<{ id: string }>,res: Response) => {
  try {
    const transaction = await transactionService.update(
      req.params.id,
      req.userId,
      req.body
    );

    if (!transaction) {
      return errorResponse(res, "Transaction not found", 404);
    }

    return successResponse(res, "Transaction updated successfully", {
      transaction,
    });
  } catch (error: unknown) {
    return errorResponse(res, "Failed to update transaction", 500);
  }
};

export const remove = async (req: Request<{ id: string }>,res: Response) => {
  try {
    const result = await transactionService.remove(req.params.id, req.userId);

    if (!result) {
      return errorResponse(res, "Transaction not found", 404);
    }

   return successResponse(res,"Transaction deleted successfully",{transaction: result,});
  } catch (error: unknown) {
    return errorResponse(res, "Failed to delete transaction", 500);
  }
};