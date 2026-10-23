import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Globe, ChevronDown, Menu, X, Mail, Phone, ArrowRight } from "lucide-react";
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
  const { site, categories } = useCatalog();
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
          <h4>{t("navProducts")}</h4>
          {categories.map((c) => (
            <Link key={c._id} to={`/category/${c.slug}`}>
              {pick(c.name, lang)}
            </Link>
          ))}
        </div>
        <div>
          <h4>{t("contactInfo")}</h4>
          {site.contactEmail && (
            <a href={`mailto:${site.contactEmail}`} className="with-icon" dir="ltr">
              <Mail size={16} /> {site.contactEmail}
            </a>
          )}
          {site.contactPhone && (
            <a href={`tel:${site.contactPhone.replace(/\s+/g, "")}`} className="with-icon" dir="ltr">
              <Phone size={16} /> {site.contactPhone}
            </a>
          )}
          <Link to="/contact" className="footer-cta">
            {t("requestQuote")} <Arrow size={14} />
          </Link>
        </div>
      </div>
      <div className="site-wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {companyName(site, lang)}. {t("rights")}
        </span>
        <Link to="/admin/login">{t("admin")}</Link>
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
