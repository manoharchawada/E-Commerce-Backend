import { transporter } from "../src/utils/nodemailer.js"; // adjust path to wherever this file lives
import dotenv from "dotenv";
dotenv.config();
export const DB_NAME = "E-Commerce-Backend";

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"${process.env.MAIL_BRAND_NAME || "MarketPlace"}" <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject,
    html,
  });
}
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
}
export const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
