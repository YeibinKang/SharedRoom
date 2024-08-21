import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";



dotenv.config();

const generateToken = function (user, req, res) {


    try {
        const token = jwt.sign({ id: user.userID, role: "user" }, process.env.JWT_SECRET);
        return res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
            .status(200)
            .json({ message: "Cookie is created 😊 👌" });
        // return jwt.sign(
        //     {
        //         userID: user.userID,
        //         phone: user.phone,
        //         startDate: user.startDate,
        //         endDate: user.endDate,
        //         numberOfPeople: user.numberOfPeople
        //     }, "12345", {expiresIn: "1h",}
        // );
    } catch (err) {
        console.log(err.message)
    }

}

export default generateToken;