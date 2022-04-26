import express from "express";
import { userController } from "../controllers/user.js";
import {authenticateToken} from '../middlewares/jwt.js'

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.addUser);
router.put("/", userController.updateUser);

export default router;
