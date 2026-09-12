"use client";
import {useSearchParams} from "next/navigation";
import {PageShell} from "@/components/storefront/site-shell";
import {Catalog} from "@/components/storefront/catalog";
import {useCatalog} from "@/components/storefront/catalog-provider";
export default function Page(){const params=useSearchParams(),q=params.get("q")||"",needle=q.toLowerCase(),{catalog,loading}=useCatalog();const products=needle==="best"?catalog.products.filter(p=>p.section.includes("best")):needle==="new"?catalog.products.filter(p=>p.section.includes("new")):catalog.products.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(needle));return <PageShell><section className="page-head section"><span>{loading?"UPDATING CATALOGUE":"SEARCH RESULTS"}</span><h1>{q?`Results for “${q}”`:"Explore all products"}</h1><p>{products.length} matching products</p></section><section className="section search-results"><Catalog products={products}/></section></PageShell>}
