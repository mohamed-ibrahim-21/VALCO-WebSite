import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Boxes, Minus, Plus, CheckCircle2 } from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { Header, SiteFooter, PageBanner } from "./Layout.jsx";
import { categoryImage } from "./catalog.js";

const emptyContact = { name: "", company: "", email: "", phone: "", message: "" };

export default function ProductPage() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const [product, setProduct] = useState(null),
    [loadError, setLoadError] = useState(""),
    [active, setActive] = useState(""),
    [choices, setChoices] = useState({}),
    [quantity, setQuantity] = useState(1),
    [contact, setContact] = useState(emptyContact),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false);

  useEffect(() => {
    api(`/api/products/slug/${encodeURIComponent(slug)}`)
      .then((p) => {
        setProduct(p);
        setActive(p.image || p.gallery?.[0] || (p.categorySlug ? categoryImage({ slug: p.categorySlug }) : ""));
      })
      .catch(() => setLoadError(t("productNotFound")));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loadError)
    return (
      <div className="site">
        <Header />
        <PageBanner title={t("navProducts")} crumbs={[[t("navHome"), "/"], [t("navProducts"), "/products"]]} />
        <section className="s-catalog site-wrap">
          <div className="empty-box">
            <p>{loadError}</p>
            <Link className="s-btn red sm" to="/products">
              {t("backToProducts")}
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  if (!product) return <div className="loading">{t("loading")}</div>;

  const images = [product.image, ...(product.gallery || [])].filter(
    (x, i, a) => x && a.indexOf(x) === i,
  );
  const groups = (product.optionGroups || []).filter((g) => g.values?.length);
  const specs = (product.specs || []).filter((s) => pick(s.label, lang));
  const name = pick(product.name, lang);

  function choose(gi, vi) {
    setChoices((c) => ({ ...c, [gi]: c[gi] === vi ? undefined : vi }));
    setError("");
  }
  function upd(e) {
    setContact({ ...contact, [e.target.name]: e.target.value });
  }
  async function submit(e) {
    e.preventDefault();
    const missing = groups.find((g, gi) => g.required && choices[gi] === undefined);
    if (missing) {
      setError(`${t("pleaseChoose")} ${pick(missing.name, lang)}`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      // Saved in English so the admin sees consistent values whatever language the customer used.
      const selections = groups
        .map((g, gi) =>
          choices[gi] === undefined
            ? null
            : {
                name: g.name.en || g.name.ar,
                value: g.values[choices[gi]].en || g.values[choices[gi]].ar,
              },
        )
        .filter(Boolean);
      await api("/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          ...contact,
          product: product.name.en,
          productId: product._id,
          quantity,
          selections,
        }),
      });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const categoryName = pick({ en: product.category, ar: product.categoryAr }, lang);
  const crumbs = [[t("navHome"), "/"], [t("navProducts"), "/products"]];
  if (product.categorySlug && categoryName) crumbs.push([categoryName, `/category/${product.categorySlug}`]);
  crumbs.push([name, null]);

  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("catalogEyebrow")} title={categoryName || t("navProducts")} crumbs={crumbs} />
      <section className="section product-page">
        <div className="pd-grid">
          <div className="pd-gallery">
            <div className="pd-main">
              {active ? <img src={imageUrl(active)} alt={name} /> : <Boxes size={60} />}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((src) => (
                  <button
                    type="button"
                    key={src}
                    className={src === active ? "on" : ""}
                    onClick={() => setActive(src)}
                  >
                    <img src={imageUrl(src)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <span className="eyebrow">
              {pick({ en: product.category, ar: product.categoryAr }, lang)}
            </span>
            <h1>{name}</h1>
            {product.sku && (
              <p className="pd-sku">
                {t("sku")}: <span dir="ltr">{product.sku}</span>
              </p>
            )}
            {pick(product.description, lang) && (
              <p className="pd-desc">{pick(product.description, lang)}</p>
            )}

            {sent ? (
              <div className="pd-sent">
                <CheckCircle2 size={36} />
                <h3>{t("requestSentTitle")}</h3>
                <p>{t("requestSentBody")}</p>
                <Link className="s-btn red sm" to="/products">
                  {t("backToProducts")}
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="pd-form">
                {groups.map((g, gi) => (
                  <fieldset key={gi} className="pd-group">
                    <legend>
                      {pick(g.name, lang)}
                      {g.required ? " *" : ` (${t("optional")})`}
                    </legend>
                    <div className="chips">
                      {g.values.map((v, vi) => (
                        <button
                          type="button"
                          key={vi}
                          className={choices[gi] === vi ? "chip on" : "chip"}
                          aria-pressed={choices[gi] === vi}
                          onClick={() => choose(gi, vi)}
                        >
                          {pick(v, lang)}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}

                <fieldset className="pd-group">
                  <legend>{t("quantity")}</legend>
                  <div className="qty">
                    <button
                      type="button"
                      aria-label="-"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                    />
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </fieldset>

                <h3 className="pd-contact-title">{t("yourDetails")}</h3>
                <div className="form-grid">
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
                        value={contact[n]}
                        onChange={upd}
                        required={n === "name" || n === "email"}
                        type={n === "email" ? "email" : n === "phone" ? "tel" : "text"}
                        dir={n === "email" || n === "phone" ? "ltr" : undefined}
                      />
                    </label>
                  ))}
                  <label className="full">
                    {t("extraNotes")}
                    <textarea
                      name="message"
                      rows="3"
                      value={contact.message}
                      onChange={upd}
                    />
                  </label>
                </div>
                {error && <p className="error">{error}</p>}
                <button className="btn primary pd-submit" disabled={busy}>
                  {busy ? t("sending") : `${t("requestQuote")} ${t("arrow")}`}
                </button>
              </form>
            )}
          </div>
        </div>

        {specs.length > 0 && (
          <div className="pd-specs">
            <h2>{t("specifications")}</h2>
            <table>
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i}>
                    <th>{pick(s.label, lang)}</th>
                    <td>{pick(s.value, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
