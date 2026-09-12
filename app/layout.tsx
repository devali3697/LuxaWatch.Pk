import type { Metadata } from "next";
import "./globals.css";
import {StorefrontProvider} from "@/components/storefront/storefront-provider";
import {CatalogProvider} from "@/components/storefront/catalog-provider";

export const metadata: Metadata = {
  title: {default:"1ClickMela — Online Shopping in Pakistan",template:"%s | 1ClickMela"},
  description: "Discover fashion, beauty, electronics, home essentials and more at 1ClickMela — Pakistan's modern multi-category shopping destination.",
  keywords:["online shopping Pakistan","Cash on Delivery Pakistan","electronics","fashion","beauty","home appliances","custom product order"],
  metadataBase: new URL("https://1clickmela.com"),
  alternates: { canonical: "/" },
  openGraph: { title: "1ClickMela — Everything You Love. One Click Away.", description: "Shop fashion, beauty, electronics, home essentials and more.", type: "website", siteName: "1ClickMela", images: [{ url: "/og.png", width: 1200, height: 630, alt: "1ClickMela — Everything You Love. One Click Away." }] },
  twitter: { card: "summary_large_image", title: "1ClickMela — Shop More, Simply", description: "One place. Many categories. One click.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {const organization={"@context":"https://schema.org","@type":"OnlineStore",name:"1ClickMela",url:"https://1clickmela.com",description:"Pakistan's multi-category online shopping destination.",email:"support@1clickmela.com",areaServed:"PK",paymentAccepted:"Cash"};return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><StorefrontProvider><CatalogProvider>{children}</CatalogProvider></StorefrontProvider></body></html>; }
