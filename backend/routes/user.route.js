import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUser, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

// router.get("/profile/:username", getUserProfile);
// router.get("/suggested", getSuggestedUsers);
// router.post("/follow/:id", followUnfollowUser);
// router.post("/update", updateUser);

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);
router.get("/search", protectRoute, searchUsers);

export default router;
