import "server-only";
import {createHash,randomBytes,scryptSync,timingSafeEqual} from "crypto";
import {cookies} from "next/headers";
import {db} from "@/lib/db";

export const ADMIN_COOKIE="dawai24_admin_session";
export const CUSTOMER_COOKIE="dawai24_customer_session";
const SESSION_DAYS=30;

export function hashPassword(password){const salt=randomBytes(16).toString("hex");const hash=scryptSync(password,salt,64).toString("hex");return `${salt}:${hash}`}
export function verifyPassword(password,stored){if(!stored)return false;const [salt,hash]=stored.split(":");if(!salt||!hash)return false;const expected=Buffer.from(hash,"hex"),actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual)}
export function safeCompare(value,expected){const a=Buffer.from(value||""),b=Buffer.from(expected||"");return a.length===b.length&&timingSafeEqual(a,b)}
const tokenHash=(token)=>createHash("sha256").update(token).digest("hex");

export async function createSession(subjectId,subjectType){const token=randomBytes(32).toString("hex");const expiresAt=new Date(Date.now()+SESSION_DAYS*86400000);await db.$transaction([db.authSession.deleteMany({where:{subjectId,subjectType}}),db.authSession.create({data:{tokenHash:tokenHash(token),subjectId,subjectType,expiresAt}})]);const jar=await cookies();jar.set(subjectType==="ADMIN"?ADMIN_COOKIE:CUSTOMER_COOKIE,token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",expires:expiresAt});return token}
export async function destroySession(subjectType){const jar=await cookies();const name=subjectType==="ADMIN"?ADMIN_COOKIE:CUSTOMER_COOKIE;const token=jar.get(name)?.value;if(token)await db.authSession.deleteMany({where:{tokenHash:tokenHash(token),subjectType}});jar.delete(name)}
async function getSession(subjectType){const jar=await cookies();const token=jar.get(subjectType==="ADMIN"?ADMIN_COOKIE:CUSTOMER_COOKIE)?.value;if(!token)return null;const session=await db.authSession.findFirst({where:{tokenHash:tokenHash(token),subjectType,expiresAt:{gt:new Date()}}});if(!session)return null;if(subjectType==="ADMIN"){const user=await db.adminUser.findUnique({where:{id:session.subjectId}});return user?{session,user}:null}const user=await db.customer.findUnique({where:{id:session.subjectId}});return user?{session,user}:null}
export const getAdminSession=()=>getSession("ADMIN");
export const getCustomerSession=()=>getSession("CUSTOMER");
