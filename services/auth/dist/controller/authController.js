import User from "../model/User.js";
import jwt from "jsonwebtoken";
import Trycatch from "../middleware/trycatch.js";
import { oauth2client } from "../config/googleConfig.js";
import axios from "axios";
export const loginUser = Trycatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        return res.status(401).json({
            message: "Authorisation need code"
        });
    }
    const googleres = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleres.tokens);
    let userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleres.tokens.access_token}`);
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({
        email,
    });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_Sec, {
        expiresIn: "15d",
    });
    res.status(200).json({ message: "USer Login", token, email, user });
});
const allowedRoles = ["customer", "rider", "seller"];
export const addUserRole = Trycatch(async (req, res) => {
    if (!req.user?._id) {
        return res.status(401).json({
            message: "Unauthorised",
        });
    }
    const { role } = req.body;
    if (!allowedRoles.includes(role)) {
        return res.status(401).json({
            message: "Invalid Role",
        });
    }
    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
    if (!user) {
        return res.status(404).json({
            message: "User Not Found",
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_Sec, {
        expiresIn: "15d",
    });
    res.json({ user, token });
});
export const myProfile = Trycatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
