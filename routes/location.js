import express from "express";
import { locationController } from "../controllers/location.js";
import {authenticateToken} from '../middlewares/jwt.js'

const router = express.Router();

router.get("/", authenticateToken, locationController.getLocations);
router.get("/:id", authenticateToken, locationController.getLocationById);
router.post("/", authenticateToken, locationController.addLocation);
router.put("/", authenticateToken, locationController.updateLocation);

export default router;
