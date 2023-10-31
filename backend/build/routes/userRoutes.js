"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const admin_controller_1 = require("../controllers/admin.controller");
const isClient_1 = __importDefault(require("../middlewares/isClient"));
const userRouter = (0, express_1.Router)();
userRouter.post("/read", isClient_1.default, user_controller_1.postRead);
userRouter.get("/filter", isClient_1.default, user_controller_1.getFilter);
userRouter.get("/generate-otp", admin_controller_1.generateOtp);
userRouter.get("/verify-otp", admin_controller_1.verifyOtp);
exports.default = userRouter;
