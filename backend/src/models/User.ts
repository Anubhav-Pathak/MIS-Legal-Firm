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
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    company: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

export default User;