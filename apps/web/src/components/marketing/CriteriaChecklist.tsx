import { TrackedLink } from "./TrackedLink";

export type Criterion = {
  id: string;
  requirement: string;
  evidence: string;
  status: "done" | "pending";
  link?: { href: string; label: string };
};

export function CriteriaChecklist({ items }: { items: Criterion[] }) {
  return (
    <ul className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      {items.map((c) => (
        <li key={c.id} className="grid gap-2 px-4 py-4 sm:grid-cols-[1.2fr_1.5fr_auto] sm:items-center sm:gap-4">
          <span className="flex items-start gap-2 font-medium text-white">
            {c.status === "done" ? (
              <span className="mt-0.5 text-emerald-400" aria-hidden="true">✓</span>
            ) : (
              <span className="mt-0.5 text-amber-500" aria-hidden="true">◷</span>
            )}
            <span>
              {c.requirement}
              <span className="sr-only">{c.status === "done" ? " — met" : " — pending"}</span>
              {c.status === "pending" && <span className="ml-2 text-xs font-normal text-amber-300">Pending</span>}
            </span>
          </span>
          <span className="text-sm text-slate-400">{c.evidence}</span>
          {c.link ? (
            <TrackedLink
              href={c.link.href}
              className="text-sm text-arc-300 underline-offset-2 hover:underline"
              event={{ name: "criteria_link_click", props: { criterion: c.id } }}
            >
              {c.link.label}
            </TrackedLink>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </li>
      ))}
    </ul>
  );
}
