import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Globe, ChevronDown, Menu, X, Mail, Phone, Smartphone, ArrowRight } from "lucide-react";
import { useLang, siteText, pick } from "./i18n.jsx";
import { useCatalog, heroImage } from "./catalog.js";

export function companyName(site, lang) {
  return siteText(site, "companyName", lang, site.companyName || "VALCO");
}

// Circled V mark, same as the favicon, with the V in brand red.
export function LogoMark({ size = 46, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13.6" fill="none" stroke={light ? "#fff" : "var(--s-navy)"} strokeWidth="2.6" />
      <path d="M10.4 9.6 L16 22.6 L21.6 9.6" fill="none" stroke="var(--s-red)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ site, light = false }) {
  const { t, lang } = useLang();
  return (
    <Link className={light ? "logo light" : "logo"} to="/">
      <LogoMark light={light} />
      <span className="logo-text">
        <b>{companyName(site, lang)}</b>
        <small>{siteText(site, "tagline", lang, t("tagline"))}</small>
      </span>
    </Link>
  );
}

const tel = (n) => `tel:${String(n).replace(/[^\d+]/g, "")}`;

// Landline, mobile and email from the admin "Website content" page; empty ones are hidden.
export function ContactList({ site, size = 18, labels = true }) {
  const { t } = useLang();
  const rows = [
    [Phone, "landline", site.contactLandline, tel],
    [Smartphone, "mobile", site.contactPhone, tel],
    [Mail, "email", site.contactEmail, (v) => `mailto:${v}`],
  ].filter(([, , v]) => v?.trim());
  if (!rows.length) return null;
  return (
    <ul className="contact-list">
      {rows.map(([Icon, k, v, href]) => (
        <li key={k}>
          <Icon size={size} />
          <span>
            {labels && <small>{t(k)}</small>}
            <a href={href(v.trim())} dir="ltr">
              {v.trim()}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

const ICONS = {
  facebookUrl: <path d="M14 8.6V6.9c0-.8.2-1.3 1.4-1.3H17V2.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v1.7H7.6v3.2h2.7V21h3.4v-9.2h2.8l.4-3.2H14z" />,
  instagramUrl: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  tiktokUrl: <path d="M16.2 2.5c.4 2.4 1.9 4 4.3 4.2v3.3c-1.6 0-3-.5-4.3-1.3v6.7a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.4a2.7 2.7 0 1 0 1.8 2.5V2.5h3.2z" />,
  xUrl: <path d="M17.6 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.2 21H2.1l7.3-8.3L1.7 3H8l4.4 5.8L17.6 3zm-1.1 16.2h1.7L7.4 4.7H5.6l10.9 14.5z" />,
  linkedinUrl: <path d="M4 9h3.6v11.5H4V9zm1.8-5.8a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2zM10 9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.7 0 4.3 2.4 4.3 5.5v6.3h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H10V9z" />,
};
export const SOCIAL = [
  ["facebookUrl", "Facebook"],
  ["instagramUrl", "Instagram"],
  ["tiktokUrl", "TikTok"],
  ["xUrl", "X"],
  ["linkedinUrl", "LinkedIn"],
];
const fullUrl = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);

// Social accounts set in the admin panel; accounts without a link are hidden.
export function SocialLinks({ site, withNames = false }) {
  const list = SOCIAL.filter(([k]) => site[k]?.trim());
  if (!list.length) return null;
  return (
    <div className={withNames ? "social-links named" : "social-links"}>
      {list.map(([k, name]) => (
        <a key={k} href={fullUrl(site[k].trim())} target="_blank" rel="noreferrer" aria-label={name} title={name}>
          <span className="social-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              {ICONS[k]}
            </svg>
          </span>
          {withNames && <span>{name}</span>}
        </a>
      ))}
    </div>
  );
}

// Arrow that points the reading direction (flips in Arabic).
export const Arrow = ({ size = 16 }) => <ArrowRight size={size} className="dir-arrow" />;

function LangMenu() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  return (
    <div className="lang-menu" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Globe size={18} />
        {lang === "ar" ? "AR" : "EN"}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="menu-pop">
          {[
            ["en", "English"],
            ["ar", "العربية"],
          ].map(([code, label]) => (
            <button
              type="button"
              key={code}
              className={lang === code ? "on" : ""}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Section links start with "/" so they also work from other pages.
export function Header() {
  const { t, lang } = useLang();
  const { site, categories } = useCatalog();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname, hash]);
  // New page: start at the top (homepage links with #section scroll themselves).
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  const onProducts = pathname.startsWith("/products") || pathname.startsWith("/category");
  const current = onProducts ? "products" : pathname === "/" ? "home" : pathname.slice(1);
  const link = (id, label) => (
    <Link to={id === "home" ? "/" : `/${id}`} className={current === id ? "active" : ""}>
      {t(label)}
    </Link>
  );

  return (
    <header className="site-header">
      <div className="site-wrap header-row">
        <Logo site={site} />
        <nav className={open ? "site-nav open" : "site-nav"}>
          {link("home", "navHome")}
          {link("about", "navAbout")}
          <div className="nav-drop">
            <Link to="/products" className={current === "products" ? "active" : ""}>
              {t("navProducts")} <ChevronDown size={14} />
            </Link>
            <div className="menu-pop drop-list">
              {categories.map((c) => (
                <Link key={c._id} to={`/category/${c.slug}`}>
                  {pick(c.name, lang)}
                </Link>
              ))}
              <Link to="/products" className="drop-all">
                {t("viewAllProducts")} <Arrow size={14} />
              </Link>
            </div>
          </div>
          {link("services", "navServices")}
          {link("contact", "navContact")}
          <Link to="/contact" className="btn-quote mobile-only">
            <Search size={17} /> {t("getQuote")}
          </Link>
        </nav>
        <div className="header-tools">
          <Link to="/contact" className="btn-quote">
            <Search size={17} /> {t("getQuote")}
          </Link>
          <LangMenu />
          <button
            type="button"
            className="burger"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t, lang } = useLang();
  const { site } = useCatalog();
  return (
    <footer className="site-footer">
      <div className="site-wrap footer-grid">
        <div>
          <Logo site={site} light />
          <p className="footer-about">{t("footerAbout")}</p>
        </div>
        <div>
          <h4>{t("quickLinks")}</h4>
          <Link to="/">{t("navHome")}</Link>
          <Link to="/about">{t("navAbout")}</Link>
          <Link to="/products">{t("navProducts")}</Link>
          <Link to="/services">{t("navServices")}</Link>
          <Link to="/contact">{t("navContact")}</Link>
        </div>
        <div>
          <h4>{t("socialMedia")}</h4>
          <SocialLinks site={site} withNames />
        </div>
        <div>
          <h4>{t("contactInfo")}</h4>
          <ContactList site={site} size={16} />
          <Link to="/contact" className="footer-cta">
            {t("requestQuote")} <Arrow size={14} />
          </Link>
        </div>
      </div>
      <div className="site-wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {companyName(site, lang)}. {t("rights")}
        </span>
        <span className="footer-credit">Evildeal</span>
      </div>
    </footer>
  );
}

// Dark title band used at the top of inner pages.
export function PageBanner({ eyebrow, title, crumbs = [] }) {
  const { site } = useCatalog();
  return (
    <section className="page-banner" style={{ "--banner-img": `url("${heroImage(site)}")` }}>
      <div className="site-wrap">
        {eyebrow && <span className="s-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {crumbs.length > 0 && (
          <nav className="crumbs">
            {crumbs.map(([label, to], i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                {to ? <Link to={to}>{label}</Link> : <b>{label}</b>}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
