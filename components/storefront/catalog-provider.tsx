"use client";

import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {store as fallbackStore,type Category,type Product} from "@/lib/storefront-data";
import {supabase} from "@/lib/supabase";

type CatalogState=typeof fallbackStore;
type DbCategory={id:string;name:string;slug:string;image_url?:string|null;description?:string|null};
type DbProduct={id:string;name:string;slug:string;brand?:string|null;price:number;compare_at?:number|null;description?:string|null;features?:string[]|null;images?:string[]|null;stock?:number|null;rating?:number|null;reviews_count?:number|null;badge?:string|null;sections?:string[]|null;categories?:{slug?:string|null}|null};
type DbBanner={id:string;title:string;subtitle?:string|null;eyebrow?:string|null;cta_label?:string|null;cta_url?:string|null;image_url:string};

const CatalogContext=createContext<{catalog:CatalogState;loading:boolean}>({catalog:fallbackStore,loading:true});

export function CatalogProvider({children}:{children:React.ReactNode}){
 const [catalog,setCatalog]=useState<CatalogState>(fallbackStore),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;(async()=>{
  const [categoryResult,productResult,bannerResult]=await Promise.all([
   supabase.from("categories").select("id,name,slug,image_url,description").eq("is_active",true).order("sort_order"),
   supabase.from("products").select("id,name,slug,brand,price,compare_at,description,features,images,stock,rating,reviews_count,badge,sections,categories(slug)").eq("is_active",true).order("created_at",{ascending:false}),
   supabase.from("banners").select("id,title,subtitle,eyebrow,cta_label,cta_url,image_url").eq("is_active",true).order("sort_order")
  ]);
  if(!active)return;
  const dbCategories=(categoryResult.data||[]) as DbCategory[];
  const dbProducts=(productResult.data||[]) as unknown as DbProduct[];
  const dbBanners=(bannerResult.data||[]) as DbBanner[];
  const categories:Category[]=dbCategories.length?dbCategories.map((c,i)=>({id:c.id,name:c.name,slug:c.slug,image:c.image_url||fallbackStore.categories[i%fallbackStore.categories.length].image,blurb:c.description||`Shop the latest ${c.name.toLowerCase()}`})):fallbackStore.categories;
  const products:Product[]=dbProducts.length?dbProducts.map((p,i)=>{const fallback=fallbackStore.products[i%fallbackStore.products.length];const image=p.images?.[0]||fallback.image;return{id:p.id,name:p.name,slug:p.slug,brand:p.brand||"1ClickMela",category:p.categories?.slug||"accessories",price:Number(p.price),compareAt:p.compare_at?Number(p.compare_at):undefined,description:p.description||"A carefully selected product, available with Cash on Delivery across Pakistan.",features:p.features?.length?p.features:["Quality checked","Cash on Delivery","Nationwide delivery"],image,gallery:p.images?.length?p.images:[image],stock:Number(p.stock??0),rating:Number(p.rating??4.5),reviews:Number(p.reviews_count??0),badge:p.badge||undefined,section:p.sections?.length?p.sections:["new"]}}):fallbackStore.products;
  const heroSlides=dbBanners.length?dbBanners.map(b=>({id:b.id,eyebrow:b.eyebrow||"1CLICKMELA EDIT",title:b.title,text:b.subtitle||"Discover trusted products delivered across Pakistan.",cta:b.cta_label||"Shop now",href:b.cta_url||"/search",image:b.image_url})):fallbackStore.heroSlides;
  const dynamicBrands=Array.from(new Set(products.map(p=>p.brand))).slice(0,8).map(name=>fallbackStore.brands.find(b=>b.name.toLowerCase()===name.toLowerCase())||{name,logo:`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=0b2850&bold=true&format=svg`,tagline:"Available at 1ClickMela"});
  setCatalog({...fallbackStore,categories,products,heroSlides,brands:dynamicBrands});setLoading(false);
 })().catch(()=>setLoading(false));return()=>{active=false}},[]);
 const value=useMemo(()=>({catalog,loading}),[catalog,loading]);return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
export const useCatalog=()=>useContext(CatalogContext);
