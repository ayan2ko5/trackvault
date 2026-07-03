import { Router } from "express";
import * as goalController from "../../controllers/transaction/goal.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {createGoalSchema,updateGoalSchema,} from "../../validators/goal.validators";

const router = Router();

router.get("/", authenticate, goalController.getAll);
router.get("/:id", authenticate, goalController.getById);
router.post("/", authenticate, validate(createGoalSchema), goalController.create);
router.put("/:id", authenticate, validate(updateGoalSchema), goalController.update);
router.delete("/:id", authenticate, goalController.remove);

export default router;