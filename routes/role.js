import express from "express";
import { roleController } from "../controllers/role.js";
import {authenticateToken} from '../middlewares/jwt.js'

const router = express.Router();

router.get("/", roleController.getRoles);
router.get("/:id", roleController.getRoleById);
router.post("/", roleController.addRole);
router.put("/", roleController.updateRole);

export default router;
