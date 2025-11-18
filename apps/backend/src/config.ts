import dotenv from "dotenv";
dotenv.config();

export const RESEND_KEY = process.env.RESEND_KEY || "re_A1YTwfUq_27P77STxsT1qE8DV2R5VDnzh";
export const APP_URL = process.env.APP_URL || "http://localhost:3000";
export const JWT_SECRET = process.env.JWT_SECRET || "ANFLO18#ani";