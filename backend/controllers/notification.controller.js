import notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notification = await notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"

        })
        await notification.updateMany({ to: userId }, { read: true });

        res.status(200).json(notification);
    } catch (err) {
        console.log(`Error in getNotification controller: ${err}`);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await notification.deleteMany({ to: userId });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.log(`Error in deleteNotification controller: ${err}`);
        res.status(500).json({ error: "Internal server error" })
    }
}