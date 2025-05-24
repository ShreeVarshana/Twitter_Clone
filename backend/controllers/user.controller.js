import notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.log(`Error in getting user profile controller: ${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}


//-----------------------------------------------------------------------------//


export const followUnFollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById({ _id: id })
        const currentUser = await User.findById({ _id: req.user._id })

        if (id === req.user._id) {
            return res.status(400).json({ error: "You can't follow or unfollow yourself" })
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "user not found" })
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            //unfollow
            await User.findByIdAndUpdate({ _id: id }, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { following: id } })
            res.status(200).json({ message: "Unfollow Successfully" })
        }
        else {
            //follow
            await User.findByIdAndUpdate({ _id: id }, { $push: { followers: req.user._id } })
            await User.findByIdAndUpdate({ _id: req.user._id }, { $push: { following: id } })
            //send notification

            const newNotification = new notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })

            await newNotification.save();
            res.status(200).json({ message: "Follow Successfully" })
        }
    }

    catch (err) {
        console.log(`Error in the follow and unfollow controller: ${err}`)
        res.status(500).json({ error: "Internal server error" })
    }
}


//---------------------------------------------------------------------------------//


export const getsuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById({ _id: userId }).select("-password")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])
        const fillteredUser = users.filter((user) => !userFollowedByMe.following.includes(user._id))
        const suggestedUsers = fillteredUser.slice(0, 4)

        suggestedUsers.forEach((user) => (user.password = null))
        res.status(200).json(suggestedUsers);

    } catch (err) {
        console.log(`Error in the follow and unfollow controller: ${err}`)
        res.status(500).json({ error: "Internal server error" })
    }
}