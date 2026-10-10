"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { track } from "@/lib/analytics";

export type FrameworkTab = { id: string; label: string; native?: boolean; panel: ReactNode };

export function FrameworkTabs({ tabs }: { tabs: FrameworkTab[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(i: number, focus = false) {
    setActive(i);
    track("framework_tab_select", { framework: tabs[i].id });
    if (focus) refs.current[i]?.focus();
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Agent frameworks" className="flex gap-1 overflow-x-auto border-b border-white/10">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={onKey}
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400 ${
              i === active ? "border-arc-400 text-white" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
            {t.native && <span className="ml-1.5 text-xs text-arc-300">native</span>}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={i !== active} className="pt-4">
          {!t.native && (
            <p className="mb-3 inline-flex rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-300">
              Example adapter — not a shipped package
            </p>
          )}
          {t.panel}
        </div>
      ))}
    </div>
  );
}
