import express from "express";
import { cheeseRecordFormController } from "../controllers/cheeseRecordForm.js";
import userRouter from "./user.js"
import locationRouter from "./location.js";
import roleRouter from "./role.js";
import authController from "./auth.js";
import processFormRouter from "./processForm.js";
import productionFormRouter from "./productionForm.js";

const router = express.Router();

router.post(
  "/submit-cheddarmoonriver",
  cheeseRecordFormController.submitCheddarMoonRiver
);

router.use("/user", userRouter)
router.use("/location", locationRouter);
router.use("/role", roleRouter);
router.use("/auth", authController);
router.use("/process-form", processFormRouter)
router.use("/production-form", productionFormRouter)

export default router;
