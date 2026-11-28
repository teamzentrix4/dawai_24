import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { normalizeEmail, sameHash, secretReady, validPassword } from "@/lib/passwordReset";
export async function POST(request) {
  const { email: raw, resetToken, password, confirmPassword } = await request.json().catch(() => ({})); const email = normalizeEmail(raw); const now = new Date();
  if (!secretReady() || password !== confirmPassword || !validPassword(password)) return NextResponse.json({ error: "Use at least 8 characters with uppercase, lowercase, a number, and a special character." }, { status: 400 });
  try { await db.$transaction(async (tx) => { const challenge = await tx.passwordResetChallenge.findFirst({ where: { email, usedAt: null, verifiedAt: { not: null }, tokenExpiresAt: { gt: now } }, orderBy: { createdAt: "desc" } }); if (!challenge?.userId || !sameHash(resetToken, challenge.tokenHash)) throw new Error("invalid"); const consumed = await tx.passwordResetChallenge.updateMany({ where: { id: challenge.id, usedAt: null }, data: { usedAt: now } }); if (!consumed.count) throw new Error("invalid"); await tx.customer.update({ where: { id: challenge.userId }, data: { passwordHash: hashPassword(password) } }); await tx.authSession.deleteMany({ where: { subjectId: challenge.userId, subjectType: "CUSTOMER" } }); }); } catch { return NextResponse.json({ error: "This reset link has expired. Request a new verification code." }, { status: 400 }); }
  return NextResponse.json({ message: "Your password has been reset successfully." });
}
