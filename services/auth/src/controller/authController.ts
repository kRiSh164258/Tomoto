import { Request, Response } from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import Trycatch from "../middleware/trycatch.js";

export const loginUser = Trycatch(async(req,res)=>{
     const { email, name, picture } = req.body;

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

     const token = jwt.sign({ user }, process.env.JWT_Sec as string, {
       expiresIn: "15d",
     });

     res.status(200).json({ message: "USer Login", token, email });
})
