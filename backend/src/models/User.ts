// mongoose Model for user

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: false,
        unique: true,
        minlength: 5,
        maxlength: 40,
    },
});

const User = mongoose.model('User', UserSchema);

export default User;