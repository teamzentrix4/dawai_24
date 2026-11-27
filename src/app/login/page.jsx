
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/Forms/AuthShell";
import { customerLogin } from "@/app/auth-actions";
import { LockKeyhole, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function Login({ searchParams }) {
  const [showPassword, setShowPassword] = useState(false);
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { const params = new URLSearchParams(window.location.search); setNext(params.get("next") || ""); setError(params.get("error") || ""); }, []);

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Customers and administrators can securely login from this page."
    >
      <form action={customerLogin} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

        {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">{error}</div>}

        <div className="rounded-xl bg-slate-50 px-3 py-2 text-center text-[11px] text-slate-500">
          <ShieldCheck size={13} className="mr-1 inline text-emerald-600" />
          One secure login for customers and administrators
        </div>

        <Field label="Email address">
          <input
            name="login"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="name@example.com"
          />
        </Field>

        {/* Password with Show/Hide Icon */}
        <Field label="Password">
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              className="input !pr-11"
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696974] transition hover:text-[#FF6B5A]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </Field>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#FF6B5A] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button className="btn btn-primary w-full py-3 text-[14px] font-bold">
          <LockKeyhole size={17} />
          Login securely
        </button>

        <p className="pt-2 text-center text-[13px] text-[#696974]">
          New customer?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#FF6B5A] hover:underline"
          >
            Create account
          </Link>
        </p>

      </form>
    </AuthShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-[12px] font-bold text-[#171725]">
      {label}
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
