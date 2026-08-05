"use client";

import { siteConfig } from "./config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_ID = siteConfig.ga4Id;

// ─── Core ───

// gtag.js は afterInteractive で読み込まれるため、React の useEffect が
// 先に走ると window.gtag がまだ未定義になる。その場合は dataLayer へ直接
// 積んでおき、gtag.js のロード後にまとめて処理させる。
function push(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

// GA4 では同一測定IDへの2回目以降の gtag('config') は page_view を送出しない。
// SPA遷移を計測するため、page_view は明示的な event として送る。
export function pageview(url: string) {
  if (typeof window === "undefined") return;
  push("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function event(
  action: string,
  params: Record<string, string | number | boolean>
) {
  push("event", action, params);
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
  push("set", "user_properties", props);
}

export function setContentGroup(group: string) {
  push("set", { content_group: group });
}
