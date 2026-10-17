import React from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { imageUrl } from "./api";
import { useLang } from "./i18n.jsx";

// Option values are edited as text, one per line: "English | عربي".
export function toEditable(product) {
  return {
    ...product,
    gallery: product.gallery || [],
    specs: (product.specs || []).map((s) => ({
      label: { en: "", ar: "", ...s.label },
      value: { en: "", ar: "", ...s.value },
    })),
    optionGroups: (product.optionGroups || []).map((g) => ({
      name: { en: "", ar: "", ...g.name },
      required: g.required !== false,
      valuesText: (g.values || [])
        .map((v) => (v.ar ? `${v.en} | ${v.ar}` : v.en))
        .join("\n"),
    })),
  };
}

export function fromEditable(edit) {
  return {
    ...edit,
    specs: edit.specs.filter((s) => s.label.en.trim() || s.label.ar.trim()),
    optionGroups: edit.optionGroups
      .map((g) => ({
        name: g.name,
        required: g.required,
        values: g.valuesText
          .split("\n")
          .map((line) => {
            const [en = "", ar = ""] = line.split("|").map((x) => x.trim());
            return { en: en || ar, ar };
          })
          .filter((v) => v.en),
      }))
      .filter((g) => (g.name.en.trim() || g.name.ar.trim()) && g.values.length),
  };
}

export default function ProductExtrasEditor({ edit, setEdit, uploadFile }) {
  const { t } = useLang();
  const set = (patch) => setEdit((x) => ({ ...x, ...patch }));

  const setGroup = (i, patch) =>
    set({ optionGroups: edit.optionGroups.map((g, j) => (j === i ? { ...g, ...patch } : g)) });
  const setSpec = (i, part, lang, v) =>
    set({
      specs: edit.specs.map((s, j) =>
        j === i ? { ...s, [part]: { ...s[part], [lang]: v } } : s,
      ),
    });

  async function addGalleryImage(file) {
    const url = await uploadFile(file);
    if (url) setEdit((x) => ({ ...x, gallery: [...(x.gallery || []), url] }));
  }

  return (
    <>
      {/* Gallery */}
      <div className="extra-block">
        <div className="extra-head">
          <div>
            <h3>{t("galleryTitle")}</h3>
            <p>{t("galleryHelp")}</p>
          </div>
          <span className="upload-label">
            <Upload size={15} /> {t("addImage")}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) addGalleryImage(f);
              }}
            />
          </span>
        </div>
        {edit.gallery.length > 0 && (
          <div className="gallery-edit">
            {edit.gallery.map((src, i) => (
              <div key={src + i} className="gallery-item">
                <img src={imageUrl(src)} alt="" />
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => set({ gallery: edit.gallery.filter((_, j) => j !== i) })}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Option groups */}
      <div className="extra-block">
        <div className="extra-head">
          <div>
            <h3>{t("optionsTitle")}</h3>
            <p>{t("optionsHelp")}</p>
          </div>
          <button
            type="button"
            className="btn muted"
            onClick={() =>
              set({
                optionGroups: [
                  ...edit.optionGroups,
                  { name: { en: "", ar: "" }, required: true, valuesText: "" },
                ],
              })
            }
          >
            <Plus size={15} /> {t("addOption")}
          </button>
        </div>
        {edit.optionGroups.map((g, i) => (
          <div key={i} className="option-edit">
            <div className="form-grid">
              <label>
                {t("optionNameEn")}
                <input
                  dir="ltr"
                  placeholder="Size"
                  value={g.name.en}
                  onChange={(e) => setGroup(i, { name: { ...g.name, en: e.target.value } })}
                />
              </label>
              <label>
                {t("optionNameAr")}
                <input
                  dir="rtl"
                  placeholder="المقاس"
                  value={g.name.ar}
                  onChange={(e) => setGroup(i, { name: { ...g.name, ar: e.target.value } })}
                />
              </label>
              <label className="full">
                {t("optionValues")}
                <textarea
                  dir="ltr"
                  rows="4"
                  placeholder={'DN50 | DN50\nDN100 | DN100\nCast steel | صلب مصبوب'}
                  value={g.valuesText}
                  onChange={(e) => setGroup(i, { valuesText: e.target.value })}
                />
              </label>
            </div>
            <div className="option-foot">
              <label className="check">
                <input
                  type="checkbox"
                  checked={g.required}
                  onChange={(e) => setGroup(i, { required: e.target.checked })}
                />{" "}
                {t("requiredChoice")}
              </label>
              <button
                type="button"
                className="icon-btn danger"
                onClick={() =>
                  set({ optionGroups: edit.optionGroups.filter((_, j) => j !== i) })
                }
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Specs */}
      <div className="extra-block">
        <div className="extra-head">
          <div>
            <h3>{t("specsTitle")}</h3>
            <p>{t("specsHelp")}</p>
          </div>
          <button
            type="button"
            className="btn muted"
            onClick={() =>
              set({
                specs: [
                  ...edit.specs,
                  { label: { en: "", ar: "" }, value: { en: "", ar: "" } },
                ],
              })
            }
          >
            <Plus size={15} /> {t("addSpec")}
          </button>
        </div>
        {edit.specs.length > 0 && (
          <div className="spec-edit">
            <div className="spec-row spec-labels">
              <span>{t("specLabelEn")}</span>
              <span>{t("specValueEn")}</span>
              <span>{t("specLabelAr")}</span>
              <span>{t("specValueAr")}</span>
              <span />
            </div>
            {edit.specs.map((s, i) => (
              <div key={i} className="spec-row">
                <input dir="ltr" placeholder="Material" value={s.label.en} onChange={(e) => setSpec(i, "label", "en", e.target.value)} />
                <input dir="ltr" placeholder="Cast steel" value={s.value.en} onChange={(e) => setSpec(i, "value", "en", e.target.value)} />
                <input dir="rtl" placeholder="الخامة" value={s.label.ar} onChange={(e) => setSpec(i, "label", "ar", e.target.value)} />
                <input dir="rtl" placeholder="صلب مصبوب" value={s.value.ar} onChange={(e) => setSpec(i, "value", "ar", e.target.value)} />
                <button
                  type="button"
                  className="icon-btn danger"
                  onClick={() => set({ specs: edit.specs.filter((_, j) => j !== i) })}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
