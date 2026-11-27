
import { db } from "@/lib/db";
import PageHeader from "@/components/Admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function Support() {
  const rows = await db.contactInquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="space-y-6">
      <PageHeader
        title="Support Enquiries"
        description="Messages submitted from the storefront contact form."
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    S.No.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Phone No.
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Query
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {row.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.phone || "—"}
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-slate-700">
                      <p className="whitespace-pre-line break-words">
                        {row.message}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                      {row.createdAt.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-600">
              No support enquiries yet.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              New customer enquiries will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
