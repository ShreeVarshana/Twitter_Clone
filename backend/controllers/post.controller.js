import User from "../models/user.model.js"
import cloudinary from "cloudinary";
import Post from "../models/post.model.js";
import notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })
        await newPost.save();
        res.status(201).json(newPost);

    } catch (err) {
        console.log(`Error in create post controller: ${err}`)
        res.status(500).json({ error: "Internal server error" });
    }
}


//----------------------------------------------------------------------------------//

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;


        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }


        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete the post" });
        }


        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }


        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error(`Error in deletion of the post: ${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
};


//----------------------------------------------------------------------------------------------------------------------//


export const createcomment = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Comment text is required" })
        }

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = {
            user: userId,
            text
        }
        post.comments.push(comment);

        await post.save();
        res.status(200).json(post);

    } catch (err) {
        console.log(`Error in commenting the post: ${err}`)
        res.status(500).json({ error: "Internal server error" })
    }
}


//------------------------------------------------------------------------------//
export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.like.includes(userId);

        if (userLikedPost) {
            // Unlike the post
            await Post.updateOne({ _id: postId }, { $pull: { like: userId } });
            return res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // Like the post
            post.like.push(userId);
            await post.save();

            const noti = new notification({
                from: userId,
                to: post.user,
                type: "like"
            });
            await noti.save();

            return res.status(200).json({ message: "Post liked successfully" });
        }

    } catch (err) {
        console.error(`Error in likeUnlikePost controller: ${err}`);
        return res.status(500).json({ error: "Internal server error" });
    }
};
