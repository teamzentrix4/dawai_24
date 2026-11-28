import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const emailOf = (value) => String(value || "").trim().toLowerCase();
const phoneOf = (value) => String(value || "").replace(/\D/g, "");

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim(), email = emailOf(body.email), phone = phoneOf(body.phone);
    const password = String(body.password || ""), confirmPassword = String(body.confirmPassword || "");
    if (name.length < 2) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must contain at least 8 characters." }, { status: 400 });
    if (password !== confirmPassword) return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    if (body.agree !== true) return NextResponse.json({ error: "Please accept the Terms and Privacy Policy." }, { status: 400 });
    const exists = await db.customer.findFirst({ where: { OR: [{ email: { equals: email, mode: "insensitive" } }, { phone }] }, select: { id: true } });
    if (exists) return NextResponse.json({ error: "An account with this email or mobile number already exists." }, { status: 409 });
    await db.customer.create({ data: { name, email, phone, passwordHash: hashPassword(password) }, select: { id: true } });
    return NextResponse.json({ success: true, message: "Your account was created successfully. You can now log in." }, { status: 201 });
  } catch (error) {
    if (error?.code === "P2002") return NextResponse.json({ error: "An account with this email or mobile number already exists." }, { status: 409 });
    if (process.env.NODE_ENV !== "production") console.error("Customer registration failed", error?.code || error?.name);
    return NextResponse.json({ error: "We could not create your account. Please try again." }, { status: 500 });
  }
}
