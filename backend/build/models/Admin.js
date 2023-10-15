"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AdminSchema = new mongoose_1.default.Schema({
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
        type: (Array),
        required: false,
        ref: "User"
    },
}, { timestamps: true });
const Admin = mongoose_1.default.model('Admin', AdminSchema);
exports.default = Admin;
