import * as argon2 from "argon2";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import User from "../models/User";

const privateKey = process.env.JWT_SECRET || 'secret';

export async  function signUp(req: Request, res: Response) {
    const { username, password, email }: {
        username: string,
        password: string,
        email: string
    } = req.body;
    let hashedPassword = await argon2.hash(password);
    try {
        const user = await User.create({
            username,
            password: hashedPassword,
            email
        });
        if (user) return res.status(201).send({ message: 'User created' });
        else return res.status(400).send({ message: 'User not created' });
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
    }
}

export async function signIn(req: Request, res: Response) {
    const { username, password, email }: {
        username: string,
        password: string,
        email: string
    } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const isPasswordCorrect = await argon2.verify(user.password, password);
            if (isPasswordCorrect){
                const token = jwt.sign(
                    { username: user.username }, privateKey, { algorithm: 'RS256' });
                return res.status(200).send({ message: 'User signed in', token });

            }
            else return res.status(400).send({ message: 'User not signed in' });
        }
        else return res.status(400).send({ message: 'User not signed in' });
    } catch (e: any) {
        return res.status(400).send({ message: e.message });
    }
}