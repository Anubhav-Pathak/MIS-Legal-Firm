import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not authenticated!");
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, privateKey);
    } catch (err) {
        throw err;
    }
    if (!decodedToken) {
        const error = new Error("Not authenticated!");
        throw error;
    }
    req.userId = decodedToken.user;
    next();
}

export default isAuth;