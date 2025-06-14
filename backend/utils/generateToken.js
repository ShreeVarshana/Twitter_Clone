import jwt from "jsonwebtoken";


const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 1000,
        httpOnly: true, //xss attacks can be prevented
        sameSite: "strict",//CSRF attack prevents
        secure: process.env.NODE_ENV !== "development"
    })
}


export default generateToken;