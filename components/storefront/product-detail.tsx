"use client";
import {MouseEvent,useMemo,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Check,ChevronRight,Heart,Minus,PackageCheck,Plus,RotateCcw,ShieldCheck,ShoppingBag,Star,Truck,ZoomIn} from "lucide-react";
import {money,Product} from "@/lib/storefront-data";
import {useStorefront} from "./storefront-provider";
import {useCatalog} from "./catalog-provider";
import {Catalog} from "./catalog";

const choices:Record<string,{colors:{name:string;hex:string}[];variants:string[]}>={
 electronics:{colors:[{name:"Awesome Iceblue",hex:"#c9e0eb"},{name:"Midnight Black",hex:"#20242b"},{name:"Lilac",hex:"#d8c9dc"}],variants:["128GB / 8GB","256GB / 8GB","256GB / 12GB"]},
 fashion:{colors:[{name:"Cloud White",hex:"#eeeae2"},{name:"Core Black",hex:"#202124"},{name:"Team Red",hex:"#b7252d"}],variants:["UK 7","UK 8","UK 9","UK 10"]},
 beauty:{colors:[{name:"Original",hex:"#e8d5c2"},{name:"Sensitive",hex:"#dce8e2"}],variants:["30ml","50ml","100ml"]},
 appliances:{colors:[{name:"Black",hex:"#202124"},{name:"Silver",hex:"#bfc2c5"}],variants:["Standard","Family Size"]},
 accessories:{colors:[{name:"Black",hex:"#202124"},{name:"Brown",hex:"#78513b"},{name:"Navy",hex:"#183558"}],variants:["Standard","Premium Gift Box"]},
 kids:{colors:[{name:"Multicolor",hex:"linear-gradient(135deg,#ef4939 0 33%,#ffd43b 33% 66%,#2f80ed 66%)"}],variants:["Standard"]},
 "home-living":{colors:[{name:"Warm White",hex:"#ece7dd"},{name:"Charcoal",hex:"#4d5258"}],variants:["Standard"]},
 "personal-care":{colors:[{name:"Original",hex:"#e4edf3"}],variants:["Standard"]}
};

export function ProductDetail({product}:{product:Product}){
 const opts=choices[product.category]||choices.accessories;
 const [image,setImage]=useState(product.gallery[0]),[qty,setQty]=useState(1),[color,setColor]=useState(opts.colors[0].name),[variant,setVariant]=useState(opts.variants[0]),[zoom,setZoom]=useState(false),[pos,setPos]=useState({x:50,y:50}),[tab,setTab]=useState("description"),[added,setAdded]=useState(false);
 const {addToCart,wishlist,toggleWishlist}=useStorefront();const {catalog}=useCatalog();const router=useRouter();const liked=wishlist.includes(product.id);
 const related=useMemo(()=>catalog.products.filter(p=>p.id!==product.id&&p.category===product.category).slice(0,6),[catalog.products,product]);
 const saving=product.compareAt?product.compareAt-product.price:0;
 const delivery=useMemo(()=>{const d=new Date();d.setDate(d.getDate()+4);return d.toLocaleDateString("en-PK",{weekday:"short",day:"numeric",month:"short"})},[]);
 function move(e:MouseEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect();setPos({x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))})}
 function add(){addToCart(product.id,qty);setAdded(true);setTimeout(()=>setAdded(false),1800)}
 function buy(){addToCart(product.id,qty);router.push("/cart")}
 return <>
 <section className="product-page section">
  <div className="crumb"><Link href="/">Home</Link><ChevronRight/><Link href={`/category/${product.category}`}>{product.category.replace("-"," ")}</Link><ChevronRight/><span>{product.name}</span></div>
  <div className="product-layout">
   <div className="gallery"><div className="thumbs">{product.gallery.map((x,i)=><button aria-label={`View product image ${i+1}`} className={x===image?"active":""} key={x} onMouseEnter={()=>setImage(x)} onClick={()=>setImage(x)}><img src={x} alt={`${product.name} view ${i+1}`}/></button>)}</div>
    <div className={`main-image ${zoom?"zooming":""}`} onMouseEnter={()=>setZoom(true)} onMouseLeave={()=>setZoom(false)} onMouseMove={move}><img src={image} alt={product.name} style={zoom?{transformOrigin:`${pos.x}% ${pos.y}%`}:{}}/>{product.badge&&<span>{product.badge}</span>}<small className="zoom-hint"><ZoomIn/> Hover to zoom</small>{zoom&&<i className="zoom-lens" style={{left:`${pos.x}%`,top:`${pos.y}%`}}/>}</div>
   </div>
   <div className="details"><Link className="brand-link" href={`/search?q=${encodeURIComponent(product.brand)}`}>Visit the {product.brand} store</Link><h1>{product.name}</h1><div className="detail-rating"><b>{product.rating}</b><span className="rating-stars">{[1,2,3,4,5].map(n=><Star key={n} fill={n<=Math.round(product.rating)?"currentColor":"none"}/>)}</span><a href="#reviews">{product.reviews} verified ratings</a></div><div className="detail-rule"/>
    <div className="detail-price"><small>-{product.compareAt?Math.round((1-product.price/product.compareAt)*100):0}%</small>{money(product.price)} {product.compareAt&&<del>M.R.P. {money(product.compareAt)}</del>}</div>{saving>0&&<p className="saving">You save {money(saving)} · Inclusive of all taxes</p>}
    <div className="choice"><p><b>Color:</b> {color}</p><div className="swatches">{opts.colors.map(c=><button aria-label={c.name} title={c.name} className={color===c.name?"active":""} onClick={()=>setColor(c.name)} key={c.name}><i style={{background:c.hex}}/></button>)}</div></div>
    <div className="choice"><p><b>Variant:</b> {variant}</p><div className="variant-list">{opts.variants.map(v=><button className={variant===v?"active":""} onClick={()=>setVariant(v)} key={v}>{v}</button>)}</div></div>
    <div className="short-features"><h2>About this item</h2><ul>{product.features.map(x=><li key={x}>{x}</li>)}</ul></div>
    <div className="purchase-panel"><div className="availability"><span><i/> In stock</span><b>{product.stock} units available</b></div><p className="delivery-date"><Truck/> FREE delivery by <b>{delivery}</b></p><div className="buy-row"><div className="qty"><button aria-label="Decrease quantity" onClick={()=>setQty(Math.max(1,qty-1))}><Minus/></button><b>{qty}</b><button aria-label="Increase quantity" onClick={()=>setQty(Math.min(product.stock,qty+1))}><Plus/></button></div><button className="add-big" onClick={add}><ShoppingBag/> {added?"Added to cart ✓":"Add to cart"}</button><button aria-label="Add to wishlist" className={`heart-big ${liked?"liked":""}`} onClick={()=>toggleWishlist(product.id)}><Heart fill={liked?"currentColor":"none"}/></button></div><button className="buy-now" onClick={buy}>Buy now</button></div>
    <div className="delivery-box"><div><ShieldCheck/><span><b>100% genuine</b><small>Verified product listing</small></span></div><div><Truck/><span><b>Nationwide delivery</b><small>3–6 working days</small></span></div><div><RotateCcw/><span><b>7-day returns</b><small>Easy return support</small></span></div><div><PackageCheck/><span><b>Secure packaging</b><small>Inspected before dispatch</small></span></div></div>
   </div>
  </div>
 </section>
 <section className="product-information section"><nav>{[["description","Product description"],["specs","Specifications"],["reviews",`Reviews (${product.reviews})`]].map(([id,label])=><button className={tab===id?"active":""} onClick={()=>setTab(id)} key={id}>{label}</button>)}</nav>
  {tab==="description"&&<div className="description-panel"><div><span>DESIGNED FOR EVERYDAY</span><h2>{product.name}</h2><p>{product.description} Selected for its balance of quality, practical features and dependable everyday performance.</p><ul>{product.features.map(f=><li key={f}><Check/>{f}</li>)}</ul></div><div className="description-images">{product.gallery.slice(0,2).map((x,i)=><figure key={x}><img src={x} alt={`${product.name} product detail ${i+1}`}/><figcaption>{i===0?"Authentic product presentation":"A closer look at the details"}</figcaption></figure>)}</div></div>}
  {tab==="specs"&&<div className="spec-table"><div><span>Brand</span><b>{product.brand}</b></div><div><span>Model</span><b>{product.slug.toUpperCase()}</b></div><div><span>Selected color</span><b>{color}</b></div><div><span>Selected variant</span><b>{variant}</b></div><div><span>Availability</span><b>In stock</b></div><div><span>Return window</span><b>7 days</b></div>{product.features.map((f,i)=><div key={f}><span>Feature {i+1}</span><b>{f}</b></div>)}</div>}
  {tab==="reviews"&&<div className="reviews-panel" id="reviews"><div><strong>{product.rating}</strong><span className="rating-stars">{[1,2,3,4,5].map(n=><Star key={n} fill={n<=Math.round(product.rating)?"currentColor":"none"}/>)}</span><p>Based on {product.reviews} verified ratings</p></div><div>{[5,4,3,2,1].map((n,i)=><p key={n}><span>{n} star</span><i><b style={{width:`${[78,15,5,1,1][i]}%`}}/></i><small>{[78,15,5,1,1][i]}%</small></p>)}</div></div>}
 </section>
 {related.length>0&&<section className="related-products section"><div className="section-title"><h2>Customers also viewed</h2><Link href={`/category/${product.category}`}>View category <ChevronRight/></Link></div><Catalog products={related}/></section>}
 </>
}
