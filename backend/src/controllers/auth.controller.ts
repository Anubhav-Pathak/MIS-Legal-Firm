import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import Admin from '../models/Admin';
import Client from '../models/Client';
import { ClientInterface, AdminInterface } from '../types/types';

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

async function signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password, isAdmin, bypass }: {
        username: string,
        password: string,
        isAdmin: boolean,
        bypass: boolean | undefined
    } = req.body;

    console.log(req.body);

    try {
        const user : AdminInterface | ClientInterface | null =  isAdmin ? await Admin.findOne({ username }) : await Client.findOne({ username });
        if (!user) throw {statusCode: 401, message: 'Invalid Credentials'};
        if (bypass && user.password === password) {
            const token = jwt.sign({user: user._id}, privateKey, { algorithm: 'RS256' });
            return res.status(200).send({ message: 'User signed in', token, company: user.company});
        }
        const isPasswordCorrect = await argon2.verify(user.password, password);
        if (!isPasswordCorrect) throw {statusCode: 401, message: 'Invalid Credentials'}
        const token = jwt.sign({user: user._id}, privateKey, { algorithm: 'RS256' });
        return res.status(200).send({ message: 'User signed in', token, company: user.company});
    } catch (err: any) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw Error('No token provided')
    try {
        const decoded = jwt.verify(token, privateKey) as JwtPayload;
        if (!decoded) throw Error('Invalid token');
        if (!await Admin.findById(decoded.user)) throw Error("Invalid Token");
        return res.status(200).send({ isAuthenticated: true });
    } catch (err: any) {
        return res.status(200).send({ isAuthenticated: false })
    }
};

export default signIn;