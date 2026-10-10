"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

let fired = new Set<string>();

export function PageView({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    if (fired.has(event)) return;
    fired = new Set(fired).add(event);
    track(event);
  }, [event]);
  return null;
}
