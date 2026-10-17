import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ClipboardList,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  Upload,
  ShieldCheck,
  X,
  ExternalLink,
  Menu,
} from "lucide-react";
import { api, imageUrl } from "./api";
function Header({ site }) {
  return (
    <header className="header">
      <Link className="brand" to="/">
        <b>Ⓥ {site.companyName || "VALCO"}</b>
        <small>{site.tagline || "VALVE MAINTENANCE & TESTING"}</small>
      </Link>
      <nav>
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="btn primary" href="#contact">
        Request a Quote →
      </a>
    </header>
  );
}
function Home() {
  const [site, S] = useState({}),
    [products, P] = useState([]),
    [form, F] = useState({
      name: "",
      company: "",
      email: "",
      phone: "",
      product: "",
      message: "",
    }),
    [msg, M] = useState("");
  useEffect(() => {
    Promise.all([api("/api/site"), api("/api/products")])
      .then(([s, p]) => {
        S(s);
        P(p);
      })
      .catch((e) => M(e.message));
  }, []);
  function upd(e) {
    F({ ...form, [e.target.name]: e.target.value });
  }
  async function send(e) {
    e.preventDefault();
    try {
      M(
        (
          await api("/api/quotes", {
            method: "POST",
            body: JSON.stringify(form),
          })
        ).message,
      );
      F({
        name: "",
        company: "",
        email: "",
        phone: "",
        product: "",
        message: "",
      });
    } catch (e) {
      M(e.message);
    }
  }
  return (
    <>
      <Header site={site} />
      <section id="home" className="hero">
        <div>
          <span className="pill">BUILT FOR RELIABLE FLOW CONTROL</span>
          <h1>{site.heroTitle || "Reliable valve solutions for industry"}</h1>
          <p>
            {site.heroSubtitle ||
              "Precision, safety and dependable flow control solutions."}
          </p>
          <a className="btn white" href="#products">
            Explore Products →
          </a>{" "}
          <a className="btn ghost" href="#contact">
            Request a Quote
          </a>
        </div>
        <div className="hero-img">
          {site.heroImage ? (
            <img src={imageUrl(site.heroImage)} alt="Industrial valves" />
          ) : (
            <h2>Industrial Valve Solutions</h2>
          )}
        </div>
      </section>
      <section id="products" className="section">
        <span className="eyebrow">OUR CATALOG</span>
        <h2>Our Products</h2>
        <p>
          Browse the catalog and request specifications for your application.
        </p>
        <div className="grid">
          {products.map((p) => (
            <article className="card" key={p._id}>
              <div className="product-img">
                {p.image ? (
                  <img src={imageUrl(p.image)} alt={p.name?.en} />
                ) : (
                  <Boxes size={44} />
                )}
              </div>
              <div className="card-body">
                <small>{p.category}</small>
                <h3>{p.name?.en}</h3>
                <p>{p.description?.en}</p>
                <a
                  href="#contact"
                  onClick={() =>
                    F((f) => ({ ...f, product: p.name?.en || "" }))
                  }
                >
                  View details →
                </a>
              </div>
            </article>
          ))}
        </div>
        {!products.length && (
          <p>No products yet. Add products from the admin dashboard.</p>
        )}
      </section>
      <section id="about" className="about">
        <span className="eyebrow">ABOUT VALCO</span>
        <h2>Engineering confidence into every connection.</h2>
        <p>
          {site.aboutText ||
            "We support industrial customers with dependable valve solutions."}
        </p>
      </section>
      <section id="contact" className="section contact">
        <div>
          <span className="eyebrow">LET'S TALK</span>
          <h2>Request a Quote</h2>
          <p>Tell us about your application and our team will follow up.</p>
          {site.contactEmail && <p>{site.contactEmail}</p>}
          {site.contactPhone && <p>{site.contactPhone}</p>}
        </div>
        <form onSubmit={send} className="form-grid">
          {[
            ["name", "Name *"],
            ["company", "Company"],
            ["email", "Email *"],
            ["phone", "Phone"],
            ["product", "Product of interest"],
          ].map(([n, l]) => (
            <label key={n}>
              {l}
              <input
                name={n}
                value={form[n]}
                onChange={upd}
                required={n === "name" || n === "email"}
                type={n === "email" ? "email" : "text"}
              />
            </label>
          ))}
          <label className="full">
            Message *
            <textarea
              name="message"
              value={form.message}
              onChange={upd}
              required
              rows="4"
            />
          </label>
          <button className="btn primary">Send Request →</button>
          {msg && <p>{msg}</p>}
        </form>
      </section>
      <footer>
        © {new Date().getFullYear()} {site.companyName || "VALCO"}. All rights
        reserved. <Link to="/admin/login">Admin</Link>
      </footer>
    </>
  );
}
function Login() {
  const [email, E] = useState("admin@valco.local"),
    [password, P] = useState(""),
    [error, Er] = useState(""),
    [busy, B] = useState(false),
    nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    Er("");
    B(true);
    try {
      const r = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("valco_admin_token", r.token);
      nav("/admin");
    } catch (e) {
      Er(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <Link to="/">← Website</Link>
        <div className="shield">
          <ShieldCheck />
        </div>
        <h1>Admin sign in</h1>
        <p>Manage your VALCO website and catalog.</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => E(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => P(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
function AdminShell({ children, active, logout }) {
  const [open, O] = useState(false),
    items = [
      ["/admin", "Overview", LayoutDashboard],
      ["/admin/products", "Products", Package],
      ["/admin/content", "Website content", Settings],
      ["/admin/quotes", "Quote requests", ClipboardList],
    ];
  return (
    <div className="admin">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <Link className="brand" to="/">
          <b>Ⓥ VALCO</b>
          <small>ADMIN PANEL</small>
        </Link>
        <p className="eyebrow">WORKSPACE</p>
        {items.map(([to, label, Icon]) => (
          <Link
            key={to}
            className={active === to ? "nav active" : "nav"}
            to={to}
            onClick={() => O(false)}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
        <div className="side-bottom">
          <a className="nav" href="/" target="_blank">
            <ExternalLink size={17} />
            View website
          </a>
          <button className="nav" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="top">
          <button className="mobile" onClick={() => O(!open)}>
            <Menu />
          </button>
          Website management <span>Admin</span>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
function Title({ k, title, desc, action }) {
  return (
    <div className="title">
      <div>
        <span className="eyebrow">{k}</span>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {action}
    </div>
  );
}
function useData() {
  const [products, P] = useState([]),
    [quotes, Q] = useState([]),
    [site, setSite] = useState({}),
    [error, E] = useState(""),
    [loading, L] = useState(true);
  async function refresh() {
    L(true);
    try {
      const [a, b, c] = await Promise.all([
        api("/api/products?admin=true"),
        api("/api/quotes"),
        api("/api/site"),
      ]);
      P(a);
      Q(b);
      setSite(c);
      E("");
    } catch (e) {
      E(e.message);
    } finally {
      L(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  return { products, quotes, site, setSite, error, loading, refresh };
}
function Overview({ d }) {
  return (
    <>
      <Title
        k="OVERVIEW"
        title="Welcome back"
        desc="Manage your website and customer enquiries."
      />
      <div className="stats">
        <div>
          <Package />
          <small>Total products</small>
          <strong>{d.products.length}</strong>
        </div>
        <div>
          <Boxes />
          <small>Featured products</small>
          <strong>{d.products.filter((p) => p.featured).length}</strong>
        </div>
        <div>
          <ClipboardList />
          <small>Quote requests</small>
          <strong>{d.quotes.length}</strong>
        </div>
      </div>
      <div className="panel">
        <h2>Recent quote requests</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {d.quotes.slice(0, 8).map((q) => (
              <tr key={q._id}>
                <td>
                  {q.name}
                  <small>{q.email}</small>
                </td>
                <td>{q.product || "—"}</td>
                <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                <td>{q.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!d.quotes.length && <p>No quote requests yet.</p>}
      </div>
    </>
  );
}
const blank = () => ({
  slug: "",
  sku: "",
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  category: "Gate Valves",
  image: "",
  featured: false,
  active: true,
  options: {},
});
function Products({ d }) {
  const [edit, E] = useState(null),
    [notice, N] = useState(""),
    [query, Q] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      const body = {
        ...edit,
        slug:
          edit.slug ||
          edit.name.en
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
      };
      await api(edit._id ? `/api/products/${edit._id}` : "/api/products", {
        method: edit._id ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      E(null);
      N("Product saved.");
      await d.refresh();
    } catch (e) {
      N(e.message);
    }
  }
  async function upload(file) {
    const f = new FormData();
    f.append("image", file);
    try {
      const r = await api("/api/upload", { method: "POST", body: f });
      E((x) => ({ ...x, image: r.url }));
    } catch (e) {
      N(e.message);
    }
  }
  async function del(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      await d.refresh();
    } catch (e) {
      N(e.message);
    }
  }
  const filtered = d.products.filter((p) =>
    `${p.name?.en} ${p.category} ${p.sku}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <Title
        k="CATALOG MANAGEMENT"
        title="Products"
        desc="Create, edit, publish and remove products."
        action={
          <button className="btn primary" onClick={() => E(blank())}>
            <Plus size={16} />
            Add product
          </button>
        }
      />
      {(notice || d.error) && <p className="notice">{notice || d.error}</p>}
      <div className="panel">
        <input
          className="search"
          placeholder="Search products…"
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
        {filtered.map((p) => (
          <div className="product-row" key={p._id}>
            <div className="thumb">
              {p.image ? <img src={imageUrl(p.image)} alt="" /> : <Boxes />}
            </div>
            <div className="grow">
              <b>{p.name?.en}</b>
              <small>
                {p.category} · {p.sku || "No SKU"} ·{" "}
                {p.active ? "Published" : "Draft"}
              </small>
            </div>
            <button
              className="icon-btn"
              onClick={() =>
                E({
                  ...p,
                  name: { en: "", ar: "", ...p.name },
                  description: { en: "", ar: "", ...p.description },
                })
              }
            >
              <Pencil size={16} />
            </button>
            <button className="icon-btn danger" onClick={() => del(p._id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {edit && (
        <div className="modal-bg">
          <form className="modal" onSubmit={save}>
            <div className="modal-title">
              <h2>{edit._id ? "Edit product" : "Add product"}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => E(null)}
              >
                <X />
              </button>
            </div>
            <div className="form-grid">
              {[
                ["en", "Product name (English)"],
                ["ar", "Product name (Arabic)"],
              ].map(([k, l]) => (
                <label key={k}>
                  {l}
                  <input
                    value={edit.name[k] || ""}
                    required={k === "en"}
                    onChange={(e) =>
                      E({
                        ...edit,
                        name: { ...edit.name, [k]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <label>
                SKU
                <input
                  value={edit.sku || ""}
                  onChange={(e) => E({ ...edit, sku: e.target.value })}
                />
              </label>
              <label>
                Category
                <input
                  value={edit.category || ""}
                  onChange={(e) => E({ ...edit, category: e.target.value })}
                />
              </label>
              <label className="full">
                Description
                <input
                  value={edit.description.en || ""}
                  onChange={(e) =>
                    E({
                      ...edit,
                      description: { ...edit.description, en: e.target.value },
                    })
                  }
                />
              </label>
              <label className="full">
                Image URL
                <input
                  value={edit.image || ""}
                  onChange={(e) => E({ ...edit, image: e.target.value })}
                />
                <span className="upload-label">
                  <Upload size={15} /> Upload image{" "}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && upload(e.target.files[0])
                    }
                  />
                </span>
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!edit.featured}
                  onChange={(e) => E({ ...edit, featured: e.target.checked })}
                />{" "}
                Featured
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!edit.active}
                  onChange={(e) => E({ ...edit, active: e.target.checked })}
                />{" "}
                Published
              </label>
            </div>
            <div className="actions">
              <button
                type="button"
                className="btn muted"
                onClick={() => E(null)}
              >
                Cancel
              </button>
              <button className="btn primary">
                <Save size={16} />
                Save product
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
function Content({ d }) {
  const [f, F] = useState(d.site),
    [msg, M] = useState("");
  useEffect(() => F(d.site), [d.site]);
  async function save(e) {
    e.preventDefault();
    try {
      const s = await api("/api/site", {
        method: "PUT",
        body: JSON.stringify(f),
      });
      d.setSite(s);
      M("Website content saved.");
    } catch (e) {
      M(e.message);
    }
  }
  const fields = [
    ["companyName", "Company name"],
    ["tagline", "Tagline"],
    ["heroTitle", "Hero title"],
    ["heroSubtitle", "Hero subtitle"],
    ["heroImage", "Hero image URL"],
    ["contactEmail", "Contact email"],
    ["contactPhone", "Contact phone"],
  ];
  return (
    <>
      <Title
        k="WEBSITE SETTINGS"
        title="Website content"
        desc="Edit the public homepage copy and contact details."
      />
      <form className="panel content-panel" onSubmit={save}>
        <div className="form-grid">
          {fields.map(([k, l]) => (
            <label key={k}>
              {l}
              <input
                value={f[k] || ""}
                onChange={(e) => F({ ...f, [k]: e.target.value })}
              />
            </label>
          ))}
          <label className="full">
            About text
            <textarea
              rows="5"
              value={f.aboutText || ""}
              onChange={(e) => F({ ...f, aboutText: e.target.value })}
            />
          </label>
        </div>
        <div className="actions">
          <button className="btn primary">
            <Save size={16} />
            Save changes
          </button>
        </div>
        {msg && <p>{msg}</p>}
      </form>
    </>
  );
}
function Quotes({ d }) {
  const [msg, M] = useState("");
  async function change(id, status) {
    try {
      await api(`/api/quotes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await d.refresh();
    } catch (e) {
      M(e.message);
    }
  }
  return (
    <>
      <Title
        k="CUSTOMER ENQUIRIES"
        title="Quote requests"
        desc="Review requests and update their status."
      />
      {msg && <p>{msg}</p>}
      <div className="panel">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Product</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {d.quotes.map((q) => (
              <tr key={q._id}>
                <td>
                  {q.name}
                  <small>{q.email}</small>
                  <small>
                    {q.company} {q.phone}
                  </small>
                </td>
                <td>{q.product || "General enquiry"}</td>
                <td>{q.message}</td>
                <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={q.status}
                    onChange={(e) => change(q._id, e.target.value)}
                  >
                    <option>new</option>
                    <option>contacted</option>
                    <option>closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!d.quotes.length && <p className="empty">No quote requests yet.</p>}
      </div>
    </>
  );
}
function Admin() {
  const nav = useNavigate(),
    [checking, C] = useState(true),
    [ok, O] = useState(false),
    d = useData(),
    path = location.pathname;
  useEffect(() => {
    api("/api/auth/me")
      .then(() => O(true))
      .catch(() => O(false))
      .finally(() => C(false));
  }, []);
  if (checking) return <div className="loading">Checking session…</div>;
  if (!ok) return <Navigate to="/admin/login" replace />;
  const active =
    path === "/admin"
      ? "/admin"
      : path.startsWith("/admin/products")
        ? "/admin/products"
        : path.startsWith("/admin/content")
          ? "/admin/content"
          : "/admin/quotes";
  return (
    <AdminShell
      active={active}
      logout={() => {
        localStorage.removeItem("valco_admin_token");
        nav("/admin/login");
      }}
    >
      {d.loading ? (
        <div className="loading">Loading dashboard…</div>
      ) : (
        <Routes>
          <Route index element={<Overview d={d} />} />
          <Route path="products" element={<Products d={d} />} />
          <Route path="content" element={<Content d={d} />} />
          <Route path="quotes" element={<Quotes d={d} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      )}
    </AdminShell>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
