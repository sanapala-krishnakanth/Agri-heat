import { Router } from "express";

import {
  createPrediction,
  getPredictions,
  getStats
} from "../controllers/predictionController.js";

import {
  optionalAuth,
  protect
} from "../middleware/auth.js";

const router = Router();

router.use(optionalAuth);
router.use(protect);

router.get("/stats", getStats);

router.get("/", getPredictions);

router.post("/", createPrediction);

export default router;