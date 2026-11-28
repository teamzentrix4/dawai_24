import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const login = String(body.email || "").trim().toLowerCase(), password = String(body.password || "");
    if (!/^\S+@\S+\.\S+$/.test(login) || !password) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    const [admin, customer] = await Promise.all([
      db.adminUser.findUnique({ where: { email: login }, select: { id: true, passwordHash: true } }),
      db.customer.findFirst({ where: { email: { equals: login, mode: "insensitive" } }, select: { id: true, passwordHash: true } }),
    ]);
    if (admin && verifyPassword(password, admin.passwordHash)) { await createSession(admin.id, "ADMIN"); return NextResponse.json({ success: true, role: "ADMIN", redirectTo: "/admin" }); }
    if (!customer || !verifyPassword(password, customer.passwordHash)) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    await createSession(customer.id, "CUSTOMER"); return NextResponse.json({ success: true, role: "CUSTOMER", redirectTo: "/account" });
  } catch (error) { if (process.env.NODE_ENV !== "production") console.error("Login failed", error?.code || error?.name); return NextResponse.json({ error: "We could not sign you in. Please try again." }, { status: 500 }); }
}
