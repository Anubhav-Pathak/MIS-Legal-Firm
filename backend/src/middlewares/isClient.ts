import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

import { ClientInterface, myJWT } from "../types/types";
import Client from "../models/Client";

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const authHeader = req.get("Authorization");
        if (!authHeader) throw { statusCode: 401, message: "Not authenticated!" }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, privateKey, { algorithms: ['RS256'] }) as myJWT;
        if (!decodedToken) throw { statusCode: 401, message: "Not authenticated!" }
        const result : ClientInterface | null = await Client.findById(decodedToken.user)
        if (!result) throw { statusCode: 401, message: "Not authenticated!" }
        req.user = result as ClientInterface;
        next();
    } catch (err: any) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

export default isAuth;