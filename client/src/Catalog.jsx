import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Boxes } from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { Header, SiteFooter, PageBanner, Arrow } from "./Layout.jsx";
import { useCatalog, categoryImage } from "./catalog.js";

// All products (/products) or one category (/category/:slug).
export default function Catalog() {
  const { slug } = useParams();
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
  const title = category ? pick(category.name, lang) : t("ourProducts");
  const crumbs = [[t("navHome"), "/"], [t("navProducts"), category ? "/products" : null]];
  if (category) crumbs.push([title, null]);

  return (
    <div className="site">
      <Header />
      <PageBanner eyebrow={t("catalogEyebrow")} title={slug && ready && !category ? t("navProducts") : title} crumbs={crumbs} />

      <section className="s-catalog site-wrap">
        <div className="cat-tabs" role="tablist">
          <Link to="/products" className={!slug ? "tab on" : "tab"}>
            {t("allProducts")}
          </Link>
          {categories.map((c) => (
            <Link key={c._id} to={`/category/${c.slug}`} className={c.slug === slug ? "tab on" : "tab"}>
              <img src={categoryImage(c)} alt="" />
              {pick(c.name, lang)}
            </Link>
          ))}
        </div>

        {category && pick(category.description, lang) && (
          <p className="cat-desc">{pick(category.description, lang)}</p>
        )}

        {error && <p className="error">{error}</p>}
        {!products && !error && <p className="s-soft">{t("loading")}</p>}

        {products && products.length > 0 && (
          <div className="prod-grid">
            {products.map((p) => (
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

        {products && products.length === 0 && (
          <div className="empty-box">
            {category && <img src={categoryImage(category)} alt="" />}
            <p>{t("noProductsInCategory")}</p>
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
