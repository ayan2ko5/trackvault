import { Router } from "express";
import * as transactionController from "../../controllers/transaction/transaction.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../../validators/transaction.validators";

const router = Router();

router.get("/", authenticate, transactionController.getAll);

router.get("/:id", authenticate, transactionController.getById);

router.post(
  "/",
  authenticate,
  validate(createTransactionSchema),
  transactionController.create
);

router.put(
  "/:id",
  authenticate,
  validate(updateTransactionSchema),
  transactionController.update
);

router.delete("/:id", authenticate, transactionController.remove);

export default router;