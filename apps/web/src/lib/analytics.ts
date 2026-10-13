/**
 * Tiny analytics wrapper. No-op unless a Plausible-compatible `window.plausible`
 * (or a `window.dataLayer` array) is present. Never pass PII or visitor wallet addresses.
 */
export type AnalyticsEvent =
  | "judges_view"
  | "judges_cta_try_demo_click"
  | "demo_step_view"
  | "demo_completed"
  | "address_copy"
  | "explorer_link_click"
  | "repo_link_click"
  | "criteria_link_click"
  | "video_play"
  | "developers_view"
  | "developers_cta_deploy_click"
  | "snippet_copy"
  | "framework_tab_select"
  | "api_ref_anchor_click"
  | "cross_link_click"
  | "home_view"
  | "home_cta_click";

export type AnalyticsProps = Record<string, string | number | boolean>;

type PlausibleFn = (event: string, opts?: { props?: AnalyticsProps }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
    dataLayer?: unknown[];
  }
}

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.plausible === "function") {
      window.plausible(event, { props });
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...props });
    }
  } catch {
    /* analytics must never break the page */
  }
}
