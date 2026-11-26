"use server";
import {redirect} from "next/navigation";import {db} from "@/lib/db";import {createSession,hashPassword,verifyPassword} from "@/lib/auth";
const fail=(path,message)=>redirect(`${path}?error=${encodeURIComponent(message)}`);
export async function setupAdmin(formData){const name=formData.get("name")?.toString().trim(),email=formData.get("email")?.toString().trim().toLowerCase(),password=formData.get("password")?.toString();if(!name||!/^\S+@\S+\.\S+$/.test(email||""))fail("/admin/login","Enter a valid name and email.");if(!password||password.length<8)fail("/admin/login","Password must contain at least 8 characters.");const configured=await db.adminUser.count({where:{passwordHash:{not:null}}});if(configured)fail("/admin/login","Admin account is already configured.");let admin=await db.adminUser.findFirst({orderBy:{createdAt:"asc"}});if(admin)admin=await db.adminUser.update({where:{id:admin.id},data:{name,email,passwordHash:hashPassword(password)}});else admin=await db.adminUser.create({data:{name,email,passwordHash:hashPassword(password),role:"ADMIN"}});await createSession(admin.id,"ADMIN");redirect("/admin")}
export async function adminLogin(formData){const email=formData.get("email")?.toString().trim().toLowerCase(),password=formData.get("password")?.toString();const admin=await db.adminUser.findUnique({where:{email}});if(!admin||!verifyPassword(password,admin.passwordHash))fail("/admin/login","Incorrect email or password.");await createSession(admin.id,"ADMIN");redirect("/admin")}
export async function customerSignup(formData){const name=formData.get("name")?.toString().trim(),email=formData.get("email")?.toString().trim().toLowerCase(),phone=formData.get("phone")?.toString().replace(/\D/g,""),password=formData.get("password")?.toString(),confirm=formData.get("confirmPassword")?.toString();if(!name||name.length<2)fail("/signup","Enter your full name.");if(!/^\S+@\S+\.\S+$/.test(email||""))fail("/signup","Enter a valid email address.");if(!/^[6-9]\d{9}$/.test(phone||""))fail("/signup","Enter a valid 10-digit mobile number.");if(!password||password.length<8)fail("/signup","Password must contain at least 8 characters.");if(password!==confirm)fail("/signup","Passwords do not match.");if(formData.get("agree")!=="on")fail("/signup","Please accept the terms and privacy policy.");const exists=await db.customer.findFirst({where:{OR:[{email},{phone}]}});if(exists)fail("/signup","An account with this email or mobile already exists.");const customer=await db.customer.create({data:{name,email,phone,passwordHash:hashPassword(password)}});await createSession(customer.id,"CUSTOMER");redirect("/account")}
export async function customerLogin(formData) {
  const login = formData.get("login")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const next = formData.get("next")?.toString();
  if (!login || !password) fail("/login", "Incorrect email/mobile or password.");

  if (login.includes("@")) {
    const admin = await db.adminUser.findUnique({where: {email: login}});
    if (admin && verifyPassword(password, admin.passwordHash)) {
      await createSession(admin.id, "ADMIN");
      redirect("/admin");
    }
  }

  const customer = await db.customer.findFirst({where: {OR: [{email: login}, {phone: login.replace(/\D/g, "")}]}});
  if (!customer || !verifyPassword(password, customer.passwordHash)) fail("/login", "Incorrect email/mobile or password.");
  await createSession(customer.id, "CUSTOMER");
  redirect(next?.startsWith("/") && !next.startsWith("//") ? next : "/account");
}
