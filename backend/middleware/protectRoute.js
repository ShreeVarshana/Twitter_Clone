import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({ error: "Unauthorized: No token provided" })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).json({ error: "Unauthorized: Invalid token" });
        }

        const user = await User.findOne({ _id: decode.userId }).select("-password");

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log(`Error in protectRoute middleware ${err}`);
        res.status(500).json({ error: "Internal server Error" });
    }
}

export default protectRoute;