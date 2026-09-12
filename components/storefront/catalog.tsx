import {Product} from "@/lib/storefront-data";import {ProductCard} from "./product-card";
export function Catalog({products}:{products:Product[]}){return products.length?<div className="catalog">{products.map(p=><ProductCard product={p} key={p.id}/>)}</div>:<div className="empty"><h2>No products found</h2><p>Try another search or browse a different category.</p></div>}
