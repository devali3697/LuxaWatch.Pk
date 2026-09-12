"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Tags,
  TicketPercent,
  Truck,
  Users,
  X,
} from "lucide-react";
import { money, store } from "@/lib/storefront-data";
import { supabase } from "@/lib/supabase";
import { BrandsManager, SmartImportModal } from "./catalog-tools";
import {
  BannersManager,
  CategoriesManager,
  CouponsManager,
  CustomersManager,
  OrdersManager,
  ProductsManager,
  RequestsManager,
  SettingsManager,
  SupportManager,
} from "./dynamic-sections";
type View =
  | "dashboard"
  | "products"
  | "brands"
  | "categories"
  | "orders"
  | "custom"
  | "support"
  | "coupons"
  | "banners"
  | "customers"
  | "settings";
type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
};
type Coupon = {
  code: string;
  type: string;
  value: string;
  uses: number;
  active: boolean;
};
type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  active: boolean;
};
const seedOrders: Order[] = [
  {
    id: "DEMO-0001",
    customer: "Customer 001",
    items: 2,
    total: 24798,
    status: "Processing",
    date: "Today, 10:42 AM",
  },
  {
    id: "DEMO-0002",
    customer: "Customer 002",
    items: 1,
    total: 119999,
    status: "Confirmed",
    date: "Today, 9:18 AM",
  },
  {
    id: "DEMO-0003",
    customer: "Customer 003",
    items: 3,
    total: 10897,
    status: "Shipped",
    date: "Yesterday",
  },
  {
    id: "DEMO-0004",
    customer: "Customer 004",
    items: 1,
    total: 45999,
    status: "Delivered",
    date: "2 Sep 2026",
  },
  {
    id: "DEMO-0005",
    customer: "Customer 005",
    items: 2,
    total: 9998,
    status: "Cancelled",
    date: "1 Sep 2026",
  },
];
const seedCoupons: Coupon[] = [
  {
    code: "MELA10",
    type: "Percentage",
    value: "10% · Max Rs. 2,000",
    uses: 46,
    active: true,
  },
  {
    code: "WELCOME500",
    type: "Fixed",
    value: "Rs. 500 · Min Rs. 5,000",
    uses: 18,
    active: true,
  },
  {
    code: "FREESHIP",
    type: "Delivery",
    value: "Free delivery",
    uses: 31,
    active: true,
  },
];
const nav: { id: View; label: string; icon: any; badge?: number }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "brands", label: "Brands", icon: Tags },
  { id: "categories", label: "Categories", icon: Store },
  { id: "orders", label: "Orders", icon: ShoppingBag, badge: 8 },
  { id: "custom", label: "Custom Requests", icon: ClipboardList, badge: 3 },
  { id: "support", label: "Customer Support", icon: MessageSquareText },
  { id: "coupons", label: "Coupons", icon: TicketPercent },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "customers", label: "Customers", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];
export default function AdminPage({
  adminName,
  signOutPath,
  supabaseMode,
}: {
  adminName: string;
  signOutPath: string;
  supabaseMode?: boolean;
}) {
  useEffect(() => {
    if (!supabaseMode) return;
    (async () => {
      const [{ data: p }, { data: o }, { data: c }] = await Promise.all([
        supabase.from("products").select("*"),
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("coupons").select("*"),
      ]);
      if (p?.length)
        setProducts(
          p.map((x: any) => ({
            id: x.id,
            name: x.name,
            brand: x.brand,
            category: x.category_id || "Uncategorised",
            price: Number(x.price),
            stock: x.stock,
            image: x.images?.[0] || store.products[0].image,
            active: x.is_active,
          })),
        );
      if (o?.length)
        setOrders(
          o.map((x: any) => ({
            id: x.reference,
            customer: x.customer_name,
            items: 1,
            total: Number(x.total),
            status: x.status,
            date: new Date(x.created_at).toLocaleDateString(),
          })),
        );
      if (c?.length)
        setCoupons(
          c.map((x: any) => ({
            code: x.code,
            type: x.discount_type,
            value: String(x.value),
            uses: x.usage_count,
            active: x.is_active,
          })),
        );
    })();
  }, [supabaseMode]);
  const [view, setView] = useState<View>("dashboard"),
    [mobile, setMobile] = useState(false),
    [products, setProducts] = useState<AdminProduct[]>(() =>
      store.products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        stock: p.stock,
        image: p.image,
        active: true,
      })),
    ),
    [orders, setOrders] = useState(seedOrders),
    [coupons, setCoupons] = useState(seedCoupons),
    [query, setQuery] = useState(""),
    [addProduct, setAddProduct] = useState(false),
    [smartImport, setSmartImport] = useState(false),
    [toast, setToast] = useState("");
  useEffect(() => {
    const t = toast ? setTimeout(() => setToast(""), 2200) : undefined;
    return () => {
      if (t) clearTimeout(t);
    };
  }, [toast]);
  const filtered = useMemo(
    () =>
      products.filter((p) =>
        (p.name + p.brand + p.category)
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [products, query],
  );
  function notify(x: string) {
    setToast(x);
  }
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget),
      name = String(d.get("name")),
      brand = String(d.get("brand")),
      category = String(d.get("category")),
      price = Number(d.get("price")),
      stock = Number(d.get("stock")),
      image = String(d.get("image")),
      slug = `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now().toString().slice(-5)}`;
    if (supabaseMode) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .maybeSingle();
      const { data, error } = await supabase
        .from("products")
        .insert({
          name,
          slug,
          brand,
          category_id: cat?.id || null,
          price,
          stock,
          images: [image],
          sections: ["new"],
          is_active: true,
        })
        .select()
        .single();
      if (error) {
        notify(error.message);
        return;
      }
      setProducts((p) => [
        {
          id: data.id,
          name,
          brand,
          category,
          price,
          stock,
          image,
          active: true,
        },
        ...p,
      ]);
      notify("Product published to storefront");
    } else {
      setProducts((p) => [
        {
          id: `p${Date.now()}`,
          name,
          brand,
          category,
          price,
          stock,
          image,
          active: true,
        },
        ...p,
      ]);
      notify("Product added");
    }
    setAddProduct(false);
  }
  return (
    <div className="admin-app">
      {toast && <div className="admin-toast">{toast}</div>}
      <aside className={mobile ? "open" : ""}>
        <div className="admin-brand">
          <img src="/brand-logo-v1.png" alt="1ClickMela" />
          <small>ADMIN</small>
          <button onClick={() => setMobile(false)}>
            <X />
          </button>
        </div>
        <nav>
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <button
                className={view === n.id ? "active" : ""}
                onClick={() => {
                  setView(n.id);
                  setMobile(false);
                }}
                key={n.id}
              >
                <Icon />
                <span>{n.label}</span>
                {n.badge && <b>{n.badge}</b>}
              </button>
            );
          })}
        </nav>
        <div className="admin-user">
          <span>AH</span>
          <p>
            <b>{adminName}</b>
            <small>Verified Admin</small>
          </p>
          <a
            href={signOutPath}
            onClick={async (e) => {
              if (supabaseMode) {
                e.preventDefault();
                await supabase.auth.signOut();
                location.href = signOutPath;
              }
            }}
            title="Sign out"
          >
            <LogOut />
          </a>
        </div>
      </aside>
      {mobile && (
        <div className="admin-shade" onClick={() => setMobile(false)} />
      )}
      <main>
        <header>
          <button className="admin-menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <h1>{nav.find((n) => n.id === view)?.label}</h1>
            <p>Live control centre for your complete 1ClickMela store.</p>
          </div>
          <div className="admin-head-actions">
            <a href="/" target="_blank">
              <Eye /> View store
            </a>
            <button>
              <Bell />
              <i />
            </button>
            <span>AH</span>
          </div>
        </header>
        <div className="admin-content">
          {view === "dashboard" && (
            <Dashboard
              products={products}
              orders={orders}
              changeView={setView}
            />
          )}{" "}
          {view === "products" && (
            <ProductsManager notify={notify} onCount={() => {}} />
          )}{" "}
          {view === "brands" && (
            <BrandsManager supabaseMode={supabaseMode} notify={notify} />
          )}{" "}
          {view === "categories" && <CategoriesManager notify={notify} />}{" "}
          {view === "orders" && <OrdersManager notify={notify} />}{" "}
          {view === "custom" && <RequestsManager notify={notify} />}{" "}
          {view === "support" && <SupportManager notify={notify} />}{" "}
          {view === "coupons" && <CouponsManager notify={notify} />}{" "}
          {view === "banners" && <BannersManager notify={notify} />}{" "}
          {view === "customers" && <CustomersManager />}{" "}
          {view === "settings" && <SettingsManager notify={notify} />}
        </div>
      </main>
    </div>
  );
}
function Dashboard({
  products,
  orders,
  changeView,
}: {
  products: AdminProduct[];
  orders: Order[];
  changeView: (v: View) => void;
}) {
  const cards = [
    {
      label: "Total revenue",
      value: "Rs. 0",
      note: "+12.5% this month",
      icon: BarChart3,
      tone: "blue",
    },
    {
      label: "Orders",
      value: "128",
      note: "8 need attention",
      icon: ShoppingBag,
      tone: "orange",
    },
    {
      label: "Products",
      value: String(products.length),
      note: `${products.filter((p) => p.stock < 10).length} low in stock`,
      icon: Package,
      tone: "violet",
    },
    {
      label: "Customers",
      value: "94",
      note: "+9 new this week",
      icon: Users,
      tone: "green",
    },
  ];
  return (
    <>
      <section className="admin-welcome">
        <div>
          <span>STORE OVERVIEW</span>
          <h2>Good morning, Ali.</h2>
          <p>Here’s what’s happening with 1ClickMela today.</p>
        </div>
        <button onClick={() => changeView("products")}>
          <Plus /> Add product
        </button>
      </section>
      <section className="admin-stats">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <article key={c.label}>
              <div className={c.tone}>
                <Icon />
              </div>
              <p>{c.label}</p>
              <strong>{c.value}</strong>
              <small>{c.note}</small>
            </article>
          );
        })}
      </section>
      <section className="admin-dashboard-grid">
        <article className="admin-chart">
          <div className="admin-section-head">
            <div>
              <h3>Revenue overview</h3>
              <p>Last 7 days</p>
            </div>
            <select>
              <option>This week</option>
              <option>This month</option>
            </select>
          </div>
          <div className="bars">
            {[38, 56, 43, 72, 63, 88, 76].map((h, i) => (
              <span key={i}>
                <i style={{ height: `${h}%` }} />
                <small>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </small>
              </span>
            ))}
          </div>
        </article>
        <article className="admin-orders-widget">
          <div className="admin-section-head">
            <div>
              <h3>Recent orders</h3>
              <p>Latest customer purchases</p>
            </div>
            <button onClick={() => changeView("orders")}>View all</button>
          </div>
          {orders.slice(0, 4).map((o) => (
            <div key={o.id}>
              <span>
                <b>{o.id}</b>
                <small>{o.customer}</small>
              </span>
              <strong>{money(o.total)}</strong>
              <em className={o.status.toLowerCase()}>{o.status}</em>
            </div>
          ))}
        </article>
      </section>
      <section className="admin-bottom-grid">
        <article>
          <div className="admin-section-head">
            <div>
              <h3>Order status</h3>
              <p>Current fulfilment</p>
            </div>
          </div>
          {[
            ["Confirmed", 34],
            ["Processing", 27],
            ["Shipped", 21],
            ["Delivered", 16],
          ].map((x) => (
            <div className="progress-row" key={x[0]}>
              <span>{x[0]}</span>
              <i>
                <b style={{ width: `${x[1]}%` }} />
              </i>
              <strong>{x[1]}%</strong>
            </div>
          ))}
        </article>
        <article className="admin-alerts">
          <div className="admin-section-head">
            <div>
              <h3>Needs attention</h3>
              <p>Resolve these next</p>
            </div>
          </div>
          <button onClick={() => changeView("products")}>
            <Package />
            <span>
              <b>Low stock products</b>
              <small>
                {products.filter((p) => p.stock < 10).length} products have
                fewer than 10 units
              </small>
            </span>
          </button>
          <button onClick={() => changeView("custom")}>
            <MessageSquareText />
            <span>
              <b>Custom requests</b>
              <small>3 customer requests awaiting a quote</small>
            </span>
          </button>
        </article>
      </section>
    </>
  );
}
function Products({
  products,
  query,
  setQuery,
  setProducts,
  openAdd,
  openImport,
  notify,
}: {
  products: AdminProduct[];
  query: string;
  setQuery: (v: string) => void;
  setProducts: any;
  openAdd: () => void;
  openImport: () => void;
  notify: (s: string) => void;
}) {
  return (
    <section className="admin-panel">
      <div className="product-mode-strip">
        <div>
          <b>Add products your way</b>
          <span>
            Use manual entry for one item or Smart Import for a complete
            supplier sheet.
          </span>
        </div>
        <button onClick={openImport}>
          <FileSpreadsheet /> Smart Excel import <em>NEW</em>
        </button>
        <button className="admin-primary" onClick={openAdd}>
          <Plus /> Manual product
        </button>
      </div>
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands or categories"
          />
        </div>
        <select>
          <option>All categories</option>
          {store.categories.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="table-product">
                    <img src={p.image} alt="" />
                    <span>
                      <b>{p.name}</b>
                      <small>
                        {p.brand} · {p.id}
                      </small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="table-category">
                    {p.category.replace("-", " ")}
                  </span>
                </td>
                <td>
                  <b>{money(p.price)}</b>
                </td>
                <td>
                  <span className={p.stock < 10 ? "stock-low" : ""}>
                    {p.stock} in stock
                  </span>
                </td>
                <td>
                  <button
                    className={p.active ? "status-live" : "status-off"}
                    onClick={() =>
                      setProducts((all: AdminProduct[]) =>
                        all.map((x) =>
                          x.id === p.id ? { ...x, active: !x.active } : x,
                        ),
                      )
                    }
                  >
                    <i />
                    {p.active ? "Active" : "Draft"}
                  </button>
                </td>
                <td>
                  <button
                    className="table-action"
                    onClick={() => notify(`Editing ${p.name}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function Categories({ notify }: { notify: (s: string) => void }) {
  return (
    <>
      <div className="admin-page-action">
        <div>
          <h2>Product categories</h2>
          <p>Organise the storefront navigation and catalogue.</p>
        </div>
        <button
          className="admin-primary"
          onClick={() => notify("Category creator ready")}
        >
          <Plus /> Add category
        </button>
      </div>
      <section className="admin-category-grid">
        {store.categories.map((c, i) => (
          <article key={c.id}>
            <img src={c.image} alt="" />
            <div>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <small>
                {store.products.filter((p) => p.category === c.slug).length}{" "}
                products
              </small>
            </div>
            <button onClick={() => notify(`Editing ${c.name}`)}>Edit</button>
          </article>
        ))}
      </section>
    </>
  );
}
function Orders({
  orders,
  setOrders,
}: {
  orders: Order[];
  setOrders: (x: Order[]) => void;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search />
          <input placeholder="Search order or customer" />
        </div>
        <select>
          <option>All statuses</option>
          <option>Confirmed</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
        <button>
          <Truck /> Export orders
        </button>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>{o.id}</b>
                </td>
                <td>{o.customer}</td>
                <td>{o.date}</td>
                <td>{o.items}</td>
                <td>
                  <b>{money(o.total)}</b>
                </td>
                <td>
                  <select
                    className="order-status"
                    value={o.status}
                    onChange={(e) =>
                      setOrders(
                        orders.map((x) =>
                          x.id === o.id ? { ...x, status: e.target.value } : x,
                        ),
                      )
                    }
                  >
                    <option>Confirmed</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function CustomRequests({ notify }: { notify: (s: string) => void }) {
  const requests = [
    ["DEMO-REQ-001", "Customer 001", "Sample Watch", "Rs. 0", "New"],
    [
      "DEMO-REQ-002",
      "Customer 002",
      "Sample Watch Strap",
      "Rs. 0",
      "Reviewing",
    ],
    [
      "DEMO-REQ-003",
      "Customer 003",
      "Sample Watch Box",
      "Rs. 0",
      "Quoted",
    ],
  ];
  return (
    <section className="admin-panel">
      <div className="admin-page-action">
        <div>
          <h2>Custom product requests</h2>
          <p>Review sourcing details and prepare customer quotes.</p>
        </div>
      </div>
      <div className="custom-admin-list">
        {requests.map((r) => (
          <article key={r[0]}>
            <div className="custom-admin-icon">
              <ClipboardList />
            </div>
            <div>
              <span>
                {r[0]} · {r[1]}
              </span>
              <h3>{r[2]}</h3>
              <p>
                Customer target: <b>{r[3]}</b>
              </p>
            </div>
            <em>{r[4]}</em>
            <button onClick={() => notify(`Opened ${r[0]}`)}>
              Review request
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
function Coupons({
  coupons,
  setCoupons,
  notify,
}: {
  coupons: Coupon[];
  setCoupons: (x: Coupon[]) => void;
  notify: (s: string) => void;
}) {
  return (
    <section className="admin-panel">
      <div className="admin-page-action">
        <div>
          <h2>Coupons & promotions</h2>
          <p>Create discounts and control campaign availability.</p>
        </div>
        <button
          className="admin-primary"
          onClick={() => notify("Coupon creator ready")}
        >
          <Plus /> Create coupon
        </button>
      </div>
      <div className="coupon-admin-grid">
        {coupons.map((c) => (
          <article key={c.code}>
            <div>
              <Tag />
              <span>
                <b>{c.code}</b>
                <small>{c.type}</small>
              </span>
              <button
                className={c.active ? "admin-switch on" : "admin-switch"}
                onClick={() =>
                  setCoupons(
                    coupons.map((x) =>
                      x.code === c.code ? { ...x, active: !x.active } : x,
                    ),
                  )
                }
              >
                <i />
              </button>
            </div>
            <h3>{c.value}</h3>
            <p>{c.uses} times used</p>
            <button onClick={() => notify(`Editing ${c.code}`)}>
              Edit coupon
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
function Banners({ notify }: { notify: (s: string) => void }) {
  return (
    <section className="admin-panel">
      <div className="admin-page-action">
        <div>
          <h2>Homepage banners</h2>
          <p>Control the main promotional slides shown on the store.</p>
        </div>
        <button
          className="admin-primary"
          onClick={() => notify("Banner creator ready")}
        >
          <Plus /> Add banner
        </button>
      </div>
      <div className="banner-admin-list">
        {store.heroSlides.map((b, i) => (
          <article key={b.id}>
            <img src={b.image} alt="" />
            <div>
              <span>SLIDE {i + 1}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
            <em>Active</em>
            <button onClick={() => notify(`Editing slide ${i + 1}`)}>
              Edit
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
function Customers() {
  const people = [
    ["C1", "Customer 001", "customer001@demo.invalid", "0 orders", "Rs. 0"],
    ["C2", "Customer 002", "customer002@demo.invalid", "0 orders", "Rs. 0"],
    ["C3", "Customer 003", "customer003@demo.invalid", "0 orders", "Rs. 0"],
    ["C4", "Customer 004", "customer004@demo.invalid", "0 orders", "Rs. 0"],
  ];
  return (
    <section className="admin-panel">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search />
          <input placeholder="Search customers" />
        </div>
        <button>Export customers</button>
      </div>
      <div className="customer-list">
        {people.map((p) => (
          <article key={p[1]}>
            <span>{p[0]}</span>
            <div>
              <b>{p[1]}</b>
              <small>{p[2]}</small>
            </div>
            <p>{p[3]}</p>
            <strong>{p[4]}</strong>
            <button>View profile</button>
          </article>
        ))}
      </div>
    </section>
  );
}
function AdminSettings({ notify }: { notify: (s: string) => void }) {
  return (
    <section className="settings-grid">
      <article>
        <h2>Store information</h2>
        <p>Details customers see across the website.</p>
        <label>
          Store name
          <input defaultValue="1ClickMela" />
        </label>
        <label>
          Support email
          <input defaultValue="support@1clickmela.com" />
        </label>
        <label>
          Store currency
          <select defaultValue="PKR">
            <option>PKR</option>
          </select>
        </label>
        <button
          className="admin-primary"
          onClick={() => notify("Store settings saved locally")}
        >
          Save changes
        </button>
      </article>
      <article>
        <h2>Checkout settings</h2>
        <p>Configure ordering and delivery rules.</p>
        <label>
          Standard delivery fee
          <input type="number" defaultValue="250" />
        </label>
        <label>
          Free delivery above
          <input type="number" defaultValue="4999" />
        </label>
        <div className="setting-row">
          <span>
            <b>Cash on Delivery</b>
            <small>Accept payment when parcel arrives</small>
          </span>
          <button className="admin-switch on">
            <i />
          </button>
        </div>
        <div className="setting-row">
          <span>
            <b>Online payments</b>
            <small>Enable after payment gateway setup</small>
          </span>
          <button className="admin-switch">
            <i />
          </button>
        </div>
        <button
          className="admin-primary"
          onClick={() => notify("Checkout settings saved locally")}
        >
          Save changes
        </button>
      </article>
      <article>
        <h2>Notifications</h2>
        <p>Choose which store events need attention.</p>
        {[
          "New order received",
          "Custom request submitted",
          "Low inventory alert",
          "Customer support message",
        ].map((x) => (
          <div className="setting-row" key={x}>
            <span>
              <b>{x}</b>
            </span>
            <button className="admin-switch on">
              <i />
            </button>
          </div>
        ))}
      </article>
    </section>
  );
}
