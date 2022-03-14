import express from "express";
import { cheeseRecordFormController } from "../controllers/cheeseRecordForm.js";
import locationRouter from "./location.js";
import roleRouter from "./role.js";
import authController from "./auth.js";

const router = express.Router();

router.post(
  "/submit-cheddarmoonriver",
  cheeseRecordFormController.submitCheddarMoonRiver
);

router.use("/location", locationRouter);
router.use("/role", roleRouter);
router.use("/auth", authController);

export default router;
