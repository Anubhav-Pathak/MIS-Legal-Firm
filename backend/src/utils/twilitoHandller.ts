import { Twilio } from 'twilio';
import { config } from 'dotenv';

config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NO;
const verifyID = process.env.TWILIO_VERIFY_ID;

const client = new Twilio(accountSid || "", authToken || "")

export const generateOTP = async (phoneNumber: string): Promise<void> => {
    const verification = await client.verify.v2
        .services(verifyID || "")
        .verifications.create({ to: phoneNumber, channel: 'sms' });
}

export const verifyOTP = async (phoneNumber: string, code: string): Promise<boolean> => {
    const verification = await client.verify.v2
        .services(verifyID || "")
        .verificationChecks.create({ to: phoneNumber, code });
    return verification.status === "approved";
}
