import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publicCategoryFilter } from "@/lib/productWizard";

export async function GET() {
  const data = await db.category.findMany({ where: publicCategoryFilter, include: { subcategories: { where: publicCategoryFilter, orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json(data);
}
