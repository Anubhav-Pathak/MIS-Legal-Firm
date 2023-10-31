import mongoose, { Path } from 'mongoose';

const ClientSchema = new mongoose.Schema({
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
        type: Array<Path>,
        required: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    phone: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Client = mongoose.model('User', ClientSchema);

export default Client;