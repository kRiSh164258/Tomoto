import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import User, {IUser} from '../model/User.js'
import Trycatch from "./trycatch.js";

export interface AuthenticatedRequest extends Request{
    user?: IUser | null;
}

export const isAuth = async(req:AuthenticatedRequest, res:Response, next:NextFunction):
Promise<void> =>{
    try{
        const isHeader = req.headers.authorization;

        if(!isHeader || !isHeader.startsWith("Bearer "))
        {
            res.status(401).json({
                message: "Please Login - No auth header"
            });
            return;
        }
        
        const token = isHeader.split(" ")[1];

        if(!token)
        {
            res.status(401).json({
                message: "Please Login - Token missing"
            });
            return;
        }

        const decodeValue = jwt.verify(token , process.env.JWT_Sec as string) as JwtPayload;

        if(!decodeValue || !decodeValue.user)
        {
             res.status(401).json({
               message: "iNVALID TOKEN",
             });
             return;
        }

        req.user = decodeValue.user;

        next();

    }
    catch(error)
    {
        res.status(500).json({
            message: "Please Login -- Jwt error"
        })

    }
}

