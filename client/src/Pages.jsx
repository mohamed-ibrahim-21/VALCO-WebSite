import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Gem,
  Settings,
  Truck,
  UsersRound,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Image as ImageIcon,
  Download,
  ExternalLink,
} from "lucide-react";
import { api, API_BASE } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { Header, SiteFooter, PageBanner, Arrow } from "./Layout.jsx";
import { AboutSplit, QuoteSection, CtaBand } from "./Sections.jsx";
import { SERVICES, INDUSTRIES } from "./content.js";

export function AboutPage() {
  const { t } = useLang();
  const why = [
    [Gem, "fQuality", "why1"],
    [Settings, "fBrands", "why2"],
    [Truck, "fOnTime", "why3"],
    [UsersRound, "fSupport", "why4"],
  ];
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("aboutUsEyebrow")} title={t("navAbout")} crumbs={[[t("navHome"), "/"], [t("navAbout"), null]]} />

      <AboutSplit />

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
          <div className="sec-head">
            <div>
              <span className="s-eyebrow">{t("industriesEyebrow")}</span>
              <h2 className="s-title">{t("industriesTitle")}</h2>
            </div>
            <Link to="/industries" className="head-link">
              {t("viewAllIndustries")} <Arrow size={14} />
            </Link>
          </div>
          <div className="ind-tiles">
            {INDUSTRIES.map(([id, Icon, k]) => (
              <Link key={id} to={`/industries#${id}`} className="ind-tile">
                <Icon size={34} strokeWidth={1.5} />
                <b>{t(k)}</b>
              </Link>
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
          {SERVICES.map(([id, Icon, k, , long], i) => (
            <div key={id} id={id} className="svc-big">
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

export function IndustriesPage() {
  const { t } = useLang();
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("industriesEyebrow")} title={t("navIndustries")} crumbs={[[t("navHome"), "/"], [t("navIndustries"), null]]} />
      <section className="site-wrap page-block">
        <div className="block-head">
          <h2 className="s-title">{t("industriesTitle")}</h2>
          <p className="s-soft">{t("industriesDesc")}</p>
        </div>
        <div className="ind-cards">
          {INDUSTRIES.map(([id, Icon, k, d, prods]) => (
            <article key={id} id={id} className="ind-card">
              <span className="ind-icon">
                <Icon size={34} strokeWidth={1.5} />
              </span>
              <h3>{t(k)}</h3>
              <p>{t(d)}</p>
              <div className="ind-tags">
                {t(prods)
                  .split("|")
                  .map((p) => (
                    <span key={p}>{p.trim()}</span>
                  ))}
              </div>
              <Link to={`/contact?product=${encodeURIComponent(t(k))}`} className="cat-link">
                {t("requestQuote")} <Arrow size={13} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
      <SiteFooter />
    </div>
  );
}

const fileIcon = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();
  if (["xls", "xlsx"].includes(ext)) return FileSpreadsheet;
  if (ext === "zip") return FileArchive;
  if (["jpg", "jpeg", "png"].includes(ext)) return ImageIcon;
  return FileText;
};
export const fileSize = (n = 0) =>
  n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
export const fileUrl = (d, download) =>
  `${API_BASE}/api/downloads/${d._id}/file${download ? "?download=1" : ""}`;

export function DownloadsPage() {
  const { t, lang } = useLang();
  const [files, setFiles] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    api("/api/downloads")
      .then(setFiles)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("downloadsEyebrow")} title={t("navDownloads")} crumbs={[[t("navHome"), "/"], [t("navDownloads"), null]]} />
      <section className="site-wrap page-block">
        <div className="block-head">
          <h2 className="s-title">{t("downloadsTitle")}</h2>
          <p className="s-soft">{t("downloadsDesc")}</p>
        </div>
        {error && <p className="error">{error}</p>}
        {!files && !error && <p className="s-soft">{t("loading")}</p>}
        {files && files.length === 0 && (
          <div className="empty-box">
            <FileText size={48} strokeWidth={1.3} />
            <p>{t("noDownloads")}</p>
            <Link to="/contact" className="s-btn red sm">
              {t("navContact")} <Arrow size={14} />
            </Link>
          </div>
        )}
        {files && files.length > 0 && (
          <div className="dl-list">
            {files.map((d) => {
              const Icon = fileIcon(d.filename);
              const ext = d.filename.split(".").pop().toUpperCase();
              return (
                <article key={d._id} className="dl-card">
                  <span className="dl-icon">
                    <Icon size={30} strokeWidth={1.5} />
                    <small>{ext}</small>
                  </span>
                  <div className="dl-body">
                    <h3>{pick(d.title, lang) || d.filename}</h3>
                    {pick(d.description, lang) && <p>{pick(d.description, lang)}</p>}
                    <small dir="ltr">
                      {ext} · {fileSize(d.size)}
                    </small>
                  </div>
                  <div className="dl-actions">
                    {ext === "PDF" && (
                      <a href={fileUrl(d)} target="_blank" rel="noreferrer" className="s-btn ghost sm">
                        <ExternalLink size={15} /> {t("view")}
                      </a>
                    )}
                    <a href={fileUrl(d, true)} className="s-btn red sm">
                      <Download size={15} /> {t("download")}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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
