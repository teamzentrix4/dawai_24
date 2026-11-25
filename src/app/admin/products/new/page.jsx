import { db } from "@/lib/db";
import PageHeader from "@/components/Admin/PageHeader";
import ProductWizard from "../../ProductWizard/page";
import { createProduct } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    db.category.findMany({
      where: { active: true },
      include: {
        subcategories: {
          where: { active: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),

    db.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        title="Add New Product"
        description="Create a product using our step-by-step product entry system."
      />

      <ProductWizard
        categories={categories}
        brands={brands}
        createAction={createProduct}
      />
    </section>
  );
}
