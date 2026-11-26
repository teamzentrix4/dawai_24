"use server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, getAdminSession } from "@/lib/auth";
import { canPublishProduct, productData, productSteps, suggestedProductSlug, validateProduct } from "@/lib/productWizard";
import { reserveProductIds } from "@/lib/productIdentity";

const slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const refresh = (...paths) => paths.forEach(revalidatePath);

async function saveLocalImage(file, folder) {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  const allowedTypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const extension = allowedTypes[file.type];

  if (!extension) {
    throw new Error("Only JPG, PNG and WEBP images are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB.");
  }

  const directory = path.join(
    process.cwd(),
    "public",
    "uploads",
    folder
  );

  await mkdir(directory, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(directory, filename);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function createCategory(formData) {
  const name = formData.get("name")?.toString().trim();

  if (!name) return;

  const uploadedImage = await saveLocalImage(
    formData.get("image"),
    "categories"
  );

  const imageUrl =
    uploadedImage ||
    formData.get("imageUrl")?.toString().trim() ||
    null;

  await db.category.create({
    data: {
      name,
      slug: slugify(formData.get("slug")?.toString() || name),
      imageUrl,
      active: true,
    },
  });

  refresh("/admin/categories", "/categories", "/");
}

export async function updateCategory(formData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!id || !name) return;

  const uploadedImage = await saveLocalImage(
    formData.get("image"),
    "categories"
  );

  const imageUrl =
    uploadedImage ||
    formData.get("imageUrl")?.toString().trim() ||
    null;

  await db.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(formData.get("slug")?.toString() || name),
      imageUrl,
      active: formData.get("active") === "on",
    },
  });

  refresh("/admin/categories", "/categories", "/");
}

export async function toggleCategoryStatus(formData) {
  const id = formData.get("id");
  const active = formData.get("active");
  if (typeof id !== "string" || !id.trim() || (active !== "true" && active !== "false")) return;
  if (!await getAdminSession()) return;

  const { count } = await db.category.updateMany({ where: { id }, data: { active: active === "true" } });
  if (!count) return;

  for (const route of ["/admin/categories", "/", "/categories", "/api/catalog/categories"]) {
    revalidatePath(route);
  }
  revalidatePath("/category/[slug]", "page");
  revalidatePath("/category/[slug]/[subslug]", "page");
}

export async function createSubcategory(formData) {
  const name = formData.get("name")?.toString().trim();
  const categoryId = formData.get("categoryId")?.toString();

  if (!name || !categoryId) return;

  const uploadedImage = await saveLocalImage(
    formData.get("image"),
    "subcategories"
  );

  const imageUrl =
    uploadedImage ||
    formData.get("imageUrl")?.toString().trim() ||
    null;

  await db.subcategory.create({
    data: {
      name,
      slug: slugify(formData.get("slug")?.toString() || name),
      categoryId,
      imageUrl,
      active: true,
    },
  });

  refresh("/admin/categories", "/categories", "/");
}

export async function updateSubcategory(formData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();

  if (!id || !name) return;

  const uploadedImage = await saveLocalImage(
    formData.get("image"),
    "subcategories"
  );

  const imageUrl =
    uploadedImage ||
    formData.get("imageUrl")?.toString().trim() ||
    null;

  await db.subcategory.update({
    where: { id },
    data: {
      name,
      slug: slugify(formData.get("slug")?.toString() || name),
      imageUrl,
    },
  });

  refresh("/admin/categories", "/categories", "/");
}

export async function deleteSubcategory(formData) {
  const id = formData.get("id")?.toString();

  if (!id) return;

  await db.$transaction([
    db.product.updateMany({
      where: { subcategoryId: id },
      data: { subcategoryId: null },
    }),
    db.subcategory.delete({
      where: { id },
    }),
  ]);

  refresh("/admin/categories", "/categories", "/");
}

export async function deleteCategory(formData) {
  const id = formData.get("id")?.toString();

  if (!id) return;

  const count = await db.product.count({
    where: { categoryId: id },
  });

  if (count) {
    await db.$transaction([
      db.product.updateMany({
        where: { categoryId: id },
        data: { active: false },
      }),
      db.category.update({
        where: { id },
        data: { active: false },
      }),
    ]);
  } else {
    await db.category.delete({
      where: { id },
    });
  }

  refresh("/admin/categories", "/categories", "/");
}
export async function saveProduct(formData) {
  if (!await getAdminSession()) return { message: "Your admin session expired. Sign in again to save." };

  const fields = productSteps.flatMap(step => Object.keys(step.fields));
  const values = Object.fromEntries(fields.map(key => [key, String(formData.get(key) ?? "").trim()]));
  for (const field of ["short_description", "description", "meta_title", "meta_description", "meta_keywords"]) {
    values[field] = String(formData.get(field) ?? "").replace(/\r\n?/g, "\n");
  }
  values.gallery_images = formData.getAll("gallery_images").map(value => String(value).trim());
  const active = formData.get("intent") === "publish" && formData.get("active") === "true";
  const id = values.product_id;
  if (!id && formData.get("auto_slug") === "true") values.slug = "";
  if (formData.get("intent") === "publish" && !active) return { errors: { active: "Enable publication to publish this product." } };

  try {
    const result = await db.$transaction(async tx => {
      const previous = id ? await tx.product.findUniqueOrThrow({
        where: { id }, select: { slug: true, discount: true, shortDescription: true, description: true, seoTitle: true, seoDescription: true, metaKeywords: true },
      }) : null;
      if (!values.mrp && values.discount !== previous?.discount?.toString()) values.discount = "";
      const category = values.category ? await tx.category.findUnique({ where: { id: values.category }, include: { subcategories: true } }) : null;
      const errors = validateProduct(values, category ? [category] : [], { publishing: active, existingSlug: previous?.slug });
      if (Object.keys(errors).length) return { errors };

      const productId = id || (await reserveProductIds(tx, 1))[0];
      values.slug ||= previous?.slug || suggestedProductSlug(values.product_name, productId);
      const [skuMatch, slugMatch] = await Promise.all([
        values.sku ? tx.product.findUnique({ where: { sku: values.sku }, select: { id: true } }) : null,
        tx.product.findUnique({ where: { slug: values.slug }, select: { id: true } }),
      ]);
      if (skuMatch && skuMatch.id !== id) errors.sku = "This SKU is already in use.";
      if (slugMatch && slugMatch.id !== id) errors.slug = "This URL slug is already in use.";
      if (Object.keys(errors).length) return { errors };

      const brandName = values.brand;
      const brand = brandName ? await tx.brand.upsert({
        where: { slug: slugify(brandName) },
        update: { name: brandName },
        create: { name: brandName, slug: slugify(brandName) },
      }) : null;
      const data = productData(values, brand?.id ?? null, active);
      for (const field of ["shortDescription", "description", "seoTitle", "seoDescription", "metaKeywords"]) {
        if (previous?.[field]?.replace(/\r\n?/g, "\n") === data[field]) data[field] = previous[field];
      }
      const select = { id: true, slug: true, createdAt: true, updatedAt: true, active: true };
      const record = id ? await tx.product.update({ where: { id }, data, select }) : await tx.product.create({ data: { ...data, id: productId }, select });

      const remaining = await tx.productImage.findMany({ where: { productId: record.id }, orderBy: { sortOrder: "asc" } });
      for (const [sortOrder, url] of values.gallery_images.filter(Boolean).entries()) {
        const index = remaining.findIndex(image => image.url === url);
        if (index < 0) await tx.productImage.create({ data: { productId: record.id, url, sortOrder } });
        else {
          const [image] = remaining.splice(index, 1);
          if (image.sortOrder !== sortOrder) await tx.productImage.update({ where: { id: image.id }, data: { sortOrder } });
        }
      }
      if (remaining.length) await tx.productImage.deleteMany({ where: { id: { in: remaining.map(image => image.id) } } });
      return { product: { product_id: record.id, slug: record.slug, created_at: record.createdAt?.toISOString() ?? "", updated_at: record.updatedAt.toISOString(), active: record.active } };
    }, { isolationLevel: "ReadCommitted", timeout: 15000 });
    if (result.product) {
      refresh("/admin", "/admin/products", `/admin/products/${result.product.product_id}/edit`, "/medicines", "/");
      revalidatePath("/products/[slug]", "page");
    }
    return result;
  } catch (error) {
    if (error.code === "P2002") {
      const field = ["sku", "slug"].find(key => String(error.meta?.target).includes(key));
      if (field) return { errors: { [field]: field === "sku" ? "This SKU is already in use." : "This URL slug is already in use." } };
    }
    if (error.code === "P2025") return { message: "This product no longer exists. Open the product list and try again." };
    return { message: "Could not save the product. Your changes are still here. Please try again." };
  }
}
export async function toggleProduct(formData) {
  if (!await getAdminSession()) return;
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (active) {
    const product = await db.product.findUnique({ where: { id }, include: { category: true, subcategory: true } });
    if (!product) return;
    if (!canPublishProduct(product)) redirect("/admin/products/" + encodeURIComponent(id) + "/edit");
  }
  await db.product.update({ where: { id }, data: { active } });
  refresh("/admin", "/admin/products", "/medicines", "/");
}
export async function deleteProduct(formData){const id=formData.get("id")?.toString();const used=await db.orderItem.count({where:{productId:id}});if(used)await db.product.update({where:{id},data:{active:false,stock:0}});else await db.product.delete({where:{id}});refresh("/admin","/admin/products","/medicines","/");}
export async function createBanner(formData){await db.banner.create({data:{title:formData.get("title")?.toString(),imageUrl:formData.get("imageUrl")?.toString(),linkUrl:formData.get("linkUrl")?.toString()||null,placement:formData.get("placement")?.toString(),active:true}});refresh("/admin/content","/");}
export async function deleteBanner(formData){await db.banner.delete({where:{id:formData.get("id")?.toString()}});refresh("/admin/content","/");}
export async function updateOrderStatus(formData){await db.order.update({where:{id:formData.get("id")?.toString()},data:{status:formData.get("status")?.toString()}});refresh("/admin","/admin/orders");}
export async function updatePrescriptionStatus(formData){await db.prescription.update({where:{id:formData.get("id")?.toString()},data:{status:formData.get("status")?.toString(),notes:formData.get("notes")?.toString()||null}});refresh("/admin","/admin/prescriptions");}
export async function createCoupon(formData){await db.coupon.create({data:{code:formData.get("code")?.toString().toUpperCase(),type:formData.get("type")?.toString(),value:Number(formData.get("value")),minOrderValue:Number(formData.get("minOrderValue")||0),active:true}});refresh("/admin/marketing");}
export async function deleteCoupon(formData){await db.coupon.delete({where:{id:formData.get("id")?.toString()}});refresh("/admin/marketing");}
export async function logoutAdmin(){await destroySession("ADMIN");redirect("/");}
export async function saveAdminProfile(formData){const id=formData.get("id")?.toString(),name=formData.get("name")?.toString().trim(),email=formData.get("email")?.toString().trim().toLowerCase();if(!name||!email)return;if(id)await db.adminUser.update({where:{id},data:{name,email}});else await db.adminUser.create({data:{name,email,role:"ADMIN"}});refresh("/admin","/admin/settings");}
export async function saveStoreSettings(formData){const values={FREE_DELIVERY_ABOVE:String(Math.max(0,Number(formData.get("freeDeliveryAbove"))||0)),DELIVERY_FEE:String(Math.max(0,Number(formData.get("deliveryFee"))||0))};await db.$transaction(Object.entries(values).map(([key,value])=>db.storeSetting.upsert({where:{key},update:{value},create:{key,value}})));refresh("/admin/settings","/cart","/checkout");}
export async function createCmsEntry(formData){const type=formData.get("type")?.toString(),title=formData.get("title")?.toString().trim();if(!type||!title)return;const rawSlug=formData.get("slug")?.toString().trim();await db.cmsEntry.create({data:{type,title,slug:rawSlug?slugify(rawSlug):(["BLOG","POLICY","DISEASE","SALT","HEALTH_CONDITION","HELP_TOPIC"].includes(type)?slugify(title):null),subtitle:formData.get("subtitle")?.toString()||null,body:formData.get("body")?.toString()||null,badge:formData.get("badge")?.toString()||null,imageUrl:formData.get("imageUrl")?.toString()||null,linkUrl:formData.get("linkUrl")?.toString()||null,sortOrder:Number(formData.get("sortOrder")||0),active:formData.get("active")==="on"}});refresh("/admin/content","/","/blogs","/faqs");}
export async function deleteCmsEntry(formData){await db.cmsEntry.delete({where:{id:formData.get("id")?.toString()}});refresh("/admin/content","/","/blogs","/faqs");}
export async function toggleCmsEntry(formData){await db.cmsEntry.update({where:{id:formData.get("id")?.toString()},data:{active:formData.get("active")==="true"}});refresh("/admin/content","/","/blogs","/faqs");}
