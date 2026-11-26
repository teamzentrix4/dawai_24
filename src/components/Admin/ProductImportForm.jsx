"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";
import { maxProductRows, optionalProductColumns, requiredProductColumns } from "@/lib/productImport";

const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#7b2cbf] px-5 py-2 text-sm font-bold text-white hover:bg-[#6922a8] disabled:opacity-50";

export default function ProductImportForm({ action }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState("");
  const working = useRef(false);
  const input = useRef(null);
  const counts = result?.completed ? result : result?.preview;
  const checked = Boolean(result?.preview && result.errors.length === 0);
  const ready = checked && Boolean(counts.imported || counts.updated);
  const headings = [...requiredProductColumns, ...optionalProductColumns].join("\t");

  async function run(intent) {
    if (!file || working.current) return;
    working.current = true;
    setPending(intent);
    const data = new FormData();
    data.set("workbook", file);
    data.set("intent", intent);
    try {
      setResult(await action(data));
    } catch {
      setResult({ message: "The request failed. Check the workbook again before retrying." });
    } finally {
      working.current = false;
      setPending("");
    }
  }

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
    <form className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" onSubmit={event => { event.preventDefault(); run(ready ? "import" : "check"); }}>
      <label htmlFor="product-workbook" className="block text-sm font-bold">Excel workbook</label>
      <p id="workbook-help" className="mt-1 text-sm text-slate-500">Use the first sheet, with column headings in row 1. Up to {maxProductRows} products per file, 2 MB maximum.</p>
      <input ref={input} id="product-workbook" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" aria-describedby="workbook-help" disabled={Boolean(pending)}
        onChange={event => { setFile(event.target.files[0] ?? null); setResult(null); }}
        className="mt-4 block w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-50 file:px-3 file:py-2 file:font-bold file:text-[#7b2cbf]" />
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" disabled={!file || Boolean(pending) || Boolean(result?.completed) || (checked && !ready)} className={primary}>
          <Upload size={16} />{pending ? pending === "check" ? "Checking workbook…" : "Saving import…" : ready ? "Apply import" : "Check workbook"}
        </button>
        {file && <button type="button" disabled={Boolean(pending)} className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50" onClick={() => {
          input.current.value = "";
          setFile(null);
          setResult(null);
          input.current.focus();
        }}>Clear file</button>}
      </div>
      {result?.message && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{result.message}</p>}
      {(checked || result?.completed) && <div role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-bold">{result.completed ? "Import complete" : ready ? "Ready to apply" : "No product changes needed"}</p>
        <p className="mt-1">New drafts: {counts.imported} · Existing products {result.completed ? "updated" : "to update"}: {counts.updated} · Duplicate rows skipped or merged: {counts.skipped}</p>
        {result.completed && <Link href="/admin/products" className="mt-2 inline-block font-bold underline">View products</Link>}
      </div>}
      {result?.errors?.length > 0 && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <p className="font-bold">{result.errors.length} of {result.total} rows need changes. Fix them in Excel and select the file again.</p>
        <ul className="mt-2 max-h-72 space-y-2 overflow-auto">
          {result.errors.map(({ row, fields }) => <li key={row}><strong>Row {row}</strong> · {Object.entries(fields).map(([key, message]) => key + ": " + message).join(" ")}</li>)}
        </ul>
      </div>}
      {result?.warnings?.length > 0 && <details className="mt-4 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-[#7b2cbf]">View optional review notes</summary>
        <p className="mt-2">{result.warnings.length} rows have notes about missing fields or duplicate matches. These notes don’t block the import.</p>
        <ul className="mt-2 max-h-72 space-y-2 overflow-auto">
          {result.warnings.map(({ row, fields }) => <li key={row}><strong>Row {row}</strong> · {Object.entries(fields).map(([key, message]) => key + ": " + message).join(" ")}</li>)}
        </ul>
      </details>}
    </form>

    <aside className="min-w-0 self-start rounded-2xl border border-slate-200 bg-white p-5 text-sm">
      <h2 className="font-extrabold">Excel columns</h2>
      <p className="mt-2 text-slate-600">Required: {requiredProductColumns.join(", ")}.</p>
      <p className="mt-2 text-slate-600">Paste these headings into cell A1. Matched categories are linked. Missing or unmatched categories are saved as pending review.</p>
      <p className="mt-2 text-slate-600">Existing products match by SKU or by product name with compatible brand and pack details. Only blank fields are filled. New products get an automatic SKU if none is supplied.</p>
      <label htmlFor="product-import-headings" className="sr-only">Copyable Excel column headings</label>
      <textarea id="product-import-headings" readOnly rows={2} onFocus={event => event.currentTarget.select()} value={headings} className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs" />
      <p className="mt-2 text-slate-600">Enter a selling price for new products. Leave unknown MRP blank. Separate gallery URLs with a vertical bar (|).</p>
      <p className="mt-2 text-slate-600">Slugs are generated automatically during import. You can change them later in Edit Product.</p>
    </aside>
  </div>;
}
