"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOTP = void 0;
const twilio_1 = require("twilio");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NO;
const verifyID = process.env.TWILIO_VERIFY_ID;
const client = new twilio_1.Twilio(accountSid || "", authToken || "");
const generateOTP = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const verification = yield client.verify.v2
        .services(verifyID || "")
        .verifications.create({ to: phoneNumber, channel: 'sms' });
});
exports.generateOTP = generateOTP;
const verifyOTP = (phoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    const verification = yield client.verify.v2
        .services(verifyID || "")
        .verificationChecks.create({ to: phoneNumber, code });
    return verification.status === "approved";
});
exports.verifyOTP = verifyOTP;
