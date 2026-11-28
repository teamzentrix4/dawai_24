import "server-only";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";

const hash = (value) => createHash("sha256").update(`${process.env.PASSWORD_RESET_SECRET}:${value}`).digest("hex");
export const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
export const validPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value || "");
export const otp = () => String(randomInt(100000, 1000000));
export const token = () => randomBytes(32).toString("hex");
export const secretReady = () => Boolean(process.env.PASSWORD_RESET_SECRET && process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
export const hashSecret = hash;
export const sameHash = (plain, stored) => { const a = Buffer.from(hash(plain), "hex"), b = Buffer.from(stored || "", "hex"); return a.length === b.length && timingSafeEqual(a, b); };
export async function sendOtpEmail(email, code) {
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [email], subject: "Your Dawai24 password reset code", html: `<div style="font-family:Arial,sans-serif;color:#171725"><h2>Dawai24 password reset</h2><p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request this, please ignore this email.</p></div>` }) });
  if (!response.ok) throw new Error("Email provider unavailable");
}
