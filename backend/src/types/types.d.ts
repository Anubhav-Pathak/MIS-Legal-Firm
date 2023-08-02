import mongoose, { Path } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Express } from 'express';

export interface AdminInterface {
    _id: mongoose.Types.ObjectId,
    company: string,
    username: string,
    password: string,
    companies: mongoose.Types.ObjectId[] | ClientInterface[],
}

export interface ClientInterface {
    _id: mongoose.Types.ObjectId,
    company: string,
    username: string,
    password: string,
    clientFile?: Path,
    fileSizeInKB?: number,
    fileUpdatedOn?: Date,
    pdfTemplates?: Path[],
    createdBy: mongoose.Types.ObjectId
}

export interface myJWT extends JwtPayload {
    user: AdminInterface | ClientInterface | null
}

export interface myRequest extends Request {
    user: AdminInterface | ClientInterface | null,
}

declare global {
    namespace Express {
        export interface Request {
            user?: AdminInterface | ClientInterface | null,
        }
    }
}

interface UploadedFile {
    name: string;
    mv: (path: string) => Promise<void>;
}