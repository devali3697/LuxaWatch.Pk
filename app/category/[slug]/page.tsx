"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {PageShell} from "@/components/storefront/site-shell";
import {Catalog} from "@/components/storefront/catalog";
import {useCatalog} from "@/components/storefront/catalog-provider";
export default function Page(){const {slug}=useParams<{slug:string}>(),{catalog,loading}=useCatalog(),c=catalog.categories.find(x=>x.slug===slug),products=catalog.products.filter(p=>p.category===slug);if(!c)return <PageShell><section className="page-head section"><span>{loading?"LOADING COLLECTION":"COLLECTION NOT FOUND"}</span><h1>{loading?"Updating catalogue…":"This category is unavailable"}</h1><Link href="/search">Browse all products</Link></section></PageShell>;return <PageShell><section className="collection-hero"><img src={c.image} alt={c.name}/><div><span>1CLICKMELA COLLECTION</span><h1>{c.name}</h1><p>{c.blurb}. Curated picks, trusted names and nationwide delivery.</p></div></section><nav className="collection-tabs section" aria-label="Shop categories">{catalog.categories.map(x=><Link className={x.slug===slug?"active":""} href={`/category/${x.slug}`} key={x.id}>{x.name}</Link>)}</nav><section className="section collection"><div className="section-title"><div><span>{products.length} PRODUCTS</span><h2>Shop {c.name}</h2></div></div><Catalog products={products}/></section></PageShell>}
