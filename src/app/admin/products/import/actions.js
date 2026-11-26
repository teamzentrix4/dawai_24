"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { importProductWorkbook } from "@/lib/productImportServer";

export async function importProducts(formData) {
  if (!await getAdminSession()) return { message: "Sign in as an admin to import products." };
  const result = await importProductWorkbook(db, formData.get("workbook"), formData.get("intent") === "import");
  if (result.imported) {
    revalidatePath("/admin");
    revalidatePath("/admin/products");
  }
  return result;
}
