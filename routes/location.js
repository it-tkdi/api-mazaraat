import express from "express";
import { locationController } from "../controllers/location.js";
import {authenticateToken} from '../middlewares/jwt.js'

const router = express.Router();

router.get("/", locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.post("/", locationController.addLocation);
router.put("/", locationController.updateLocation);

export default router;
