import React from "react";
import { Gem, Settings, Truck, UsersRound, Flame, FlaskConical, Zap, Droplets } from "lucide-react";
import { useLang, siteText } from "./i18n.jsx";
import { Header, SiteFooter, PageBanner } from "./Layout.jsx";
import { useCatalog, aboutImage } from "./catalog.js";
import { AboutBand, QuoteSection, CtaBand, SERVICES } from "./Sections.jsx";

export function AboutPage() {
  const { t, lang } = useLang();
  const { site } = useCatalog();
  const why = [
    [Gem, "fQuality", "why1"],
    [Settings, "fBrands", "why2"],
    [Truck, "fOnTime", "why3"],
    [UsersRound, "fSupport", "why4"],
  ];
  const industries = [
    [Flame, "ind1"],
    [FlaskConical, "ind2"],
    [Zap, "ind3"],
    [Droplets, "ind4"],
  ];
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("aboutEyebrow")} title={t("navAbout")} crumbs={[[t("navHome"), "/"], [t("navAbout"), null]]} />

      <section className="site-wrap intro-row">
        <div>
          <span className="s-eyebrow">{t("whoWeAre")}</span>
          <h2 className="s-title">{t("whoTitle")}</h2>
          <p className="lead">{siteText(site, "aboutText", lang, t("aboutText"))}</p>
          <p className="s-soft">{t("about2")}</p>
        </div>
        <div className="intro-photo">
          <img src={aboutImage(site)} alt="" />
        </div>
      </section>

      <AboutBand showButton={false} />

      <section className="site-wrap page-block">
        <div className="block-head">
          <span className="s-eyebrow">{t("whyEyebrow")}</span>
          <h2 className="s-title">{t("whyTitle")}</h2>
        </div>
        <div className="feature-grid">
          {why.map(([Icon, k, d]) => (
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
      </section>

      <section className="industries">
        <div className="site-wrap">
          <div className="block-head">
            <span className="s-eyebrow">{t("industriesEyebrow")}</span>
            <h2 className="s-title">{t("industriesTitle")}</h2>
          </div>
          <div className="industry-grid">
            {industries.map(([Icon, k]) => (
              <div key={k} className="industry">
                <Icon size={34} strokeWidth={1.6} />
                <b>{t(k)}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </div>
  );
}

export function ServicesPage() {
  const { t } = useLang();
  const steps = ["step1", "step2", "step3", "step4"];
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("servicesEyebrow")} title={t("navServices")} crumbs={[[t("navHome"), "/"], [t("navServices"), null]]} />

      <section className="site-wrap page-block">
        <div className="block-head">
          <h2 className="s-title">{t("servicesTitle")}</h2>
          <p className="s-soft">{t("servicesDesc")}</p>
        </div>
        <div className="svc-big-grid">
          {SERVICES.map(([Icon, k, , long], i) => (
            <div key={k} className="svc-big">
              <span className="svc-num">0{i + 1}</span>
              <span className="svc-icon">
                <Icon size={28} strokeWidth={1.7} />
              </span>
              <h3>{t(k)}</h3>
              <p>{t(long)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="industries">
        <div className="site-wrap">
          <div className="block-head">
            <span className="s-eyebrow">{t("howEyebrow")}</span>
            <h2 className="s-title">{t("howTitle")}</h2>
          </div>
          <ol className="steps">
            {steps.map((k, i) => (
              <li key={k}>
                <span className="step-dot">{i + 1}</span>
                <b>{t(k)}</b>
                <p>{t(`${k}d`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </div>
  );
}

export function ContactPage() {
  const { t } = useLang();
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("talkEyebrow")} title={t("navContact")} crumbs={[[t("navHome"), "/"], [t("navContact"), null]]} />
      <QuoteSection />
      <SiteFooter />
    </div>
  );
}
