import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
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
  Languages,
  KeyRound,
  FolderTree,
  FileDown,
} from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick, LangToggle } from "./i18n.jsx";
import Home from "./Home.jsx";
import Catalog from "./Catalog.jsx";
import { AboutPage, ServicesPage, ContactPage, IndustriesPage, DownloadsPage } from "./Pages.jsx";
import AdminCategories from "./AdminCategories.jsx";
import AdminDownloads from "./AdminDownloads.jsx";
import { loadCatalog } from "./catalog.js";
import ProductPage from "./ProductPage.jsx";
import { SOCIAL } from "./Layout.jsx";
import Account from "./Account.jsx";
import ProductExtrasEditor, { toEditable, fromEditable } from "./ProductExtrasEditor.jsx";

const locale = (lang) => (lang === "ar" ? "ar-EG" : "en-GB");

function Login() {
  const { t } = useLang();
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
        <div className="login-top">
          <Link to="/">
            {t("arrow") === "→" ? "←" : "→"} {t("backToSite")}
          </Link>
          <LangToggle />
        </div>
        <div className="shield">
          <ShieldCheck />
        </div>
        <h1>{t("signInTitle")}</h1>
        <p>{t("signInDesc")}</p>
        <label>
          {t("email")}
          <input
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => E(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => P(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary full" disabled={busy}>
          {busy ? t("signingIn") : t("signIn")}
        </button>
      </form>
    </div>
  );
}

function AdminShell({ children, active, logout }) {
  const { t, toggle } = useLang();
  const [open, O] = useState(false),
    items = [
      ["/admin", "overview", LayoutDashboard],
      ["/admin/products", "products", Package],
      ["/admin/categories", "categories", FolderTree],
      ["/admin/downloads", "navDownloads", FileDown],
      ["/admin/content", "websiteContent", Settings],
      ["/admin/quotes", "quoteRequests", ClipboardList],
      ["/admin/account", "account", KeyRound],
    ];
  return (
    <div className="admin">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <Link className="brand" to="/">
          <b>Ⓥ VALCO</b>
          <small>{t("adminPanel")}</small>
        </Link>
        <p className="eyebrow">{t("workspace")}</p>
        {items.map(([to, label, Icon]) => (
          <Link
            key={to}
            className={active === to ? "nav active" : "nav"}
            to={to}
            onClick={() => O(false)}
          >
            <Icon size={17} />
            {t(label)}
          </Link>
        ))}
        <div className="side-bottom">
          <button className="nav" onClick={toggle}>
            <Languages size={17} />
            {t("switchLang")}
          </button>
          <a className="nav" href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
            {t("viewWebsite")}
          </a>
          <button className="nav" onClick={logout}>
            <LogOut size={17} />
            {t("signOut")}
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="top">
          <button className="mobile" onClick={() => O(!open)}>
            <Menu />
          </button>
          {t("websiteManagement")} <span>{t("admin")}</span>
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
    [categories, setCategories] = useState([]),
    [error, E] = useState(""),
    [loading, L] = useState(true);
  async function refresh() {
    L(true);
    try {
      const [a, b, c, cats] = await Promise.all([
        api("/api/products?admin=true"),
        api("/api/quotes"),
        api("/api/site"),
        api("/api/categories?admin=true"),
      ]);
      P(a);
      Q(b);
      setSite(c);
      setCategories(cats);
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
  return { products, quotes, site, setSite, categories, error, loading, refresh };
}

function Overview({ d }) {
  const { t, lang } = useLang();
  return (
    <>
      <Title k={t("overviewK")} title={t("welcome")} desc={t("welcomeDesc")} />
      <div className="stats">
        <div>
          <Package />
          <small>{t("totalProducts")}</small>
          <strong>{d.products.length}</strong>
        </div>
        <div>
          <Boxes />
          <small>{t("featuredProducts")}</small>
          <strong>{d.products.filter((p) => p.featured).length}</strong>
        </div>
        <div>
          <ClipboardList />
          <small>{t("quoteRequests")}</small>
          <strong>{d.quotes.length}</strong>
        </div>
      </div>
      <div className="panel">
        <h2>{t("recentQuotes")}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("customer")}</th>
                <th>{t("product")}</th>
                <th>{t("date")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {d.quotes.slice(0, 8).map((q) => (
                <tr key={q._id}>
                  <td>
                    {q.name}
                    <small dir="ltr">{q.email}</small>
                  </td>
                  <td>{q.product || "—"}</td>
                  <td>
                    {new Date(q.createdAt).toLocaleDateString(locale(lang))}
                  </td>
                  <td>{t(`st_${q.status}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!d.quotes.length && <p>{t("noQuotes")}</p>}
      </div>
    </>
  );
}

const blank = () => ({
  slug: "",
  sku: "",
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  categorySlug: "",
  image: "",
  featured: false,
  active: true,
  options: {},
  gallery: [],
  specs: [],
  optionGroups: [],
});

function Products({ d }) {
  const { t, lang } = useLang();
  const [edit, E] = useState(null),
    [notice, N] = useState(""),
    [query, Q] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      const body = {
        ...fromEditable(edit),
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
      N(t("productSaved"));
      await d.refresh();
    } catch (e) {
      N(e.message);
    }
  }
  async function uploadFile(file) {
    const f = new FormData();
    f.append("image", file);
    try {
      const r = await api("/api/upload", { method: "POST", body: f });
      return r.url;
    } catch (e) {
      N(e.message);
      return "";
    }
  }
  async function upload(file) {
    const url = await uploadFile(file);
    if (url) E((x) => ({ ...x, image: url }));
  }
  async function del(id) {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await api(`/api/products/${id}`, { method: "DELETE" });
      await d.refresh();
    } catch (e) {
      N(e.message);
    }
  }
  const setName = (k, v) => E({ ...edit, name: { ...edit.name, [k]: v } });
  const setDesc = (k, v) =>
    E({ ...edit, description: { ...edit.description, [k]: v } });
  const filtered = d.products.filter((p) =>
    `${p.name?.en} ${p.name?.ar} ${p.category} ${p.categoryAr} ${p.sku}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <Title
        k={t("catalogK")}
        title={t("products")}
        desc={t("productsDesc")}
        action={
          <button
            className="btn primary"
            onClick={() => E(toEditable({ ...blank(), categorySlug: d.categories[0]?.slug || "" }))}
          >
            <Plus size={16} />
            {t("addProduct")}
          </button>
        }
      />
      {(notice || d.error) && <p className="notice">{notice || d.error}</p>}
      <div className="panel">
        <input
          className="search"
          placeholder={t("searchProducts")}
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
        {filtered.map((p) => (
          <div className="product-row" key={p._id}>
            <div className="thumb">
              {p.image ? <img src={imageUrl(p.image)} alt="" /> : <Boxes />}
            </div>
            <div className="grow">
              <b>{pick(p.name, lang)}</b>
              <small>
                {pick({ en: p.category, ar: p.categoryAr }, lang)} ·{" "}
                {p.sku || t("noSku")} · {p.active ? t("published") : t("draft")}
              </small>
            </div>
            <button
              className="icon-btn"
              onClick={() =>
                E(
                  toEditable({
                    ...p,
                    categoryAr: p.categoryAr || "",
                    name: { en: "", ar: "", ...p.name },
                    description: { en: "", ar: "", ...p.description },
                  }),
                )
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
              <h2>{edit._id ? t("editProduct") : t("addProduct")}</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => E(null)}
              >
                <X />
              </button>
            </div>
            <div className="form-grid">
              <label>
                {t("nameEn")}
                <input
                  dir="ltr"
                  value={edit.name.en || ""}
                  required
                  onChange={(e) => setName("en", e.target.value)}
                />
              </label>
              <label>
                {t("nameAr")}
                <input
                  dir="rtl"
                  value={edit.name.ar || ""}
                  onChange={(e) => setName("ar", e.target.value)}
                />
              </label>
              <label className="full">
                {t("category")}
                <select
                  value={edit.categorySlug || ""}
                  onChange={(e) => E({ ...edit, categorySlug: e.target.value })}
                >
                  <option value="">{t("noCategory")}</option>
                  {d.categories
                    .filter((c) => !c.parent)
                    .map((m) => {
                      const subs = d.categories.filter((c) => c.parent === m.slug);
                      return subs.length ? (
                        <optgroup key={m._id} label={pick(m.name, lang)}>
                          <option value={m.slug}>
                            {pick(m.name, lang)} ({t("allOf")})
                          </option>
                          {subs.map((c) => (
                            <option key={c._id} value={c.slug}>
                              {pick(c.name, lang)}
                            </option>
                          ))}
                        </optgroup>
                      ) : (
                        <option key={m._id} value={m.slug}>
                          {pick(m.name, lang)}
                        </option>
                      );
                    })}
                </select>
              </label>
              <label className="full">
                {t("descEn")}
                <textarea
                  dir="ltr"
                  rows="3"
                  value={edit.description.en || ""}
                  onChange={(e) => setDesc("en", e.target.value)}
                />
              </label>
              <label className="full">
                {t("descAr")}
                <textarea
                  dir="rtl"
                  rows="3"
                  value={edit.description.ar || ""}
                  onChange={(e) => setDesc("ar", e.target.value)}
                />
              </label>
              <label>
                {t("sku")}
                <input
                  dir="ltr"
                  value={edit.sku || ""}
                  onChange={(e) => E({ ...edit, sku: e.target.value })}
                />
              </label>
              <label>
                {t("imageUrl")}
                <input
                  dir="ltr"
                  value={edit.image || ""}
                  onChange={(e) => E({ ...edit, image: e.target.value })}
                />
                <span className="upload-label">
                  <Upload size={15} /> {t("uploadMainImage")}{" "}
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
                {t("featured")}
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={!!edit.active}
                  onChange={(e) => E({ ...edit, active: e.target.checked })}
                />{" "}
                {t("published")}
              </label>
            </div>
            <ProductExtrasEditor edit={edit} setEdit={E} uploadFile={uploadFile} />
            <div className="actions">
              <button
                type="button"
                className="btn muted"
                onClick={() => E(null)}
              >
                {t("cancel")}
              </button>
              <button className="btn primary">
                <Save size={16} />
                {t("saveProduct")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Content({ d }) {
  const { t } = useLang();
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
      loadCatalog(true).catch(() => {});
      M(t("contentSaved"));
    } catch (e) {
      M(e.message);
    }
  }
  const translated = [
    ["companyName", "companyName"],
    ["tagline", "taglineL"],
    ["heroTitle", "heroTitleL"],
    ["heroSubtitle", "heroSubtitleL"],
  ];
  const field = (k, label, dir) => (
    <label key={k}>
      {t(label)}
      <input
        dir={dir}
        value={f[k] || ""}
        onChange={(e) => F({ ...f, [k]: e.target.value })}
      />
      {k.startsWith("heroTitle") && <span className="field-hint">{t("heroTitleHelp")}</span>}
    </label>
  );
  const stats = f.stats || [];
  const setStat = (i, patch) =>
    F((x) => ({ ...x, stats: (x.stats || []).map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  async function uploadTo(k, file) {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await api("/api/upload", { method: "POST", body: fd });
      F((x) => ({ ...x, [k]: r.url }));
    } catch (err) {
      M(err.message);
    }
  }
  const imageField = (k, label) => (
    <label key={k} className="full">
      {t(label)}
      <div className="image-field">
        {f[k] && <img src={imageUrl(f[k])} alt="" />}
        <input dir="ltr" value={f[k] || ""} onChange={(e) => F({ ...f, [k]: e.target.value })} />
        <span className="upload-label">
          <Upload size={15} /> {t("upload")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) uploadTo(k, file);
            }}
          />
        </span>
      </div>
      <span className="field-hint">{t("heroImageHelp")}</span>
    </label>
  );
  return (
    <>
      <Title
        k={t("settingsK")}
        title={t("websiteContent")}
        desc={t("contentDesc")}
      />
      <form className="panel content-panel" onSubmit={save}>
        <h2>{t("englishVersion")}</h2>
        <div className="form-grid">
          {translated.map(([k, l]) => field(k, l, "ltr"))}
          <label className="full">
            {t("aboutTextL")}
            <textarea
              dir="ltr"
              rows="4"
              value={f.aboutText || ""}
              onChange={(e) => F({ ...f, aboutText: e.target.value })}
            />
          </label>
        </div>
        <h2 className="section-gap">{t("arabicVersion")}</h2>
        <div className="form-grid">
          {translated.map(([k, l]) => field(`${k}Ar`, l, "rtl"))}
          <label className="full">
            {t("aboutTextL")}
            <textarea
              dir="rtl"
              rows="4"
              value={f.aboutTextAr || ""}
              onChange={(e) => F({ ...f, aboutTextAr: e.target.value })}
            />
          </label>
        </div>
        <h2 className="section-gap">{t("sharedSettings")}</h2>
        <div className="form-grid">
          {imageField("heroImage", "heroImageL")}
          {imageField("aboutImage", "aboutImageL")}
        </div>
        <h2 className="section-gap">{t("statsTitle")}</h2>
        <p className="field-hint">{t("statsHelp")}</p>
        <div className="stats-edit">
          {stats.map((s, i) => (
            <div key={i} className="stat-edit-row">
              <label>
                {t("statValue")}
                <input dir="ltr" placeholder="500+" value={s.value || ""} onChange={(e) => setStat(i, { value: e.target.value })} />
              </label>
              <label>
                {t("statLabelEn")}
                <input dir="ltr" value={s.label?.en || ""} onChange={(e) => setStat(i, { label: { ...s.label, en: e.target.value } })} />
              </label>
              <label>
                {t("statLabelAr")}
                <input dir="rtl" value={s.label?.ar || ""} onChange={(e) => setStat(i, { label: { ...s.label, ar: e.target.value } })} />
              </label>
            </div>
          ))}
        </div>
        <h2 className="section-gap">{t("contactDetails")}</h2>
        <div className="form-grid">
          {field("contactLandline", "landline", "ltr")}
          {field("contactPhone", "mobile", "ltr")}
          {field("contactEmail", "email", "ltr")}
        </div>
        <h2 className="section-gap">{t("socialMedia")}</h2>
        <p className="field-hint">{t("socialHelp")}</p>
        <div className="form-grid">
          {SOCIAL.map(([k, name]) => (
            <label key={k}>
              {name}
              <input
                dir="ltr"
                placeholder="https://"
                value={f[k] || ""}
                onChange={(e) => F({ ...f, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <div className="actions">
          <button className="btn primary">
            <Save size={16} />
            {t("saveChanges")}
          </button>
        </div>
        {msg && <p>{msg}</p>}
      </form>
    </>
  );
}

function Quotes({ d }) {
  const { t, lang } = useLang();
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
        k={t("enquiriesK")}
        title={t("quoteRequests")}
        desc={t("quotesDesc")}
      />
      {msg && <p>{msg}</p>}
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("customer")}</th>
                <th>{t("product")}</th>
                <th>{t("message")}</th>
                <th>{t("date")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {d.quotes.map((q) => (
                <tr key={q._id}>
                  <td>
                    {q.name}
                    <small dir="ltr">{q.email}</small>
                    <small>
                      {q.company} <span dir="ltr">{q.phone}</span>
                    </small>
                  </td>
                  <td>
                    {q.product || t("generalEnquiry")}
                    {q.productId && (
                      <small>
                        {t("quantity")}: {q.quantity || 1}
                      </small>
                    )}
                    {q.selections?.map((sel, i) => (
                      <small key={i}>
                        {sel.name}: <b>{sel.value}</b>
                      </small>
                    ))}
                  </td>
                  <td>{q.message || "—"}</td>
                  <td>
                    {new Date(q.createdAt).toLocaleDateString(locale(lang))}
                  </td>
                  <td>
                    <select
                      value={q.status}
                      onChange={(e) => change(q._id, e.target.value)}
                    >
                      {["new", "contacted", "closed"].map((s) => (
                        <option key={s} value={s}>
                          {t(`st_${s}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!d.quotes.length && <p className="empty">{t("noQuotes")}</p>}
      </div>
    </>
  );
}

function Admin() {
  const { t } = useLang();
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
  if (checking) return <div className="loading">{t("checkingSession")}</div>;
  if (!ok) return <Navigate to="/admin/login" replace />;
  const active =
    path === "/admin"
      ? "/admin"
      : path.startsWith("/admin/products")
        ? "/admin/products"
        : path.startsWith("/admin/downloads")
          ? "/admin/downloads"
        : path.startsWith("/admin/categories")
          ? "/admin/categories"
        : path.startsWith("/admin/content")
          ? "/admin/content"
          : path.startsWith("/admin/account")
            ? "/admin/account"
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
        <div className="loading">{t("loadingDashboard")}</div>
      ) : (
        <Routes>
          <Route index element={<Overview d={d} />} />
          <Route path="products" element={<Products d={d} />} />
          <Route path="categories" element={<AdminCategories d={d} />} />
          <Route path="downloads" element={<AdminDownloads />} />
          <Route path="content" element={<Content d={d} />} />
          <Route path="quotes" element={<Quotes d={d} />} />
          <Route path="account" element={<Account />} />
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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/industries" element={<IndustriesPage />} />
      <Route path="/downloads" element={<DownloadsPage />} />
      <Route path="/products" element={<Catalog />} />
      <Route path="/category/:slug" element={<Catalog />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
