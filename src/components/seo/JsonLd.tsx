import { siteConfig } from "@/lib/config";
import type { BreadcrumbItem } from "@/components/layout/Breadcrumb";
import { defaultAuthor } from "@/lib/authors";

type ArticleJsonLdProps = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  url: string;
  image?: string;
};

export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  updatedAt,
  author,
  url,
  image,
}: ArticleJsonLdProps) {
  // Use the structured author from authors.ts as Person reference
  const authorObj = {
    "@type": "Person",
    "@id": `${siteConfig.url}${defaultAuthor.url}#person`,
    name: defaultAuthor.displayName,
    url: `${siteConfig.url}${defaultAuthor.url}`,
    jobTitle: defaultAuthor.jobTitle,
  };

  // Suppress unused warning for legacy author param
  void author;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: authorObj,
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type FaqJsonLdProps = {
  faqs: { question: string; answer: string }[];
};

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type BreadcrumbJsonLdProps = {
  items: BreadcrumbItem[];
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const allItems = [{ label: "ホーム", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href && { item: `${siteConfig.url}${item.href}` }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type ProductJsonLdProps = {
  name: string;
  description: string;
  rating: number;
  ratingCount: number;
  price: string;
  priceCurrency: string;
  url: string;
};

export function ProductJsonLd({
  name,
  description,
  rating,
  ratingCount,
  price,
  priceCurrency,
  url,
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rating,
        bestRating: 5,
      },
      author: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      bestRating: 5,
      ratingCount,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.nameJa,
    url: siteConfig.url,
    description: siteConfig.description,
    foundingDate: "2026-03-22",
    knowsAbout: [
      "海外VPN",
      "海外eSIM",
      "海外送金",
      "海外赴任のITインフラ",
      "海外旅行のネット環境",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
