import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gem,
  Settings,
  Truck,
  UsersRound,
  ShieldCheck,
  BarChart3,
  Package,
  HardHat,
  Wrench,
  Headset,
  Mail,
  Phone,
} from "lucide-react";
import { api } from "./api";
import { useLang, pick, siteText } from "./i18n.jsx";
import { Header, SiteFooter, Arrow } from "./Layout.jsx";
import { useCatalog, categoryImage, heroImage, aboutImage } from "./catalog.js";

const emptyQuote = { name: "", company: "", email: "", phone: "", product: "", message: "" };

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
  const [form, setForm] = useState(emptyQuote),
    [msg, setMsg] = useState({ ok: false, text: "" }),
    [busy, setBusy] = useState(false);

  // Arriving from another page with /#section: scroll once content has rendered.
  useEffect(() => {
    if (!ready || !location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [ready]);

  const [title, highlight] = heroHeadline(site, lang, t);
  const upd = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function send(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/quotes", { method: "POST", body: JSON.stringify(form) });
      setMsg({ ok: true, text: t("quoteSent") });
      setForm(emptyQuote);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const heroFeatures = [
    [Gem, "fQuality"],
    [Settings, "fBrands"],
    [Truck, "fOnTime"],
    [UsersRound, "fSupport"],
  ];
  const aboutFeatures = [
    [Settings, "aWide", "aWideD"],
    [ShieldCheck, "aQuality", "aQualityD"],
    [UsersRound, "aSupport", "aSupportD"],
    [BarChart3, "aSupply", "aSupplyD"],
  ];
  const services = [
    [Package, "s1", "s1d"],
    [HardHat, "s2", "s2d"],
    [Wrench, "s3", "s3d"],
    [Headset, "s4", "s4d"],
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
            <a href="#contact" className="s-btn outline">
              {t("navContact")}
            </a>
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
            {ready && !categories.length && <p className="muted">{error || t("noProducts")}</p>}
          </div>
        </div>
      </section>

      {/* ---------- About ---------- */}
      <section id="about" className="s-about">
        <div className="about-text">
          <span className="s-eyebrow">{t("aboutEyebrow")}</span>
          <h2>{t("aboutTitle")}</h2>
          <p>{siteText(site, "aboutText", lang, t("aboutText"))}</p>
          <a href="#services" className="s-btn red sm">
            {t("learnMore")} <Arrow size={14} />
          </a>
        </div>
        <div className="about-art" aria-hidden="true">
          <div className="about-photo" style={{ backgroundImage: `url("${aboutImage(site)}")` }} />
          <div className="about-stripe" />
        </div>
        <ul className="about-feats">
          {aboutFeatures.map(([Icon, k, d]) => (
            <li key={k}>
              <Icon size={30} strokeWidth={1.7} />
              <div>
                <b>{t(k)}</b>
                <small>{t(d)}</small>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Services ---------- */}
      <section id="services" className="s-services">
        <div className="site-wrap services-row">
          <div className="services-intro">
            <span className="s-eyebrow">{t("servicesEyebrow")}</span>
            <h2>{t("servicesTitle")}</h2>
            <p>{t("servicesDesc")}</p>
          </div>
          <div className="svc-grid">
            {services.map(([Icon, k, d]) => (
              <div key={k} className="svc-card">
                <span className="svc-icon">
                  <Icon size={26} strokeWidth={1.7} />
                </span>
                <div>
                  <h3>{t(k)}</h3>
                  <p>{t(d)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact / general quote ---------- */}
      <section id="contact" className="s-contact">
        <div className="site-wrap contact-row">
          <div className="contact-card">
            <span className="s-eyebrow">{t("talkEyebrow")}</span>
            <h2>{t("requestQuote")}</h2>
            <p>{t("contactDesc")}</p>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="with-icon" dir="ltr">
                <Mail size={18} /> {site.contactEmail}
              </a>
            )}
            {site.contactPhone && (
              <a href={`tel:${site.contactPhone.replace(/\s+/g, "")}`} className="with-icon" dir="ltr">
                <Phone size={18} /> {site.contactPhone}
              </a>
            )}
          </div>
          <form onSubmit={send} className="form-grid contact-form">
            {[
              ["name", "fName"],
              ["company", "fCompany"],
              ["email", "fEmail"],
              ["phone", "fPhone"],
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
              {t("fProduct")}
              <select name="product" value={form.product} onChange={upd}>
                <option value="">{t("generalEnquiry")}</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name.en}>
                    {pick(c.name, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="full">
              {t("fMessage")}
              <textarea name="message" value={form.message} onChange={upd} required rows="4" />
            </label>
            <div className="full form-foot">
              <button className="s-btn red" disabled={busy}>
                {busy ? t("sending") : t("sendRequest")} <Arrow />
              </button>
              {msg.text && <p className={msg.ok ? "success" : "error"}>{msg.text}</p>}
            </div>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
