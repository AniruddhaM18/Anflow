import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

declare global{
    namespace Express{
        interface Request{
            user?: {
                id: string,
                email: string
            }
        }
    }
}



export function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{

        
        //get token from headers
        const token = req.cookies.sessionToken || req.headers.authorization?.replace('Bearer ', '');
        if(!token){
            return res.status(400).json({
                message: "Authentication Required"
            })
        }
        // verify payload

        const payload = jwt.verify(token, JWT_SECRET!) as any;

        if(payload.type !== 'session'){
            return res.status(401).json({
                message: "Invalid token type"
            })
        }
        //attach user to request
        req.user = {
            id : payload.userId,
            email : payload.email
        };
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            message: "Invalid of expired token"
        })
    }
    console.log("Cookies at auth:", req.cookies);
console.log("Picked token:", req.cookies.sessionToken);

}