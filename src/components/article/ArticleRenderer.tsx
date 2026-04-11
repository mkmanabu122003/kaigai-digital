"use client";

import ServiceAvailabilityTable from "./ServiceAvailabilityTable";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import KabenekoHero from "@/components/affiliate/KabenekoHero";

type ServiceEntry = {
  category: string;
  services: string;
  status: "available" | "limited" | "blocked";
  statusLabel: string;
};

type TableProps = {
  countryName: string;
  entries: ServiceEntry[];
  vpnCompareLink?: string;
};

type CtaProps = {
  service: string;
  placement: "top" | "middle" | "bottom";
  text?: string;
};

type Segment =
  | { type: "html"; content: string }
  | { type: "serviceTable"; props: TableProps }
  | { type: "cta"; props: CtaProps }
  | { type: "kabenekoHero" };

const SAT_REGEX = /<!--\s*SAT:([\s\S]*?)\s*-->/g;
const CTA_REGEX = /<CTA\s+([^>]*?)\/?\s*>/gi;
const KABENEKO_HERO_REGEX = /<KabenekoHero\s*\/?\s*>/gi;

function parseCtaAttributes(attrString: string): CtaProps | null {
  const serviceMatch = attrString.match(/service="([^"]+)"/);
  const placementMatch = attrString.match(/placement="([^"]+)"/);
  const textMatch = attrString.match(/text="([^"]+)"/);

  if (!serviceMatch || !placementMatch) return null;

  const placement = placementMatch[1];
  if (placement !== "top" && placement !== "middle" && placement !== "bottom")
    return null;

  return {
    service: serviceMatch[1],
    placement,
    text: textMatch?.[1],
  };
}

/**
 * Parse HTML content string, extract <!-- SAT:{...} --> and <CTA ... /> markers,
 * and return an array of segments for rendering.
 */
export function parseArticleContent(html: string): Segment[] {
  const COMBINED_REGEX = new RegExp(
    `(${SAT_REGEX.source})|(${CTA_REGEX.source})|(${KABENEKO_HERO_REGEX.source})`,
    "gi"
  );

  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = COMBINED_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        content: html.slice(lastIndex, match.index),
      });
    }

    if (match[1]) {
      // SAT marker
      const jsonStr = match[0].replace(/<!--\s*SAT:/, "").replace(/\s*-->/, "");
      try {
        const props: TableProps = JSON.parse(jsonStr);
        segments.push({ type: "serviceTable", props });
      } catch {
        segments.push({ type: "html", content: match[0] });
      }
    } else if (/<KabenekoHero/i.test(match[0])) {
      // KabenekoHero tag
      segments.push({ type: "kabenekoHero" });
    } else {
      // CTA tag
      const attrString = match[0]
        .replace(/<CTA\s+/i, "")
        .replace(/\/?\s*>$/, "");
      const ctaProps = parseCtaAttributes(attrString);
      if (ctaProps) {
        segments.push({ type: "cta", props: ctaProps });
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: "html", content: html.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ type: "html", content: html });
  }

  return segments;
}

function getAbVariant(): "a" | "b" {
  if (typeof window === "undefined") return "a";
  const stored = sessionStorage.getItem("cta_variant");
  if (stored === "a" || stored === "b") return stored;
  const variant = Math.random() < 0.5 ? "a" : "b";
  sessionStorage.setItem("cta_variant", variant);
  return variant;
}

type Props = {
  html: string;
  articleSlug: string;
};

export default function ArticleRenderer({ html, articleSlug }: Props) {
  const segments = parseArticleContent(html);
  const variant = getAbVariant();

  return (
    <>
      {segments.map((segment, i) => {
        if (segment.type === "html") {
          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          );
        }
        if (segment.type === "cta") {
          return (
            <AffiliateButton
              key={i}
              serviceId={segment.props.service}
              placement={segment.props.placement}
              text={segment.props.text}
              variant={variant}
              articleSlug={articleSlug}
            />
          );
        }
        if (segment.type === "kabenekoHero") {
          return <KabenekoHero key={i} />;
        }
        return (
          <ServiceAvailabilityTable
            key={i}
            countryName={segment.props.countryName}
            entries={segment.props.entries}
            vpnCompareLink={segment.props.vpnCompareLink}
          />
        );
      })}
    </>
  );
}
