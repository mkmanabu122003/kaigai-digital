"use client";

import { siteConfig } from "./config";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_ID = siteConfig.ga4Id;

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

export function event(
  action: string,
  params: Record<string, string | number>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

export function trackAffiliateClick(
  serviceName: string,
  articleSlug: string,
  placement: string,
  variant?: string
) {
  event("affiliate_click", {
    service_name: serviceName,
    article_slug: articleSlug,
    placement,
    ...(variant && { variant }),
  });
}
