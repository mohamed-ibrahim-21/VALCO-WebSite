import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Gem, Settings, Truck, UsersRound } from "lucide-react";
import { useLang, pick, siteText } from "./i18n.jsx";
import { Header, SiteFooter, Arrow } from "./Layout.jsx";
import { useCatalog, categoryImage, heroImage } from "./catalog.js";
import { AboutBand, ServicesStrip, QuoteSection } from "./Sections.jsx";

// Headline = title + highlighted (red) words. Arabic falls back to the built-in
// Arabic defaults until an Arabic title is written in the admin panel.
function heroHeadline(site, lang, t) {
  if (lang === "ar") {
    if (site.heroTitleAr?.trim()) return [site.heroTitleAr, site.heroHighlightAr || ""];
    return [t("heroTitle"), t("heroHighlight")];
  }
  if (site.heroTitle === undefined) return [t("heroTitle"), t("heroHighlight")];
  return [site.heroTitle, site.heroHighlight || ""];
}

export default function Home() {
  const { t, lang } = useLang();
  const { site, categories, ready, error } = useCatalog();
  // Arriving from another page with /#section: scroll once content has rendered.
  useEffect(() => {
    if (!ready || !location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [ready]);

  const [title, highlight] = heroHeadline(site, lang, t);
  const heroFeatures = [
    [Gem, "fQuality"],
    [Settings, "fBrands"],
    [Truck, "fOnTime"],
    [UsersRound, "fSupport"],
  ];
  return (
    <div className="site">
      <Header />

      {/* ---------- Hero ---------- */}
      <section id="home" className="s-hero">
        <div className="hero-art" aria-hidden="true">
          <div className="hero-photo" style={{ backgroundImage: `url("${heroImage(site)}")` }} />
          <div className="hero-stripe" />
        </div>
        <div className="site-wrap hero-inner">
          <span className="s-eyebrow">{t("heroPill")}</span>
          <h1>
            {title} {highlight && <span className="hl">{highlight}</span>}
          </h1>
          <p className="hero-sub">{siteText(site, "heroSubtitle", lang, t("heroSubtitle"))}</p>
          <div className="hero-btns">
            <Link to="/products" className="s-btn red">
              {t("ourProductsBtn")} <Arrow />
            </Link>
            <Link to="/contact" className="s-btn outline">
              {t("navContact")}
            </Link>
          </div>
          <div className="hero-feats">
            {heroFeatures.map(([Icon, k]) => (
              <div key={k}>
                <Icon size={30} strokeWidth={1.6} />
                <span>{t(k)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Product categories ---------- */}
      <section id="products" className="s-products">
        <div className="site-wrap products-row">
          <div className="products-intro">
            <span className="s-eyebrow">{t("catalogEyebrow")}</span>
            <h2>{t("productsTitle")}</h2>
            <p>{t("homeProductsDesc")}</p>
            <Link to="/products" className="s-btn red sm">
              {t("viewAllProducts")} <Arrow size={14} />
            </Link>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c._id} to={`/category/${c.slug}`} className="cat-card">
                <div className="cat-img">
                  <img src={categoryImage(c)} alt={pick(c.name, lang)} loading="lazy" />
                </div>
                <h3>{pick(c.name, lang)}</h3>
                <span className="cat-link">
                  {t("viewDetails")} <Arrow size={13} />
                </span>
              </Link>
            ))}
            {ready && !categories.length && <p className="s-soft">{error || t("noProducts")}</p>}
          </div>
        </div>
      </section>

      <AboutBand id="about" />
      <ServicesStrip id="services" />
      <QuoteSection id="contact" />

      <SiteFooter />
    </div>
  );
}
