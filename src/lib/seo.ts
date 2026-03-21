import type { Metadata } from "next";
import { siteConfig } from "./config";

type SeoParams = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
};

export function generateSeoMetadata({
  title,
  description,
  path,
  ogImage,
  noindex = false,
  canonical,
}: SeoParams): Metadata {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || `${siteConfig.url}/og-default.png`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: canonical || url,
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [image],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
