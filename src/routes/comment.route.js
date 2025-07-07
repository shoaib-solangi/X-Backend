import express from "express";
import { getComments, createComment, deleteComment } from "../controllers/comment.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/post/:postId", getComments);




router.post("/post/:postId" , protectedRoute, createComment);
router.delete("/:commentId", protectedRoute, deleteComment);

export default router;  
