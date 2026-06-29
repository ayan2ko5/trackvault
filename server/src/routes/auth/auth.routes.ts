import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../../controllers/auth/auth.controller";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  authenticate,
  getProfile
);

router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  updateProfile
);

export default router;