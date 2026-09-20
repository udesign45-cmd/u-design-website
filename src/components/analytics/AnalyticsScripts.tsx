"use client";

import Script from "next/script";

type Props = { gaId?: string; metaPixelId?: string };

/**
 * Third-party analytics, loaded after the page is interactive and only when an
 * ID is configured (plan AD-09). If consent is required (Q-5), scripts wait for
 * `window.udesignConsent === "granted"`; the consent banner UI is follow-up work.
 */
export function AnalyticsScripts({ gaId, metaPixelId }: Props) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_CONSENT === "required") {
    if (typeof window === "undefined" || window.udesignConsent !== "granted") return null;
  }
  return (
    <>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
      {metaPixelId ? (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
    </>
  );
}
