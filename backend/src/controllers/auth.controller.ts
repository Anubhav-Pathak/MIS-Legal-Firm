import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

import Admin from '../models/Admin';
import Client from '../models/Client';
import { ClientInterface, AdminInterface } from '../types/types';

const privateKey = fs.readFileSync(path.join(path.resolve(), 'privateKey.key'));

async function signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password, isAdmin }: {
        username: string,
        password: string,
        isAdmin: boolean
    } = req.body;
    try {
        const user : AdminInterface | ClientInterface | null =  isAdmin ? await Admin.findOne({ username }) : await Client.findOne({ username });
        if (!user) throw {statusCode: 401, message: 'Invalid Credentials'};
        const isPasswordCorrect = await argon2.verify(user.password, password);
        if (!isPasswordCorrect) throw {statusCode: 401, message: 'Invalid Credentials'}
        const token = jwt.sign({user: user._id}, privateKey, { algorithm: 'RS256' });
        return res.status(200).send({ message: 'User signed in', token, company: user.company});
    } catch (err: any) {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    }
}

export default signIn;