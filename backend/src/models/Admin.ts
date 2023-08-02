import mongoose from 'mongoose';
import { AdminInterface } from '../types/types';

const AdminSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        minlength: 5,
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
    companies: {
        type: Array<mongoose.Types.ObjectId>,
        required: false,
        ref:"User"
    },
}, { timestamps: true });

const Admin = mongoose.model<AdminInterface>('Admin', AdminSchema);
export default Admin;