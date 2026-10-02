import { Router } from "express";
import { LoanController } from "../controllers/loanController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(LoanController.create));
router.get("/", asyncHandler(LoanController.getAll));
router.get("/:id", asyncHandler(LoanController.getById));
router.put("/:id", asyncHandler(LoanController.update));
router.delete("/:id", asyncHandler(LoanController.remove));

export default router;
