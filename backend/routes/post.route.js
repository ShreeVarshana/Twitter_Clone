import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
	searchPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

// router.get("/all", getAllPosts);
// router.get("/following", getFollowingPosts);
// router.get("/likes/:id", getLikedPosts);
// router.get("/user/:username", getUserPosts);
// router.post("/create", createPost);
// router.post("/like/:id", likeUnlikePost);
// router.post("/comment/:id", commentOnPost);
// router.delete("/:id", deletePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);
router.get("/search", protectRoute, searchPosts);

export default router;
