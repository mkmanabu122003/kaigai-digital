import { siteConfig } from "@/lib/config";

type Props = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export default function MetaTags({ title, description, path, ogImage }: Props) {
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || `${siteConfig.url}/og-default.png`;

  return (
    <>
      <meta property="og:title" content={`${title} | ${siteConfig.name}`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      <meta property="og:locale" content="ja_JP" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteConfig.name}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
