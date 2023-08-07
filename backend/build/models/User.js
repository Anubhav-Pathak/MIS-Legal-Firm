"use strict";
// mongoose Model for user
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
