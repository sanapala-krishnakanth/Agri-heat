import { Router } from "express";

import {
  sendPredictionEmail
} from "../controllers/emailController.js";

import {
  optionalAuth,
  protect
} from "../middleware/auth.js";

const router = Router();

router.use(optionalAuth);
router.use(protect);

router.post(
  "/prediction-report",
  sendPredictionEmail
);

export default router;