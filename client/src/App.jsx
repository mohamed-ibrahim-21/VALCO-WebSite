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
} from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick, siteText, LangToggle } from "./i18n.jsx";

const locale = (lang) => (lang === "ar" ? "ar-EG" : "en-GB");

function companyName(site, lang) {
  return siteText(site, "companyName", lang, site.companyName || "VALCO");
}

function Header({ site }) {
  const { t, lang } = useLang();
  return (
    <header className="header">
      <Link className="brand" to="/">
        <b>Ⓥ {companyName(site, lang)}</b>
        <small>{siteText(site, "tagline", lang, t("tagline"))}</small>
      </Link>
      <nav>
        <a href="#home">{t("navHome")}</a>
        <a href="#products">{t("navProducts")}</a>
        <a href="#about">{t("navAbout")}</a>
        <a href="#contact">{t("navContact")}</a>
      </nav>
      <div className="header-actions">
        <LangToggle />
        <a className="btn primary" href="#contact">
          {t("requestQuote")} {t("arrow")}
        </a>
      </div>
    </header>
  );
}

const emptyQuote = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  message: "",
};

function Home() {
  const { t, lang } = useLang();
  const [site, S] = useState({}),
    [products, P] = useState([]),
    [form, F] = useState(emptyQuote),
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
      await api("/api/quotes", {
        method: "POST",
        body: JSON.stringify(form),
      });
      M(t("quoteSent"));
      F(emptyQuote);
    } catch (e) {
      M(e.message);
    }
  }
  return (
    <>
      <Header site={site} />
      <section id="home" className="hero">
        <div>
          <span className="pill">{t("heroPill")}</span>
          <h1>{siteText(site, "heroTitle", lang, t("heroTitle"))}</h1>
          <p>{siteText(site, "heroSubtitle", lang, t("heroSubtitle"))}</p>
          <a className="btn white" href="#products">
            {t("exploreProducts")} {t("arrow")}
          </a>{" "}
          <a className="btn ghost" href="#contact">
            {t("requestQuote")}
          </a>
        </div>
        <div className="hero-img">
          {site.heroImage ? (
            <img src={imageUrl(site.heroImage)} alt={t("heroImageAlt")} />
          ) : (
            <h2>{t("heroFallback")}</h2>
          )}
        </div>
      </section>
      <section id="products" className="section">
        <span className="eyebrow">{t("catalogEyebrow")}</span>
        <h2>{t("ourProducts")}</h2>
        <p>{t("catalogDesc")}</p>
        <div className="grid">
          {products.map((p) => (
            <article className="card" key={p._id}>
              <div className="product-img">
                {p.image ? (
                  <img src={imageUrl(p.image)} alt={pick(p.name, lang)} />
                ) : (
                  <Boxes size={44} />
                )}
              </div>
              <div className="card-body">
                <small>
                  {pick({ en: p.category, ar: p.categoryAr }, lang)}
                </small>
                <h3>{pick(p.name, lang)}</h3>
                <p>{pick(p.description, lang)}</p>
                <a
                  href="#contact"
                  onClick={() =>
                    F((f) => ({ ...f, product: pick(p.name, lang) }))
                  }
                >
                  {t("viewDetails")} {t("arrow")}
                </a>
              </div>
            </article>
          ))}
        </div>
        {!products.length && <p>{t("noProducts")}</p>}
      </section>
      <section id="about" className="about">
        <span className="eyebrow">{t("aboutEyebrow")}</span>
        <h2>{t("aboutTitle")}</h2>
        <p>{siteText(site, "aboutText", lang, t("aboutText"))}</p>
      </section>
      <section id="contact" className="section contact">
        <div>
          <span className="eyebrow">{t("talkEyebrow")}</span>
          <h2>{t("requestQuote")}</h2>
          <p>{t("contactDesc")}</p>
          {site.contactEmail && <p dir="ltr">{site.contactEmail}</p>}
          {site.contactPhone && <p dir="ltr">{site.contactPhone}</p>}
        </div>
        <form onSubmit={send} className="form-grid">
          {[
            ["name", "fName"],
            ["company", "fCompany"],
            ["email", "fEmail"],
            ["phone", "fPhone"],
            ["product", "fProduct"],
          ].map(([n, l]) => (
            <label key={n}>
              {t(l)}
              <input
                name={n}
                value={form[n]}
                onChange={upd}
                required={n === "name" || n === "email"}
                type={n === "email" ? "email" : n === "phone" ? "tel" : "text"}
                dir={n === "email" || n === "phone" ? "ltr" : undefined}
              />
            </label>
          ))}
          <label className="full">
            {t("fMessage")}
            <textarea
              name="message"
              value={form.message}
              onChange={upd}
              required
              rows="4"
            />
          </label>
          <button className="btn primary">
            {t("sendRequest")} {t("arrow")}
          </button>
          {msg && <p>{msg}</p>}
        </form>
      </section>
      <footer>
        © {new Date().getFullYear()} {companyName(site, lang)}. {t("rights")}{" "}
        <Link to="/admin/login">{t("admin")}</Link>
      </footer>
    </>
  );
}

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
      ["/admin/content", "websiteContent", Settings],
      ["/admin/quotes", "quoteRequests", ClipboardList],
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
  category: "Gate Valves",
  categoryAr: "محابس بوابة",
  image: "",
  featured: false,
  active: true,
  options: {},
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
      N(t("productSaved"));
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
          <button className="btn primary" onClick={() => E(blank())}>
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
                E({
                  ...p,
                  categoryAr: p.categoryAr || "",
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
              <label>
                {t("categoryEn")}
                <input
                  dir="ltr"
                  value={edit.category || ""}
                  onChange={(e) => E({ ...edit, category: e.target.value })}
                />
              </label>
              <label>
                {t("categoryAr")}
                <input
                  dir="rtl"
                  value={edit.categoryAr || ""}
                  onChange={(e) => E({ ...edit, categoryAr: e.target.value })}
                />
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
                  <Upload size={15} /> {t("uploadImage")}{" "}
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
          {field("heroImage", "heroImageL", "ltr")}
          {field("contactEmail", "contactEmail", "ltr")}
          {field("contactPhone", "contactPhone", "ltr")}
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
                  <td>{q.product || t("generalEnquiry")}</td>
                  <td>{q.message}</td>
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
        <div className="loading">{t("loadingDashboard")}</div>
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
