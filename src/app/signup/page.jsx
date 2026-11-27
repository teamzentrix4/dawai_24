
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/Forms/AuthShell";
import { customerSignup } from "@/app/auth-actions";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function Signup({ searchParams }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [next, setNext] = useState("");
  useEffect(() => setNext(new URLSearchParams(window.location.search).get("next") || ""), []);

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Register once to manage orders, prescriptions, addresses and wishlist."
    >
      <form action={customerSignup} className="space-y-4">
        {next && <input type="hidden" name="next" value={next} />}

        <Field label="Full name">
          <input
            name="name"
            required
            autoComplete="name"
            className="input"
            placeholder="Your full name"
          />
        </Field>

        <Field label="Email address">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input"
            placeholder="name@example.com"
          />
        </Field>

        <Field label="Mobile number">
          <div className="flex">
            <span className="inline-flex items-center rounded-l-xl border border-r-0 bg-[#F8F9FA] px-3 text-sm font-semibold">
              +91
            </span>
            <input
              name="phone"
              inputMode="numeric"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              required
              autoComplete="tel"
              className="input !rounded-l-none"
              placeholder="10-digit mobile"
            />
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Password */}
          <Field label="Password">
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                minLength={8}
                required
                autoComplete="new-password"
                className="input !pr-11"
                placeholder="Minimum 8 characters"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696974] hover:text-[#FF6B5A]"
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

          {/* Confirm Password */}
          <Field label="Confirm password">
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                minLength={8}
                required
                autoComplete="new-password"
                className="input !pr-11"
                placeholder="Repeat password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696974] hover:text-[#FF6B5A]"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </Field>

        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[12px] text-[#696974]">
          <input
            type="checkbox"
            name="agree"
            required
            className="mt-0.5 size-4 accent-[#FF6B5A]"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/policies/terms-and-conditions"
              className="font-bold text-[#FF6B5A] underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/policies/privacy-policy"
              className="font-bold text-[#FF6B5A] underline"
            >
              Privacy Policy
            </Link>.
          </span>
        </label>

        <button className="btn btn-primary w-full py-3 text-[14px] font-bold">
          <UserPlus size={17} />
          Create account
        </button>

        <p className="pt-2 text-center text-[13px] text-[#696974]">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-bold text-[#FF6B5A] hover:underline"
          >
            Login here
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
