import React, { useState } from "react";
import { Plus, Pencil, Trash2, Save, Upload, X, Eye, EyeOff } from "lucide-react";
import { api, imageUrl } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { categoryImage, loadCatalog } from "./catalog.js";

const blank = () => ({
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  image: "",
  order: 0,
  active: true,
});

export default function AdminCategories({ d }) {
  const { t, lang } = useLang();
  const [edit, setEdit] = useState(null),
    [notice, setNotice] = useState({ ok: false, text: "" });

  const done = async (text) => {
    setNotice({ ok: true, text });
    loadCatalog(true).catch(() => {});
    await d.refresh();
  };

  async function save(e) {
    e.preventDefault();
    try {
      const body = JSON.stringify({ ...edit, order: Number(edit.order) || 0 });
      await api(edit._id ? `/api/categories/${edit._id}` : "/api/categories", {
        method: edit._id ? "PUT" : "POST",
        body,
      });
      setEdit(null);
      await done(t("categorySaved"));
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  }
  async function del(c) {
    if (!confirm(t("confirmDeleteCategory"))) return;
    try {
      await api(`/api/categories/${c._id}`, { method: "DELETE" });
      await done(t("categorySaved"));
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  }
  async function upload(file) {
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await api("/api/upload", { method: "POST", body: fd });
      setEdit((x) => ({ ...x, image: r.url }));
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  }
  const setText = (part, k, v) => setEdit((x) => ({ ...x, [part]: { ...x[part], [k]: v } }));

  return (
    <>
      <div className="title">
        <div>
          <span className="eyebrow">{t("categoriesK")}</span>
          <h1>{t("categories")}</h1>
          <p>{t("categoriesDesc")}</p>
        </div>
        <button
          className="btn primary"
          onClick={() => setEdit({ ...blank(), order: d.categories.length + 1 })}
        >
          <Plus size={16} />
          {t("addCategory")}
        </button>
      </div>
      {(notice.text || d.error) && (
        <p className={notice.ok ? "notice" : "notice error"}>{notice.text || d.error}</p>
      )}

      <div className="cat-admin-grid">
        {d.categories.map((c) => (
          <div key={c._id} className={c.active ? "cat-admin" : "cat-admin off"}>
            <div className="cat-admin-img">
              <img src={categoryImage(c)} alt="" />
              <span className="order-badge">{c.order}</span>
            </div>
            <b>{pick(c.name, lang)}</b>
            <small>
              {c.productCount || 0} {t("productsCount")} · {c.active ? t("visible") : t("hidden")}
            </small>
            <div className="cat-admin-actions">
              <button
                className="icon-btn"
                title={t("editCategory")}
                onClick={() =>
                  setEdit({
                    ...blank(),
                    ...c,
                    name: { en: "", ar: "", ...c.name },
                    description: { en: "", ar: "", ...c.description },
                  })
                }
              >
                <Pencil size={16} />
              </button>
              <button className="icon-btn danger" onClick={() => del(c)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {edit && (
        <div className="modal-bg">
          <form className="modal" onSubmit={save}>
            <div className="modal-title">
              <h2>{edit._id ? t("editCategory") : t("addCategory")}</h2>
              <button type="button" className="icon-btn" onClick={() => setEdit(null)}>
                <X />
              </button>
            </div>
            <div className="form-grid">
              <label>
                {t("categoryNameEn")}
                <input dir="ltr" required value={edit.name.en} onChange={(e) => setText("name", "en", e.target.value)} />
              </label>
              <label>
                {t("categoryNameAr")}
                <input dir="rtl" value={edit.name.ar} onChange={(e) => setText("name", "ar", e.target.value)} />
              </label>
              <label className="full">
                {t("descEn")}
                <textarea dir="ltr" rows="2" value={edit.description.en} onChange={(e) => setText("description", "en", e.target.value)} />
              </label>
              <label className="full">
                {t("descAr")}
                <textarea dir="rtl" rows="2" value={edit.description.ar} onChange={(e) => setText("description", "ar", e.target.value)} />
              </label>
              <label className="full">
                {t("image")}
                <div className="image-field">
                  <img src={edit.image ? imageUrl(edit.image) : categoryImage(edit)} alt="" />
                  <input dir="ltr" value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} />
                  <span className="upload-label">
                    <Upload size={15} /> {t("upload")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) upload(f);
                      }}
                    />
                  </span>
                </div>
                <span className="field-hint">{t("categoryImageHelp")}</span>
              </label>
              <label>
                {t("displayOrder")}
                <input type="number" dir="ltr" value={edit.order} onChange={(e) => setEdit({ ...edit, order: e.target.value })} />
              </label>
              <label className="check">
                <input type="checkbox" checked={!!edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />{" "}
                {edit.active ? <Eye size={15} /> : <EyeOff size={15} />} {t("visible")}
              </label>
            </div>
            <div className="actions">
              <button type="button" className="btn muted" onClick={() => setEdit(null)}>
                {t("cancel")}
              </button>
              <button className="btn primary">
                <Save size={16} />
                {t("saveChanges")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
