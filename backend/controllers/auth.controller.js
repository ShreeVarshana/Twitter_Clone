import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid emial format" });
        }

        const existingEmail = await User.findOne({ email: email })
        const existingUsername = await User.findOne({ username })

        if (existingEmail || existingUsername) {
            return res.status(400).json({ error: "Already the username or the email exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must have atleast 6 character length" });
        }

        //hashing the password
        //123456 = ced43romieoe4ri22

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword

        })

        if (newUser) {
            await newUser.save();
            res.status(200).json({
                //        message: "User Created Successfully"

                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following
            });

        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }


    } catch (err) {
        console.log(`Error in signup controller ${err}`);
        res.status(500).json({ error: "Internal server Error" });
    }


}




export const login = (req, res) => {
    res.send("login controller");
}
export const logout = (req, res) => {
    res.send("logout controller");
}