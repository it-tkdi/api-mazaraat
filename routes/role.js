import express from "express";
import { roleController } from "../controllers/role.js";
import {authenticateToken} from '../middlewares/jwt.js'

const router = express.Router();

router.get("/", authenticateToken, roleController.getRoles);
router.get("/:id", authenticateToken, roleController.getRoleById);
router.post("/", authenticateToken, roleController.addRole);
router.put("/", authenticateToken, roleController.updateRole);

export default router;
