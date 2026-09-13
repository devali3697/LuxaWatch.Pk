import type { Metadata } from "next";
import "./globals.css";
import {StorefrontProvider} from "@/components/storefront/storefront-provider";
import {CatalogProvider} from "@/components/storefront/catalog-provider";

export const metadata: Metadata = {
  title: {default:"Luxe Watch.pk — Premium Watches in Pakistan",template:"%s | Luxe Watch.pk"},
  description: "Discover authentic men's, women's, smart and luxury watches delivered across Pakistan.",
  keywords:["online shopping Pakistan","Cash on Delivery Pakistan","electronics","fashion","beauty","home appliances","custom product order"],
  metadataBase: new URL("https://luxawatch.pk"),
  alternates: { canonical: "/" },
  openGraph: { title: "Luxe Watch.pk — More Than Time, A Lifestyle", description: "Shop authentic premium watches in Pakistan.", type: "website", siteName: "Luxe Watch.pk", images: [{ url: "/luxe-hero.png", width: 1200, height: 630, alt: "Luxe Watch.pk premium watches" }] },
  twitter: { card: "summary_large_image", title: "Luxe Watch.pk", description: "More Than Time, A Lifestyle.", images: ["/luxe-hero.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {const organization={"@context":"https://schema.org","@type":"OnlineStore",name:"Luxe Watch.pk",url:"https://luxawatch.pk",description:"Premium authentic watches delivered across Pakistan.",email:"support@luxawatch.pk",areaServed:"PK",paymentAccepted:"Cash"};return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><StorefrontProvider><CatalogProvider>{children}</CatalogProvider></StorefrontProvider></body></html>; }
