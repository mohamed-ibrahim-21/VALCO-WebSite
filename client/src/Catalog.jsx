import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Boxes } from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { Header, SiteFooter, PageBanner, Arrow } from "./Layout.jsx";
import { useCatalog, categoryImage, categoryLink } from "./catalog.js";

// All products (/products) or one category (/category/:slug).
export default function Catalog() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const { t, lang } = useLang();
  const { categories, ready } = useCatalog();
  const [products, setProducts] = useState(null),
    [error, setError] = useState("");

  useEffect(() => {
    setProducts(null);
    setError("");
    api(slug ? `/api/products?category=${encodeURIComponent(slug)}` : "/api/products")
      .then(setProducts)
      .catch((e) => setError(e.message));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const category = slug ? categories.find((c) => c.slug === slug) : null;
  // Main category of the page (a sub-category belongs to its parent's tab).
  const main = category?.parent ? categories.find((c) => c.slug === category.parent) : category;
  const mains = categories.filter((c) => !c.parent);
  const subs = main ? categories.filter((c) => c.parent === main.slug) : [];
  const title = q ? t("searchResults") : category ? pick(category.name, lang) : t("ourProducts");
  const crumbs = [[t("navHome"), "/"], [t("navProducts"), category || q ? "/products" : null]];
  if (main && main !== category) crumbs.push([pick(main.name, lang), `/category/${main.slug}`]);
  if (category) crumbs.push([pick(category.name, lang), null]);
  if (q) crumbs.push([`"${q}"`, null]);

  const needle = q.toLowerCase();
  const shown =
    products && needle
      ? products.filter((p) =>
          [p.name?.en, p.name?.ar, p.sku, p.category, p.categoryAr, p.description?.en, p.description?.ar]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
      : products;

  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("catalogEyebrow")} title={slug && ready && !category ? t("navProducts") : title} crumbs={crumbs} />

      <section className="s-catalog site-wrap">
        <div className="cat-tabs" role="tablist">
          <Link to="/products" className={!slug && !q ? "tab on" : "tab"}>
            {t("allProducts")}
          </Link>
          {mains.map((c) => (
            <Link key={c._id} to={categoryLink(c)} className={c.slug === main?.slug ? "tab on" : "tab"}>
              <img src={categoryImage(c)} alt="" />
              {pick(c.name, lang)}
            </Link>
          ))}
        </div>
        {subs.length > 0 && (
          <div className="sub-tabs">
            <Link to={`/category/${main.slug}`} className={category === main ? "sub on" : "sub"}>
              {t("allOf")} {pick(main.name, lang)}
            </Link>
            {subs.map((c) => (
              <Link key={c._id} to={`/category/${c.slug}`} className={c.slug === slug ? "sub on" : "sub"}>
                <img src={categoryImage(c)} alt="" />
                {pick(c.name, lang)}
              </Link>
            ))}
          </div>
        )}

        {category && pick(category.description, lang) && (
          <p className="cat-desc">{pick(category.description, lang)}</p>
        )}

        {error && <p className="error">{error}</p>}
        {!products && !error && <p className="s-soft">{t("loading")}</p>}

        {shown && shown.length > 0 && (
          <div className="prod-grid">
            {shown.map((p) => (
              <Link key={p._id} to={`/products/${p.slug}`} className="prod-card">
                <div className="prod-img">
                  {p.image || p.categorySlug ? (
                    <img
                      src={p.image ? imageUrl(p.image) : categoryImage({ slug: p.categorySlug })}
                      alt={pick(p.name, lang)}
                      loading="lazy"
                    />
                  ) : (
                    <Boxes size={44} />
                  )}
                </div>
                <div className="prod-body">
                  <small>{pick({ en: p.category, ar: p.categoryAr }, lang)}</small>
                  <h3>{pick(p.name, lang)}</h3>
                  <p>{pick(p.description, lang)}</p>
                  <span className="cat-link">
                    {t("viewDetails")} <Arrow size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {shown && shown.length === 0 && (
          <div className="empty-box">
            {category && <img src={categoryImage(category)} alt="" />}
            <p>{q ? t("noSearchResults") : t("noProductsInCategory")}</p>
            <Link
              to={category ? `/contact?product=${encodeURIComponent(category.name.en)}` : "/contact"}
              className="s-btn red sm"
            >
              {t("requestQuote")} <Arrow size={14} />
            </Link>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
