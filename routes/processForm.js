import express from "express";
import { processFormController } from "../controllers/processForm.js";
import { authenticateToken } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/", processFormController.addForm);
router.get("/", processFormController.getForms);
router.get("/:id", processFormController.getFormById);

export default router;
