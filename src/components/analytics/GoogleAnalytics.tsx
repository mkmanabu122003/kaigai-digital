"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense, useCallback } from "react";
import {
  pageview,
  trackScrollDepth,
  trackArticleRead,
  trackExternalLinkClick,
  trackWebVitals,
  trackError,
  setUserProperties,
  setContentGroup,
} from "@/lib/ga";

// ─── SPA Pageview Tracker ───

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    pageview(url);

    // Set content group based on URL path
    if (pathname.startsWith("/compare/")) {
      setContentGroup("比較LP");
    } else if (pathname.startsWith("/guide/")) {
      setContentGroup("ガイド");
    } else if (pathname.match(/^\/(china|thailand|uae|vietnam|korea|taiwan)\//)) {
      setContentGroup("国別記事");
    } else {
      setContentGroup("その他");
    }
  }, [pathname, searchParams]);

  return null;
}

// ─── Scroll Depth Tracker (CMO) ───

function ScrollDepthTracker() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedRef.current = new Set();

    const slug = pathname?.replace(/^\//, "") || "";
    // Only track on article pages
    if (!slug || slug === "search" || slug === "privacy-policy" || slug === "disclaimer") return;

    const thresholds = [25, 50, 75, 100];

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      for (const threshold of thresholds) {
        if (scrollPercent >= threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          trackScrollDepth(threshold, slug);
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}

// ─── Article Read Complete Tracker (CMO) ───

function ArticleReadTracker() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(0);
  const firedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    firedRef.current = false;

    const slug = pathname?.replace(/^\//, "") || "";
    if (!slug || slug === "search" || slug === "privacy-policy" || slug === "disclaimer") return;

    function handleScroll() {
      if (firedRef.current) return;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

      // "Read complete" = scrolled past 90% AND spent at least 30 seconds
      if (scrollPercent >= 90 && timeOnPage >= 30) {
        firedRef.current = true;
        trackArticleRead(slug, timeOnPage);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}

// ─── External Link Click Tracker (CMO) ───

function ExternalLinkTracker() {
  const handleClick = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest("a");
    if (!target) return;
    const href = target.getAttribute("href");
    if (!href) return;

    // Skip internal links, anchors, and javascript:
    if (href.startsWith("/") || href.startsWith("#") || href.startsWith("javascript:")) return;

    // Skip affiliate links (tracked separately by AffiliateButton)
    if (target.closest("[data-affiliate]")) return;

    try {
      const url = new URL(href);
      if (url.hostname === window.location.hostname) return;
      trackExternalLinkClick(href, target.textContent?.trim().slice(0, 50) || "");
    } catch {
      // Invalid URL, ignore
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  return null;
}

// ─── Core Web Vitals Tracker (CTO) ───

function WebVitalsTracker() {
  useEffect(() => {
    async function reportWebVitals() {
      try {
        const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import("web-vitals");

        const sendMetric = (metric: { name: string; value: number; rating: string }) => {
          trackWebVitals(metric.name, metric.value, metric.rating);
        };

        onCLS(sendMetric);
        onINP(sendMetric);
        onLCP(sendMetric);
        onFCP(sendMetric);
        onTTFB(sendMetric);
      } catch {
        // web-vitals not available, skip silently
      }
    }
    reportWebVitals();
  }, []);

  return null;
}

// ─── Error Tracker (CTO) ───

function ErrorTracker() {
  useEffect(() => {
    function handleError(e: ErrorEvent) {
      trackError("js_error", e.message, window.location.pathname);
    }

    function handleUnhandledRejection(e: PromiseRejectionEvent) {
      const message = e.reason?.message || String(e.reason);
      trackError("unhandled_rejection", message, window.location.pathname);
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

// ─── User Properties (CMO) ───

function UserPropertySetter() {
  useEffect(() => {
    const isReturning = localStorage.getItem("kd_visited") === "1";
    const firstVisit = localStorage.getItem("kd_first_visit");
    const now = new Date().toISOString().split("T")[0];

    if (!firstVisit) {
      localStorage.setItem("kd_first_visit", now);
      localStorage.setItem("kd_visited", "1");
    }

    setUserProperties({
      user_type: isReturning ? "returning" : "new",
      first_visit_date: firstVisit || now,
    });
  }, []);

  return null;
}

// ─── Main Component ───

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <PageviewTracker />
      <ScrollDepthTracker />
      <ArticleReadTracker />
      <ExternalLinkTracker />
      <WebVitalsTracker />
      <ErrorTracker />
      <UserPropertySetter />
    </Suspense>
  );
}
