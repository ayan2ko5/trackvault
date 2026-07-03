import { Router } from "express";
import * as budgetController from "../../controllers/transaction/budget.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../../validators/budget.validators";

const router = Router();

router.get("/", authenticate, budgetController.getAll);
router.get("/:id", authenticate, budgetController.getById);
router.post("/", authenticate, validate(createBudgetSchema), budgetController.create);
router.put("/:id", authenticate, validate(updateBudgetSchema), budgetController.update);
router.delete("/:id", authenticate, budgetController.remove);

export default router;