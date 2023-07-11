// mongoose Model for user

import mongoose from 'mongoose';

export interface UserInterface {
    company: string,
    username: string,
    password: string,
    clientFile?: string,
    pdfTemplates?: string[],
}

const UserSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    clientFile: {
        type: String,
        required: false,
    },
    pdfTemplates: {
        type: Array,
        required: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;