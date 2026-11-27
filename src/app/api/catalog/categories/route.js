import { NextResponse } from "next/server";
import { getPublicCategories } from "@/lib/publicCategories";

export const revalidate = 300;

export async function GET() {
  const response = NextResponse.json(await getPublicCategories());
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  return response;
}
