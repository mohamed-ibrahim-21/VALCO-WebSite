import { useEffect, useState } from "react";
import { api, imageUrl } from "./api";

// Site settings and categories are needed by the header, footer and several pages,
// so they are fetched once per page load and shared.
let cached = null;
export function loadCatalog(force = false) {
  if (!cached || force) {
    cached = Promise.all([api("/api/site"), api("/api/categories")])
      .then(([site, categories]) => ({ site, categories }))
      .catch((e) => {
        cached = null;
        throw e;
      });
  }
  return cached;
}

export function useCatalog() {
  const [data, setData] = useState({ site: {}, categories: [], ready: false, error: "" });
  useEffect(() => {
    let alive = true;
    loadCatalog()
      .then((d) => alive && setData({ ...d, ready: true, error: "" }))
      .catch((e) => alive && setData((x) => ({ ...x, ready: true, error: e.message })));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

const DEFAULT_ART = new Set([
  "gate-valves",
  "ball-valves",
  "globe-valves",
  "butterfly-valves",
  "check-valves",
  "safety-valves",
]);

// Uploaded photo if there is one, otherwise the built-in illustration.
export function categoryImage(c) {
  if (c?.image) return imageUrl(c.image);
  return `/img/categories/${DEFAULT_ART.has(c?.slug) ? c.slug : "default"}.svg`;
}

export const heroImage = (site) =>
  site?.heroImage ? imageUrl(site.heroImage) : "/img/hero-industrial.svg";
export const aboutImage = (site) =>
  site?.aboutImage ? imageUrl(site.aboutImage) : "/img/about-industrial.svg";
