"use client";

import Link from "next/link";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = {
  label: string;
  target?: string; // element id, without '#'
  /** Navigate to a route instead of scrolling to #target. */
  href?: string;
  event: AnalyticsEvent;
  startDemo?: boolean;
};

export const START_DEMO_EVENT = "agenttill:start-demo";

/** The only filled (arc-600) button on a page. Scrolls to `#target`. */
const CLS =
  "inline-flex items-center justify-center rounded-lg bg-arc-600 px-4 py-3 text-sm font-medium text-white hover:bg-arc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arc-400";

export function PrimaryCTA({ label, target = "", href, event, startDemo }: Props) {
  if (href) {
    return (
      <Link href={href} onClick={() => track(event)} className={CLS}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={`#${target}`}
      onClick={(e) => {
        e.preventDefault();
        track(event);
        const el = document.getElementById(target);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", `#${target}`);
        if (startDemo) window.dispatchEvent(new CustomEvent(START_DEMO_EVENT));
        window.setTimeout(() => el?.focus({ preventScroll: true }), 300);
      }}
      className={CLS}
    >
      {label}
    </a>
  );
}
