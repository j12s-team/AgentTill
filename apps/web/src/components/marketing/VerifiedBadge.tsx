export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
      Verified on Arc
    </span>
  );
}
