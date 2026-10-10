"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  event?: { name: AnalyticsEvent; props?: AnalyticsProps };
  external?: boolean;
  ariaLabel?: string;
};

/** Link that fires one analytics event on click. External links open in a new tab. */
export function TrackedLink({ href, children, className, event, external, ariaLabel }: Props) {
  const onClick = () => event && track(event.name, event.props);
  const isExternal = external ?? /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
