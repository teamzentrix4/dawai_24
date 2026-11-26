import {
    Boxes,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import CategoryRowActions from "@/components/Admin/CategoryRowActions";
import { db } from "@/lib/db";
import CategoryControls from "@/components/Admin/CategoryControls";
import { DeleteButton } from "@/components/Admin/FormControls";
import {
    deleteCategory,
    toggleCategoryStatus,
} from "../actions";
export const dynamic = "force-dynamic";

export default async function Categories({ searchParams }) {
    const params = await searchParams;
    const filter = params?.filter || "all";

    const rows = await db.category.findMany({
        include: {
            subcategories: {
                orderBy: { name: "asc" },
            },
            _count: {
                select: { products: true },
            },
        },
        orderBy: { sortOrder: "asc" },
    });

    const total = rows.length;
    const active = rows.filter((c) => c.active).length;
    const hidden = rows.filter((c) => !c.active).length;
    const withTypes = rows.filter(
        (c) => c.subcategories.length > 0
    ).length;

    const filteredRows = rows.filter((c) => {
        if (filter === "active") return c.active;
        if (filter === "hidden") return !c.active;
        if (filter === "types") return c.subcategories.length > 0;
        return true;
    });

    return (
        <section className="space-y-6">

            <CategoryControls
                total={total}
                active={active}
                hidden={hidden}
                withTypes={withTypes}
                selected={filter}
            />

            {/* CATEGORY TABLE */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="font-extrabold">All Shop Categories</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Manage category details and subcategories.
                        </p>
                    </div>

                    <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-[#7b2cbf]">
                        {total} Categories
                    </span>
                </div>

                {filteredRows.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1050px] text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-4">Image</th>
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Subcategories</th>
                                    <th className="px-5 py-4">Badge</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredRows.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/70">

                                        <td className="px-5 py-4">
                                            <div className="grid size-12 place-items-center overflow-hidden rounded-xl bg-slate-50 text-[#7b2cbf]">
                                                {c.imageUrl ? (
                                                    <img
                                                        src={c.imageUrl}
                                                        alt={c.name}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <Boxes size={21} />
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-bold text-slate-800">{c.name}</p>
                                            <p className="mt-1 text-xs text-slate-400">/{c.slug}</p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-sm font-bold text-slate-700">
                                                {c.subcategories.length}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-[#7b2cbf]">
                                                {c._count.products} Products
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <form action={toggleCategoryStatus}>
                                                <input type="hidden" name="id" value={c.id} />
                                                <input
                                                    type="hidden"
                                                    name="active"
                                                    value={String(!c.active)}
                                                />
                                                <button
                                                    type="submit"
                                                    aria-label={(c.active ? "Hide " : "Show ") + c.name}
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${c.active
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {c.active ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : (
                                                        <XCircle size={14} />
                                                    )}
                                                    {c.active ? "Active" : "Hidden"}
                                                </button>
                                            </form>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">

                                                {/* EDIT CATEGORY */}
                                                <CategoryRowActions category={c} />

                                                {/* DELETE CATEGORY */}
                                                <form action={deleteCategory}>
                                                    <input
                                                        type="hidden"
                                                        name="id"
                                                        value={c.id}
                                                    />
                                                    <DeleteButton />
                                                </form>

                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Boxes className="mx-auto text-slate-300" size={36} />
                        <h3 className="mt-3 font-bold">No categories found</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            No categories match this filter.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
