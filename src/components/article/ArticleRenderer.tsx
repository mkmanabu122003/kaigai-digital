"use client";

import ServiceAvailabilityTable from "./ServiceAvailabilityTable";

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

type Segment =
  | { type: "html"; content: string }
  | { type: "serviceTable"; props: TableProps };

/**
 * Parse HTML content string, extract <!-- SAT:{...} --> comment markers,
 * and return an array of segments for rendering.
 */
export function parseArticleContent(html: string): Segment[] {
  const MARKER_REGEX = /<!--\s*SAT:([\s\S]*?)\s*-->/g;

  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MARKER_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "html", content: html.slice(lastIndex, match.index) });
    }

    try {
      const props: TableProps = JSON.parse(match[1]);
      segments.push({ type: "serviceTable", props });
    } catch {
      // If JSON parse fails, keep as HTML
      segments.push({ type: "html", content: match[0] });
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

type Props = {
  html: string;
};

export default function ArticleRenderer({ html }: Props) {
  const segments = parseArticleContent(html);

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
