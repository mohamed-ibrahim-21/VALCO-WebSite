import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Settings,
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
import { Arrow } from "./Layout.jsx";
import { useCatalog, aboutImage } from "./catalog.js";

// Sections shared by the homepage and the About / Services / Contact pages.

export const SERVICES = [
  [Package, "s1", "s1d", "s1long"],
  [HardHat, "s2", "s2d", "s2long"],
  [Wrench, "s3", "s3d", "s3long"],
  [Headset, "s4", "s4d", "s4long"],
];

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
          <h2>{t("servicesTitle")}</h2>
          <p>{t("servicesDesc")}</p>
          <Link to="/services" className="s-btn red sm">
            {t("learnMore")} <Arrow size={14} />
          </Link>
        </div>
        <div className="svc-grid">
          {SERVICES.map(([Icon, k, d]) => (
            <Link key={k} to="/services" className="svc-card">
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
