import express from "express"
const router = express.Router();
import { getPosts, getPost, createPost, getUserPosts } from "../controllers/post.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { likePost } from "../controllers/like.controller.js";
import { deletePost } from "../controllers/post.controller.js";

import upload from "../middleware/upload.middleware.js";
router.get("/" , getPosts);
router.get("/:id" , getPost);
router.get("/user/:username" , getUserPosts);



router.post("/" , protectedRoute ,upload.single("image"), createPost);
router.post("/:postId/like" , protectedRoute , likePost)
router.delete("/:postId" , protectedRoute , deletePost);







export default Router;