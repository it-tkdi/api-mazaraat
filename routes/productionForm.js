import express from "express";
import { productionFormController } from "../controllers/productionForm.js";
import { authenticateToken } from "../middlewares/jwt.js";

const router = express.Router();

router.post("/", productionFormController.submitForm);
router.get("/", productionFormController.getProductions);
router.get("/:id", productionFormController.getProductionById);
router.put("/:id", productionFormController.reviseProduction);

export default router;
