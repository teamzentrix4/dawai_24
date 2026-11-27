import { NextResponse } from "next/server";
import { getActiveProducts } from "@/lib/dbCatalog";

export async function GET(request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  const where = q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {};
  const response = NextResponse.json(await getActiveProducts(where));
  // The storefront reads this catalogue on first load. Short shared caching
  // greatly reduces repeated database work while keeping product updates fresh.
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return response;
}
