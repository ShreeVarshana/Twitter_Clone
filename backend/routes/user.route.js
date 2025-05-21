import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { getProfile, followUnFollowUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile)
router.post("/follow/:id", protectRoute, followUnFollowUser)

export default router;