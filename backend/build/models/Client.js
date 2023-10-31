"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ClientSchema = new mongoose_1.default.Schema({
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
        type: (Array),
        required: false,
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    phone: {
        type: String,
        required: false
    }
}, { timestamps: true });
const Client = mongoose_1.default.model('User', ClientSchema);
exports.default = Client;
