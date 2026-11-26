"use client";

import { useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function PublishAllProducts({ action, draftCount }) {
  const working = useRef(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(null);

  async function publish() {
    if (working.current || !draftCount) return;
    if (!window.confirm("Publish all eligible drafts and make them visible on the storefront? Drafts with missing or invalid details will be skipped.")) return;

    working.current = true;
    setPending(true);
    setResult(null);
    try {
      setResult(await action());
    } catch {
      setResult({ error: "Could not confirm the publish result. Check the Products list before trying again." });
    } finally {
      working.current = false;
      setPending(false);
    }
  }

  return <>
    <button
      type="button"
      onClick={publish}
      disabled={pending || !draftCount}
      title={!draftCount ? "No draft products" : undefined}
      className="inline-flex h-11 items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-bold text-[#7b2cbf] hover:bg-violet-100 disabled:opacity-50"
    >
      <CheckCircle2 size={17} aria-hidden="true" />{pending ? "Publishing…" : "Publish all products"}
    </button>
    {result && <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-lg">
      <p role={result.error ? "alert" : "status"}>
        {result.error || (
          <>
            Published <strong>{result.published}</strong> products.
            {Boolean(result.skipped) && <> <strong>{result.skipped}</strong> drafts need a SKU, valid prices, or an active catalogue category.</>}
          </>
        )}
      </p>
      <button type="button" aria-label="Dismiss publish result" onClick={() => setResult(null)} className="shrink-0 text-slate-500 hover:text-slate-900">
        <X size={16} />
      </button>
    </div>}
  </>;
}
