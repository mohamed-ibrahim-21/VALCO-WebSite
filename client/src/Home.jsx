import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Settings, UsersRound, Factory } from "lucide-react";
import { useLang, pick, siteText } from "./i18n.jsx";
import { Header, SiteFooter, Arrow, Marked } from "./Layout.jsx";
import { useCatalog, categoryImage, heroImage, categoryLink } from "./catalog.js";
import { AboutSplit, ServicesStrip, IndustriesStrip, QuoteSection } from "./Sections.jsx";

// Headline: *starred* words are red; heroHighlight (older setting) is added in red at the end.
// Arabic falls back to the built-in Arabic headline until one is written in the admin panel.
function heroHeadline(site, lang, t) {
  if (lang === "ar") {
    if (site.heroTitleAr?.trim()) return [site.heroTitleAr, site.heroHighlightAr || ""];
    return [t("heroTitle"), ""];
  }
  if (!site.heroTitle?.trim()) return [t("heroTitle"), ""];
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
  const mains = categories.filter((c) => !c.parent);
  const feats = [
    [ShieldCheck, "fb1"],
    [Settings, "fb2"],
    [UsersRound, "fb3"],
    [Factory, "fb4"],
  ];

  return (
    <div className="site">
      <Header />

      {/* ---------- Hero ---------- */}
      <section id="home" className="h-hero">
        <div className="h-art" aria-hidden="true">
          <div className="h-photo" style={{ backgroundImage: `url("${heroImage(site)}")` }} />
          <div className="h-streak a" />
          <div className="h-streak b" />
        </div>
        <div className="site-wrap h-inner">
          <p className="h-kicker">
            <span>{t("heroKicker1")}</span>
            <span>{t("heroKicker2")}</span>
          </p>
          <h1>
            <Marked text={title} /> {highlight && <span className="hl">{highlight}</span>}
          </h1>
          <p className="h-sub">{siteText(site, "heroSubtitle", lang, t("heroSubtitle"))}</p>
          <div className="hero-btns">
            <Link to="/products" className="s-btn red lg">
              {t("ourProductsBtn")} <Arrow />
            </Link>
            <Link to="/contact" className="s-btn outline lg">
              {t("navContact")} <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <div className="feat-bar">
        <div className="site-wrap feat-row">
          {feats.map(([Icon, k]) => (
            <div key={k} className="feat">
              <Icon size={40} strokeWidth={1.4} />
              <span>{t(k)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Product categories ---------- */}
      <section id="products" className="h-cats">
        <div className="site-wrap">
          <div className="sec-head">
            <div>
              <span className="s-eyebrow">{t("catalogEyebrow")}</span>
              <h2 className="sec-title">{t("productCategories")}</h2>
            </div>
            <Link to="/products" className="head-link">
              {t("viewAllProducts")} <Arrow size={14} />
            </Link>
          </div>
          <div className="pc-grid">
            {mains.map((c) => (
              <Link key={c._id} to={categoryLink(c)} className="pc-card">
                <div className="pc-img">
                  <img src={categoryImage(c)} alt={pick(c.name, lang)} loading="lazy" />
                </div>
                <div className="pc-foot">
                  <h3>{pick(c.name, lang)}</h3>
                  <Arrow size={18} />
                </div>
              </Link>
            ))}
            {ready && !mains.length && <p className="s-soft">{error || t("noProducts")}</p>}
          </div>
        </div>
      </section>

      <AboutSplit id="about" />
      <ServicesStrip id="services" />
      <IndustriesStrip id="industries" />
      <QuoteSection id="contact" />

      <SiteFooter />
    </div>
  );
}
