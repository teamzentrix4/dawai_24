import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { publicCategoryFilter } from "@/lib/productWizard";

// Category navigation changes infrequently. Keeping it cached removes a database
// round trip from the header on every page view.
export const getPublicCategories = unstable_cache(
  () => db.category.findMany({
    where: publicCategoryFilter,
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      subcategories: {
        where: publicCategoryFilter,
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  }),
  ["public-category-navigation"],
  { revalidate: 300, tags: ["public-category-navigation"] },
);
