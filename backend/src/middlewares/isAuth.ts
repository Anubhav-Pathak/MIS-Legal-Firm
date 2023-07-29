import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw { statusCode: 401, message: "Not authenticated!" }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, privateKey, { algorithms: ['RS256'] });
    } catch (err) {
        throw err;
    }
    if (!decodedToken) throw { statusCode: 401, message: "Not authenticated!" }
    const result = await User.findById(decodedToken.user)
    if (!result) throw { statusCode: 401, message: "Not authenticated!" }
    req.isAdmin = result;
    req.user = req.body.user ? req.body.user : result;
    next();
}

export default isAuth;