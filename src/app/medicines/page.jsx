import Link from "next/link";
import ProductListing from "@/components/Products/ProductListing";
import { getActiveProducts } from "@/lib/dbCatalog";

export const metadata={title:"Buy Medicines Online | Dawai24"};
export const dynamic="force-dynamic";
export default async function MedicinesPage({searchParams}){const sp=await searchParams;const q=sp?.q?.trim();const where=q?{OR:[{name:{contains:q,mode:"insensitive"}},{sku:{contains:q,mode:"insensitive"}}]}:{};const products=await getActiveProducts(where);return <div className="min-h-screen bg-white"><div className="mx-[4.5%] my-[1.25%] lg:mx-[8%]"><nav className="flex gap-2 text-sm"><Link href="/">Home</Link><span>/</span><span className="font-medium text-[#fc5a5a]">Medicines</span></nav></div><main className="mx-[4.5%] my-[1.25%] rounded-[12px] border border-[#e2ecf4] p-[4%] lg:mx-[8%] lg:p-[2%_4%]"><h1 className="text-2xl font-semibold text-[#031926]">All Medicines</h1><ProductListing products={products}/></main></div>}
