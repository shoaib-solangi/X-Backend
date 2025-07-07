import asyncHandler from "express-async-handler";
import Post from "../model/post.model.js";
import { getAuth } from "@clerk/express";
import User from "../model/user.model.js";
import Comment from "../model/comment.model.js";
import Notification from "../model/notification.model.js";



export const getComments = asyncHandler(async (req, res) => {
    const {postId} = req.params;
    const comments = await Comment.find({post : postId})
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture")
    res.status(200).json({comments});
})



export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
        content,
        user: user._id,
        post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
    });

    if(post.user.toString() !== userId) {
        await Notification.create({
            from : userId,
            to : post.user,
            type : "comment",
            post: postId,
            comment: comment._id,
        });
    }
   

    res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);

    const comment = await Comment.findById(commentId)
    const user = await User.findOne({clerkId : userId})
    if(!user || !comment) {
        return res.status(404).json({ message: "Comment or User not found" });
    }
    if(comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
    }
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id },
    });
    await comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
})