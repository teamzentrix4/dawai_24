"use client";

import { useEffect } from "react";

function pendingLabel(button) {
  const text = (button.dataset.pendingLabel || button.textContent || "").trim().toLowerCase();
  if (text.includes("login") || text.includes("sign in")) return "Logging in...";
  if (text.includes("sign out") || text.includes("log out")) return "Logging out...";
  if (text.includes("create account") || text.includes("register")) return "Creating account...";
  if (text.includes("delete") || text.includes("remove")) return "Deleting...";
  if (text.includes("publish")) return "Publishing...";
  if (text.includes("update")) return "Updating...";
  if (text.includes("search")) return "Searching...";
  if (text.includes("order") || text.includes("checkout") || text.includes("pay")) return "Processing...";
  return "Saving...";
}

// One lightweight document-level listener protects every regular form on the
// storefront and admin panel from double submissions.
export default function SubmissionGuard() {
  useEffect(() => {
    const guard = (event) => {
      const button = event.submitter;
      if (!(button instanceof HTMLButtonElement)) return;
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || form.dataset.submitting === "true") { event.preventDefault(); return; }
      // Do not mutate button children here. React owns this DOM and changing
      // textContent/innerHTML during a render can cause removeChild crashes.
      form.dataset.submitting = "true";
      window.setTimeout(() => {
        delete form.dataset.submitting;
      }, 15000);
    };

    document.addEventListener("submit", guard, true);
    return () => document.removeEventListener("submit", guard, true);
  }, []);

  return null;
}
