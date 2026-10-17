import React from "react";
import { Link } from "react-router-dom";
import { useLang, siteText, LangToggle } from "./i18n.jsx";

export function companyName(site, lang) {
  return siteText(site, "companyName", lang, site.companyName || "VALCO");
}

// Section links start with "/" so they also work from a product page.
export function Header({ site }) {
  const { t, lang } = useLang();
  return (
    <header className="header">
      <Link className="brand" to="/">
        <b>Ⓥ {companyName(site, lang)}</b>
        <small>{siteText(site, "tagline", lang, t("tagline"))}</small>
      </Link>
      <nav>
        <a href="/#home">{t("navHome")}</a>
        <a href="/#products">{t("navProducts")}</a>
        <a href="/#about">{t("navAbout")}</a>
        <a href="/#contact">{t("navContact")}</a>
      </nav>
      <div className="header-actions">
        <LangToggle />
        <a className="btn primary" href="/#contact">
          {t("requestQuote")} {t("arrow")}
        </a>
      </div>
    </header>
  );
}

export function SiteFooter({ site }) {
  const { t, lang } = useLang();
  return (
    <footer>
      © {new Date().getFullYear()} {companyName(site, lang)}. {t("rights")}{" "}
      <Link to="/admin/login">{t("admin")}</Link>
    </footer>
  );
}
