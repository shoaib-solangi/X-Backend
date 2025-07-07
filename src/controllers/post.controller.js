import asyncHandler from "express-async-handler";
import Post from "../model/post.model.js";
import { getAuth } from "@clerk/express";
import User from "../model/user.model.js";
import Comment from "../model/comment.model.js";   
import Notification from "../model/notification.model.js";
import cloudinary from "../config/cloudinary.js";




export const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user" , "username firstName lastName profilePicture")
    .populate({
        path : "comments",
        populate: {
            path : "user",
            Select : "username firstName lastName profilePicture"
        },
    })
    res.status(200).json({posts});



})


export const  getPost = asyncHandler( async (req , res) => {
    const {postId} = req.params;
    const post  = await Post.findById(postId)
    .populate("user" , "userName firstName lastName profilePicture")
    .populate({
        path : "comments" , 
        populate : {
            path : "user" , 
            select : "userName  firstName  lastName  profilePicture",        }
    })
    if(!post) return res.status(404).json({error : "Post Not Found "})
    res.status(200).json({post})    
})



export const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: { 
                path: "user",
                select: "username firstName lastName profilePicture"    
            },
        });
});



export const createPost = asyncHandler ( async (req , res) => {
    const {userId} = getAuth(req); 
    const {content} = req.body;
    const imageFile = req.file;



    if(!content && !imageFile){
    return res.status(400).json({error :"Post must contain either text or image "})
}
    const user = await User.findOne({clerkId  : userId});
    if(!user) return res.status(404).json({error : "User not found "})

     let imageUrl = "";
     if(imageUrl){
        try{
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image , {
                folder : "social_media_posts",
                resource_type : "image",
                transformation: [
                    { width: 800, height: 800, crop: "limit" },
                    { quality: "auto" } , 
                    {format: "auto"}
                ]

            }
        
        );

            imageUrl = uploadResponse.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return res.status(500).json({ error: "Image upload failed" });


        }

    }
    const post = await Post.create({
        user: user._id,
        content : content || "",
        image: imageUrl,

    })
    res.status(201).json({post })
    }
)


export const likePost = asyncHandler(async (req, res) => { 
    const {userId} = getAuth(req);
    const {postId} = req.params;
    const user = await User.findOne({clerkId : userId});
    const post = await Post.findById(postId);
    if(!user || !post) return res.status(404).json({error :  "user and post not found "})
      const isLiked = post.likes.includes(user._id);
    if(isLiked) {  
        //unlike kry ga 
        await Post.findByIdAndUpdate(postId, {
            $pull : {likes : user._id}
        }, {new: true});
    }
    else{
        //like kry ga 
        await Post.findByIdAndUpdate(postId, {
            $push : {likes : user._id}
        }, {new: true});
    }
    if(post.user.toString() === user._id.toString()) {
        await Notification.create({
            from : user._id,
            to: post.user,
            type : "like",
            post: postId,
        })
    }
    res.status(200).json({message: isLiked ? "Post unliked" : "Post liked"}

        )
        

})




export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const {userId} = getAuth(req);
    const user = await User.findOne({clerkId : userId});
    const post = await Post.findById(postId);
    if (!user || !post) {
        return res.status(404).json({ error: "User or post not found" });
    }
    if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You can only delete your own posts" });
    }
    await Comment.deleteMany({ post: postId });
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });


})