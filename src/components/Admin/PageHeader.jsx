import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";

export default function PageHeader({ title, description, actionLabel, actionHref, parent, secondaryAction }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-400"><Link href="/admin" className="hover:text-[#7b2cbf]">Dashboard</Link><ChevronRight size={13}/>{parent&&<><span>{parent}</span><ChevronRight size={13}/></>}<span className="text-slate-600">{title}</span></div><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>{description&&<p className="mt-1.5 max-w-2xl text-sm text-slate-500">{description}</p>}</div>{(actionHref || secondaryAction) && <div className="flex shrink-0 flex-wrap gap-2">{secondaryAction}{actionHref&&<Link href={actionHref} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#7b2cbf] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#6922a8]"><Plus size={18}/>{actionLabel}</Link>}</div>}</div>;
}
