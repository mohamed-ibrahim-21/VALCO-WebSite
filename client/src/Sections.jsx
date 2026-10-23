import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Settings, UsersRound, ShieldCheck, BarChart3, Package, Factory, Headset } from "lucide-react";
import { api } from "./api";
import { useLang, pick, siteText } from "./i18n.jsx";
import { Arrow, ContactList, SocialLinks, Marked } from "./Layout.jsx";
import { SERVICES, INDUSTRIES } from "./content.js";
import { useCatalog, aboutImage } from "./catalog.js";

// Sections shared by the homepage and the About / Services / Contact pages.

const STAT_ICONS = [Package, UsersRound, Factory, Headset];

// Image, "About us" text and the numbers cards (homepage and About page).
export function AboutSplit({ id }) {
  const { t, lang } = useLang();
  const { site } = useCatalog();
  const stats = (site.stats || [])
    .map((s, i) => ({ ...s, Icon: STAT_ICONS[i] || Package }))
    .filter((s) => s.value?.trim());
  return (
    <section id={id} className={stats.length ? "about-split" : "about-split no-stats"}>
      <div className="split-photo" aria-hidden="true">
        <div style={{ backgroundImage: `url("${aboutImage(site)}")` }} />
      </div>
      <div className="split-text">
        <span className="s-eyebrow">{t("aboutUsEyebrow")}</span>
        <h2 className="sec-title">
          <Marked text={t("aboutTitle2")} />
        </h2>
        <p>{siteText(site, "aboutText", lang, t("aboutText"))}</p>
        <Link to="/about" className="s-btn red sm">
          {t("learnMore")} <Arrow size={14} />
        </Link>
      </div>
      {stats.length > 0 && (
        <div className="stat-grid">
          {stats.map(({ value, label, Icon }, i) => (
            <div key={i} className="stat-card">
              <Icon size={34} strokeWidth={1.5} />
              <div>
                <b dir="ltr">{value}</b>
                <small>{pick(label, lang)}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Compact industries row for the homepage.
export function IndustriesStrip({ id }) {
  const { t } = useLang();
  return (
    <section id={id} className="ind-strip">
      <div className="site-wrap">
        <div className="sec-head">
          <div>
            <span className="s-eyebrow">{t("industriesEyebrow")}</span>
            <h2 className="sec-title">{t("industriesTitle")}</h2>
          </div>
          <Link to="/industries" className="head-link">
            {t("viewAllIndustries")} <Arrow size={14} />
          </Link>
        </div>
        <div className="ind-tiles">
          {INDUSTRIES.map(([iid, Icon, k]) => (
            <Link key={iid} to={`/industries#${iid}`} className="ind-tile">
              <Icon size={34} strokeWidth={1.5} />
              <b>{t(k)}</b>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutBand({ id, showButton = true }) {
  const { t, lang } = useLang();
  const { site } = useCatalog();
  const feats = [
    [Settings, "aWide", "aWideD"],
    [ShieldCheck, "aQuality", "aQualityD"],
    [UsersRound, "aSupport", "aSupportD"],
    [BarChart3, "aSupply", "aSupplyD"],
  ];
  return (
    <section id={id} className="s-about">
      <div className="about-text">
        <span className="s-eyebrow">{t("aboutEyebrow")}</span>
        <h2>{t("aboutTitle")}</h2>
        <p>{siteText(site, "aboutText", lang, t("aboutText"))}</p>
        {showButton && (
          <Link to="/about" className="s-btn red sm">
            {t("learnMore")} <Arrow size={14} />
          </Link>
        )}
      </div>
      <div className="about-art" aria-hidden="true">
        <div className="about-photo" style={{ backgroundImage: `url("${aboutImage(site)}")` }} />
        <div className="about-stripe" />
      </div>
      <ul className="about-feats">
        {feats.map(([Icon, k, d]) => (
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
  );
}

export function ServicesStrip({ id }) {
  const { t } = useLang();
  return (
    <section id={id} className="s-services">
      <div className="site-wrap services-row">
        <div className="services-intro">
          <span className="s-eyebrow">{t("servicesEyebrow")}</span>
          <h2 className="sec-title">{t("servicesTitle")}</h2>
          <p>{t("servicesDesc")}</p>
          <Link to="/services" className="s-btn red sm">
            {t("learnMore")} <Arrow size={14} />
          </Link>
        </div>
        <div className="svc-grid">
          {SERVICES.map(([sid, Icon, k, d]) => (
            <Link key={k} to={`/services#${sid}`} className="svc-card">
              <span className="svc-icon">
                <Icon size={26} strokeWidth={1.7} />
              </span>
              <div>
                <h3>{t(k)}</h3>
                <p>{t(d)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const emptyQuote = { name: "", company: "", email: "", phone: "", product: "", message: "" };

export function QuoteSection({ id }) {
  const { t, lang } = useLang();
  const { site, categories } = useCatalog();
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => ({ ...emptyQuote, product: params.get("product") || "" })),
    [msg, setMsg] = useState({ ok: false, text: "" }),
    [busy, setBusy] = useState(false);

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

  return (
    <section id={id} className="s-contact">
      <div className="site-wrap contact-row">
        <div className="contact-card">
          <span className="s-eyebrow">{t("talkEyebrow")}</span>
          <h2>{t("requestQuote")}</h2>
          <p>{t("contactDesc")}</p>
          <ContactList site={site} />
          <SocialLinks site={site} />
          <ol className="next-steps">
            <li>{t("next1")}</li>
            <li>{t("next2")}</li>
            <li>{t("next3")}</li>
          </ol>
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
  );
}

// Red call-to-action strip at the bottom of inner pages.
export function CtaBand() {
  const { t } = useLang();
  return (
    <section className="cta-band">
      <div className="site-wrap cta-row">
        <div>
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaText")}</p>
        </div>
        <Link to="/contact" className="s-btn outline">
          {t("requestQuote")} <Arrow />
        </Link>
      </div>
    </section>
  );
}
