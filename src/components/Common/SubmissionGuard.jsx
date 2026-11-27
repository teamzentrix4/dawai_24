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
      if (!(button instanceof HTMLButtonElement) || button.dataset.submitting === "true") return;
      const form = event.target instanceof HTMLFormElement ? event.target : null;

      button.dataset.submitting = "true";
      button.dataset.originalLabel = button.innerHTML;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.classList.add("cursor-wait", "opacity-70");
      button.textContent = pendingLabel(button);
      form?.querySelectorAll('button[type="submit"], button:not([type])').forEach((control) => {
        if (control !== button) control.disabled = true;
      });

      // A navigation normally follows a successful submission. Restore the
      // control when a validation/server error keeps the user on this page.
      window.setTimeout(() => {
        if (button.dataset.submitting !== "true") return;
        button.disabled = false;
        button.removeAttribute("aria-busy");
        button.classList.remove("cursor-wait", "opacity-70");
        button.innerHTML = button.dataset.originalLabel || "Try again";
        delete button.dataset.submitting;
        delete button.dataset.originalLabel;
        form?.querySelectorAll('button[type="submit"], button:not([type])').forEach((control) => {
          if (control !== button) control.disabled = false;
        });
      }, 15000);
    };

    document.addEventListener("submit", guard, true);
    return () => document.removeEventListener("submit", guard, true);
  }, []);

  return null;
}
