"use client";
import Link from "next/link";
import {useEffect,useState,type CSSProperties} from "react";
import {ArrowRight,ChevronLeft,ChevronRight,ShieldCheck,ShoppingBag,Truck,Undo2,Zap} from "lucide-react";
import {useCatalog} from "@/components/storefront/catalog-provider";
import {PageShell} from "@/components/storefront/site-shell";
import {Catalog} from "@/components/storefront/catalog";

function Countdown({endsAt}:{endsAt:string}){
 const [left,setLeft]=useState(0);
 useEffect(()=>{const tick=()=>setLeft(Math.max(0,new Date(endsAt).getTime()-Date.now()));tick();const id=setInterval(tick,1000);return()=>clearInterval(id)},[endsAt]);
 const h=Math.floor(left/3600000),m=Math.floor(left/60000)%60,s=Math.floor(left/1000)%60;
 return <div className="countdown"><span>Ends in:</span>{[[h,"Hrs"],[m,"Min"],[s,"Sec"]].map(([v,l])=><b key={l}><strong>{String(v).padStart(2,"0")}</strong><small>{l}</small></b>)}</div>
}

function SectionHeading({title,href,label}:{title:string;href:string;label:string}){return <div className="section-title"><h2>{title}</h2><Link href={href}>{label}<ArrowRight/></Link></div>}

export default function Home(){
 const {catalog:store}=useCatalog();
 const [slide,setSlide]=useState(0);
 useEffect(()=>{const id=setInterval(()=>setSlide(x=>(x+1)%store.heroSlides.length),5500);return()=>clearInterval(id)},[]);
 const best=store.products.filter(p=>p.section.includes("best")).slice(0,6);
 const newest=store.products.filter(p=>p.section.includes("new")).slice(0,6);
 return <PageShell>
  <section className="hero">
   {store.heroSlides.map((x,i)=><article className={i===slide?"active":""} key={x.id}><img src={x.image} alt=""/><div><h1>{i===0?<>Everything You Love.<br/>One Click Away.</>:x.title}</h1><p>{i===0?"Fashion, beauty, tech, home & more — delivered to your doorsteps across Pakistan.":x.text}</p><Link href={x.href}>{i===0?"Shop the Mela":x.cta}<ArrowRight/></Link></div></article>)}
   <button className="hero-prev" onClick={()=>setSlide((slide-1+store.heroSlides.length)%store.heroSlides.length)} aria-label="Previous banner"><ChevronLeft/></button><button className="hero-next" onClick={()=>setSlide((slide+1)%store.heroSlides.length)} aria-label="Next banner"><ChevronRight/></button>
  </section>

  <section className="section category-section">
   <SectionHeading title="Shop by Category" href="/search" label="View All Categories"/>
   <div className="category-grid">{store.categories.map(c=><Link href={`/category/${c.slug}`} key={c.id}><div><img src={c.image} alt={c.name}/><i>Explore <ArrowRight/></i></div><h3>{c.name}</h3></Link>)}</div>
  </section>

  <section className="custom-order-feature section"><div><span>EXCLUSIVE 1CLICKMELA SERVICE</span><h2>Can’t find the product you want?</h2><p>Share the product link, pictures or store location. Our sourcing team will find it and send you a price quote.</p><Link href="/custom-order">Order a Custom Product <ArrowRight/></Link></div><div className="custom-product-stack">{store.products.slice(0,3).map((p,i)=><img style={{"--i":i} as CSSProperties} src={p.image} alt="" key={p.id}/>)}</div></section>

  <section className="section flash" id="flash">
   <div className="deal-heading"><h2>Flash Deals</h2><Countdown endsAt={store.dealEndsAt}/><Link href="/search?q=best">View All Deals <ArrowRight/></Link></div>
   <Catalog products={store.products.filter(p=>p.section.includes("flash")).slice(0,6)}/>
  </section>

  <section className="promo section">
   <Link href="/category/fashion"><img src="/promo-fashion.png" alt="Summer fashion"/><div><h2>Summer Style<br/>Starts Here</h2><p>Fresh looks for every occasion.</p><b>Explore Fashion <ArrowRight/></b></div></Link>
   <Link href="/category/beauty"><img src="/promo-beauty.png" alt="Beauty products"/><div><h2>Glow Up<br/>Every Day</h2><p>Premium beauty & personal care picks.</p><b>Shop Beauty <ArrowRight/></b></div></Link>
  </section>

  <section className="section product-shelf"><SectionHeading title="Best Sellers" href="/search?q=best" label="View All Best Sellers"/><Catalog products={best}/></section>

  <section className="brands section" id="brands"><SectionHeading title="Shop by Brand" href="/brands" label="View All Brands"/><div>{store.brands.map(b=><Link href={`/search?q=${encodeURIComponent(b.name)}`} key={b.name}><img src={b.logo} alt={`${b.name} logo`} loading="lazy"/><span>{b.tagline}</span></Link>)}</div></section>

  <section className="section product-shelf"><SectionHeading title="New Arrivals" href="/search?q=new" label="View All New Arrivals"/><Catalog products={newest}/></section>

  <section className="trust section"><div><ShieldCheck/><span><b>100% Genuine Products</b><small>Sourced from trusted brands</small></span></div><div><ShoppingBag/><span><b>Cash on Delivery</b><small>Pay when you receive</small></span></div><div><Truck/><span><b>Fast Delivery</b><small>Across Pakistan</small></span></div><div><Undo2/><span><b>Easy Returns</b><small>7-day return policy</small></span></div></section>

  <section className="guides section"><SectionHeading title="Buying Guides" href="/search" label="View All Guides"/><div className="guide-grid">
   <Link href="/category/beauty"><img src="/promo-beauty.png" alt="Skincare guide"/><span><b>How to Choose the<br/>Perfect Skincare Routine</b><small>Read Guide <ArrowRight/></small></span></Link>
   <Link href="/category/home-living"><img src="/hero-home-tech.png" alt="Smart home guide"/><span><b>Smart Home Essentials<br/>for Every Room</b><small>Read Guide <ArrowRight/></small></span></Link>
   <Link href="/category/fashion"><img src="/promo-fashion.png" alt="Summer fashion guide"/><span><b>Summer Fashion<br/>Must-Haves for Men</b><small>Read Guide <ArrowRight/></small></span></Link>
   <Link href="/category/electronics"><img src={store.products[1].image} alt="Fitness gear guide"/><span><b>Fitness Gear<br/>That Actually Works</b><small>Read Guide <ArrowRight/></small></span></Link>
  </div></section>
 </PageShell>
}
