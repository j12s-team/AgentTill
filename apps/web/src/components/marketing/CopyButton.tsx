"use client";

import { useState } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

type Props = {
  value: string;
  label: string;
  event?: { name: AnalyticsEvent; props?: AnalyticsProps };
  className?: string;
};

export function CopyButton({ value, label, event, className = "" }: Props) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied");
      if (event) track(event.name, event.props);
    } catch {
      setStatus("Copy failed");
    }
    window.setTimeout(() => setStatus(""), 1800);
  }

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        title={label}
        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-white/10 px-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400 ${className}`}
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="5" width="9" height="9" rx="1.5" />
          <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
        </svg>
        {status && <span className="ml-1 text-emerald-400">{status}</span>}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </span>
  );
}
