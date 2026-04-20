"use client";

import { useEffect, useRef } from "react";
import { getServiceById } from "@/lib/affiliates";
import { trackAffiliateClick, trackCtaView } from "@/lib/ga";

type Props = {
  serviceId: string;
  text?: string;
  placement: "top" | "middle" | "bottom";
  variant?: "a" | "b";
  articleSlug: string;
};

export default function AffiliateButton({
  serviceId,
  text,
  placement,
  variant,
  articleSlug,
}: Props) {
  const service = getServiceById(serviceId);
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    if (!service || !ref.current || tracked.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackCtaView(service.name, articleSlug, placement);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [service, articleSlug, placement]);

  if (!service) return null;

  const buttonText = text || service.ctaText?.[placement] || `${service.name}を見る`;

  const handleClick = () => {
    trackAffiliateClick(service.name, articleSlug, placement, variant);
  };

  return (
    <div ref={ref} className="my-6 flex justify-center">
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={handleClick}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-8 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-accent-400 hover:shadow-lg active:translate-y-0 active:bg-accent-600 active:shadow-sm lg:h-[52px] lg:w-auto lg:min-w-[280px] lg:text-lg"
      >
        {buttonText}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </a>
    </div>
  );
}
