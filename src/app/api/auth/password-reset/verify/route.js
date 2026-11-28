import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashSecret, normalizeEmail, sameHash, secretReady, token } from "@/lib/passwordReset";
export async function POST(request) {
  const { email: raw, otp } = await request.json().catch(() => ({})); const email = normalizeEmail(raw); const now = new Date();
  if (!secretReady() || !/^\d{6}$/.test(otp || "")) return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
  const challenge = await db.passwordResetChallenge.findFirst({ where: { email, usedAt: null }, orderBy: { createdAt: "desc" } });
  if (!challenge || !challenge.userId || challenge.expiresAt <= now || challenge.attemptCount >= 5 || !sameHash(otp, challenge.otpHash)) { if (challenge && challenge.attemptCount < 5) await db.passwordResetChallenge.update({ where: { id: challenge.id }, data: { attemptCount: { increment: 1 } } }); return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 }); }
  const resetToken = token(); await db.passwordResetChallenge.update({ where: { id: challenge.id }, data: { verifiedAt: now, tokenHash: hashSecret(resetToken), tokenExpiresAt: new Date(now.getTime() + 600000) } });
  return NextResponse.json({ resetToken });
}
