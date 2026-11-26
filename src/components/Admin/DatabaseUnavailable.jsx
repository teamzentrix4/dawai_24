"use client";

export default function DatabaseUnavailable() {
  return <main className="mx-auto mt-12 max-w-lg px-4 sm:mt-20">
    <section role="alert" className="rounded-2xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-extrabold text-slate-900">Database temporarily unavailable</h1>
      <p className="mt-2 text-sm text-slate-600">We couldn’t verify your admin session right now. Try again in a moment.</p>
      <button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-[#7b2cbf] px-5 py-3 text-sm font-bold text-white hover:bg-[#6922a8]">
        Retry
      </button>
    </section>
  </main>;
}
