import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashSecret, normalizeEmail, otp, secretReady, sendOtpEmail } from "@/lib/passwordReset";

const generic = () => NextResponse.json({ message: "If an account exists for this email, a verification code has been sent.", cooldown: 60 });
const ipHash = (request) => hashSecret(request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown");
export async function POST(request) {
  const origin = request.headers.get("origin"); if (origin && new URL(origin).host !== request.headers.get("host")) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  const { email: raw } = await request.json().catch(() => ({})); const email = normalizeEmail(raw);
  if (!/^\S+@\S+\.\S+$/.test(email)) return generic();
  if (!secretReady()) return NextResponse.json({ error: "Password reset is temporarily unavailable. Please try again later." }, { status: 503 });
  const now = new Date(), hour = new Date(now.getTime() - 3600000), ip = ipHash(request);
  const [recentEmail, recentIp, user] = await Promise.all([db.passwordResetChallenge.findFirst({ where: { email, createdAt: { gt: hour } }, orderBy: { createdAt: "desc" } }), db.passwordResetChallenge.count({ where: { ipHash: ip, createdAt: { gt: hour } } }), db.customer.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: { id: true } })]);
  if (recentIp >= 20 || (recentEmail && recentEmail.resendAfter > now)) return generic();
  const code = otp();
  await db.$transaction([db.passwordResetChallenge.updateMany({ where: { email, usedAt: null, verifiedAt: null }, data: { usedAt: now } }), db.passwordResetChallenge.create({ data: { email, userId: user?.id, otpHash: hashSecret(code), ipHash: ip, expiresAt: new Date(now.getTime() + 600000), resendAfter: new Date(now.getTime() + 60000) } })]);
  if (user) { try { await sendOtpEmail(email, code); } catch { return NextResponse.json({ error: "We could not send the verification email. Please try again shortly." }, { status: 503 }); } }
  return generic();
}
