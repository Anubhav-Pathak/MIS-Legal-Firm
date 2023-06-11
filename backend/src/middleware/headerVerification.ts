import jwt from 'jsonwebtoken';
import User from "../models/User";
import { Request, Response } from "express";
import * as argon2 from "argon2";

const privateKey = process.env.JWT_SECRET || 'secret';

export async function verifyHeader(req: Request, res: Response, next: any) {
    try {
        const token = req.headers.token;
        if (token) {
            const decoded: any = jwt.verify(token.toString(), privateKey);
            const user = await User.findOne({ username: decoded.username });
            if (!user) throw new Error('User not found');
            if (!argon2.verify(user.password, decoded.password)) throw new Error('Password not valid');
            next();

        } else {
            throw new Error('No token provided');
        }

    } catch (e: any) {
        res.status(400).send({ message: e.message });
    }
}

export async function verifyAdminHeader(req: Request, res: Response, next: any) {
    try {
        const token = req.headers.token;
        if (token) {
            const decoded: any = jwt.verify(token.toString(), privateKey);
            const user = await User.findOne({ username: decoded.username });
            if (!user) throw new Error('User not found');
            if (!argon2.verify(user.password, decoded.password)) throw new Error('Password not valid');
            if (!user.isAdmin) throw new Error('User is not admin');
            next();

        } else {
            throw new Error('No token provided');
        }

    } catch (e: any) {
        res.status(400).send({ message: e.message });
    }
}