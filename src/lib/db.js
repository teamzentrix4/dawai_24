import { PrismaClient } from "@prisma/client";

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return new PrismaClient();

  let url;
  try {
    url = new URL(connectionString);
  } catch {
    return new PrismaClient();
  }
  if (!url.hostname.includes("-pooler.") || !url.hostname.endsWith(".neon.tech")) return new PrismaClient();

  const defaults = { connection_limit: "8", pool_timeout: "15", connect_timeout: "15" };
  for (const [key, value] of Object.entries(defaults)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return new PrismaClient({ datasourceUrl: url.href });
}

const globalForPrisma = globalThis;
export const db = globalForPrisma.__dawai24Prisma || createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.__dawai24Prisma = db;

const connectionErrors = new Set(["P1001", "P1002", "P1008", "P1017", "P2024", "P2037"]);
export function isDatabaseUnavailable(error) {
  if (connectionErrors.has(error?.code ?? error?.errorCode)) return true;
  return error?.name === "PrismaClientInitializationError"
    && /can't reach database server|timed out|connection (?:was )?closed/i.test(error.message ?? "");
}
