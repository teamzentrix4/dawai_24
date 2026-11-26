
import { db } from "@/lib/db";
import DataPage from "@/components/Admin/DataPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const customers = await db.customer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DataPage
      title="Customers"
      description="View and manage all registered customers."
      count={customers.length}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* TABLE HEADER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              All Customers
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Complete customer contact information
            </p>
          </div>

          <span className="w-fit rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
            {customers.length} Customers
          </span>
        </div>

        {/* RESPONSIVE TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer Name
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone Number
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-violet-50/40"
                  >
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold uppercase text-violet-700">
                          {customer.name?.charAt(0) || "C"}
                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {customer.name || "Unnamed Customer"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.email || (
                        <span className="text-slate-400">Not provided</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {customer.phone || (
                        <span className="text-slate-400">Not provided</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="text-sm font-semibold text-slate-700">
                      No customers found
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Registered customers will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER */}
        {customers.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
            <p className="text-xs text-slate-500">
              Showing {customers.length} customers
            </p>
          </div>
        )}
      </div>
    </DataPage>
  );
}
