import { Suspense } from "react";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import SearchResults from "@/components/Search/SearchResults";
import CategorySearchBar from "@/components/Common/CategorySearchBar";

export const metadata = { title: "Search Medicines | Dawai24" };

export default function SearchPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Search" }]} />
      <div className="container-x space-y-6 pb-16">
        <CategorySearchBar />
        <Suspense fallback={<p className="py-10 text-slate-500">Loading search results…</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </>
  );
}
