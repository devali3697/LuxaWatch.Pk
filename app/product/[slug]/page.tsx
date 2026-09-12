"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {PageShell} from "@/components/storefront/site-shell";
import {ProductDetail} from "@/components/storefront/product-detail";
import {useCatalog} from "@/components/storefront/catalog-provider";
export default function Page(){const {slug}=useParams<{slug:string}>(),{catalog,loading}=useCatalog(),product=catalog.products.find(p=>p.slug===slug);if(!product)return <PageShell><section className="page-head section"><span>{loading?"LOADING PRODUCT":"PRODUCT NOT FOUND"}</span><h1>{loading?"Getting the latest details…":"This product is unavailable"}</h1><Link href="/search">Continue shopping</Link></section></PageShell>;const data={"@context":"https://schema.org","@type":"Product",name:product.name,image:product.gallery,description:product.description,brand:{"@type":"Brand",name:product.brand},sku:product.id,offers:{"@type":"Offer",priceCurrency:"PKR",price:product.price,availability:product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock"}};return <PageShell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}}/><ProductDetail product={product}/></PageShell>}
