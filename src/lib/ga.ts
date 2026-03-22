"use client";

import { siteConfig } from "./config";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_ID = siteConfig.ga4Id;

// ─── Core ───

export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

export function event(
  action: string,
  params: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

// ─── Affiliate / CTA ───

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

export function trackCtaView(
  serviceName: string,
  articleSlug: string,
  placement: string
) {
  event("cta_view", {
    service_name: serviceName,
    article_slug: articleSlug,
    placement,
  });
}

// ─── Internal / External Links ───

export function trackInternalLinkClick(
  fromSlug: string,
  toPath: string,
  anchorText: string
) {
  event("internal_link_click", {
    from_slug: fromSlug,
    to_path: toPath,
    anchor_text: anchorText,
  });
}

export function trackExternalLinkClick(url: string, anchorText: string) {
  event("external_link_click", {
    link_url: url,
    link_text: anchorText,
  });
}

// ─── Content Engagement (CMO) ───

export function trackScrollDepth(depth: number, articleSlug: string) {
  event("scroll_depth", {
    depth_percentage: depth,
    article_slug: articleSlug,
  });
}

export function trackArticleRead(articleSlug: string, readTimeSeconds: number) {
  event("article_read_complete", {
    article_slug: articleSlug,
    read_time_seconds: readTimeSeconds,
  });
}

export function trackSiteSearch(query: string, resultsCount: number) {
  event("site_search", {
    search_term: query,
    results_count: resultsCount,
  });
}

// ─── Performance (CTO) ───

export function trackWebVitals(
  metric: string,
  value: number,
  rating: string
) {
  event("web_vitals", {
    metric_name: metric,
    metric_value: Math.round(metric === "CLS" ? value * 1000 : value),
    metric_rating: rating,
  });
}

export function trackError(errorType: string, message: string, page: string) {
  event("site_error", {
    error_type: errorType,
    error_message: message.slice(0, 100),
    page_path: page,
  });
}

// ─── User Properties & Content Groups ───

export function setUserProperties(props: Record<string, string>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("set", "user_properties", props);
}

export function setContentGroup(group: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("set", { content_group: group });
}
