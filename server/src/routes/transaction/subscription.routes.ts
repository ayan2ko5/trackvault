
import { Router } from "express";
import * as subscriptionController from "../../controllers/transaction/subscription.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import {createSubscriptionSchema,updateSubscriptionSchema,} from "../../validators/subscription.validators";

const router = Router();

router.get("/", authenticate, subscriptionController.getAll);
router.get("/:id", authenticate, subscriptionController.getById);
router.post("/", authenticate, validate(createSubscriptionSchema), subscriptionController.create);
router.put("/:id", authenticate, validate(updateSubscriptionSchema), subscriptionController.update);
router.delete("/:id", authenticate, subscriptionController.remove);

export default router;