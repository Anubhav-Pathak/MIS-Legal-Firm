import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if (req.isAdmin.company !== "iccan") throw { statusCode: 401, message: "Not authorized as Admin!" }
        next();
    } catch (err: any) {
        if (!err.statusCode) err.statusCode = 500;
        next(err)
    } 
}

export default isAdmin;