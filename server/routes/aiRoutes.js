import { Router } from "express";
import { getAdvice } from "../controllers/aiController.js";
import { optionalAuth, protect } from "../middleware/auth.js";

const router = Router();

router.use(optionalAuth);
router.use(protect);

router.post("/advice", getAdvice);

export default router;