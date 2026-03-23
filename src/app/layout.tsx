import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { siteConfig } from "@/lib/config";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.description}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    siteName: siteConfig.name,
    locale: "ja_JP",
    type: "website",
  },
};

const ga4Id = siteConfig.ga4Id;
const hasGA4 = ga4Id && !ga4Id.startsWith("G-XXXXXXXXXX");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={siteConfig.name}
          href="/feed"
        />
      </head>
      <body
        className={`${notoSansJP.className} flex min-h-screen flex-col pt-14 lg:pt-16`}
      >
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w0ajhfx9kb");
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {hasGA4 && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}', {
                  page_path: window.location.pathname,
                  ${process.env.NODE_ENV === "development" ? "debug_mode: true," : ""}
                  cookie_flags: 'SameSite=Lax;Secure',
                  send_page_view: false
                });
              `}
            </Script>
            <GoogleAnalytics />
          </>
        )}
      </body>
    </html>
  );
}
