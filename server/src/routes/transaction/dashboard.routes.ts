
import { Router } from "express";
import * as dashboardController from "../../controllers/transaction/dashboard.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.get("/summary", authenticate, dashboardController.getSummary);

export default router;