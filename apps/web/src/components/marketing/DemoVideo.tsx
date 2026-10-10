"use client";

import { track } from "@/lib/analytics";

export function DemoVideo({ src }: { src: string | null }) {
  const poster = "/brand/hero-flow.webp";
  if (!src) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="" aria-hidden="true" loading="lazy" className="h-full w-full object-cover opacity-60" />
        <p className="absolute inset-0 flex items-center justify-center bg-ink-950/50 text-lg font-medium text-white">Video coming soon</p>
      </div>
    );
  }
  return (
    <video
      className="aspect-video w-full rounded-2xl border border-white/10 bg-ink-900"
      controls
      muted
      playsInline
      preload="none"
      poster={poster}
      onPlay={() => track("video_play")}
    >
      <source src={src} />
      <track kind="captions" src={src.replace(/\.[a-z0-9]+(\?.*)?$/i, ".vtt")} srcLang="en" label="English" default />
    </video>
  );
}
