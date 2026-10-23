import React, { useEffect, useState } from "react";
import { Upload, Trash2, Save, Eye, EyeOff, ExternalLink, FileText } from "lucide-react";
import { api } from "./api";
import { useLang, pick } from "./i18n.jsx";
import { fileSize, fileUrl } from "./Pages.jsx";

const emptyForm = () => ({ title: { en: "", ar: "" }, description: { en: "", ar: "" }, file: null });

export default function AdminDownloads() {
  const { t, lang } = useLang();
  const [files, setFiles] = useState([]),
    [form, setForm] = useState(emptyForm),
    [busy, setBusy] = useState(false),
    [edit, setEdit] = useState(null),
    [notice, setNotice] = useState({ ok: false, text: "" });

  const load = () =>
    api("/api/downloads?admin=true")
      .then(setFiles)
      .catch((e) => setNotice({ ok: false, text: e.message }));
  useEffect(() => {
    load();
  }, []);

  async function upload(e) {
    e.preventDefault();
    if (!form.file) return;
    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("title", JSON.stringify(form.title));
    fd.append("description", JSON.stringify(form.description));
    setBusy(true);
    try {
      await api("/api/downloads", { method: "POST", body: fd });
      setForm(emptyForm());
      e.target.reset();
      setNotice({ ok: true, text: t("fileSaved") });
      await load();
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }
  async function update(d, patch) {
    try {
      await api(`/api/downloads/${d._id}`, { method: "PUT", body: JSON.stringify(patch) });
      setEdit(null);
      setNotice({ ok: true, text: t("fileSaved") });
      await load();
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  }
  async function del(d) {
    if (!confirm(t("confirmDeleteFile"))) return;
    try {
      await api(`/api/downloads/${d._id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  }
  const setText = (part, k, v) => setForm((f) => ({ ...f, [part]: { ...f[part], [k]: v } }));

  return (
    <>
      <div className="title">
        <div>
          <span className="eyebrow">{t("downloadsK")}</span>
          <h1>{t("navDownloads")}</h1>
          <p>{t("downloadsAdminDesc")}</p>
        </div>
      </div>
      {notice.text && <p className={notice.ok ? "notice" : "notice error"}>{notice.text}</p>}

      <form className="panel" onSubmit={upload}>
        <h2>{t("uploadFile")}</h2>
        <div className="form-grid">
          <label className="full">
            {t("chooseFile")}
            <input
              type="file"
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
            />
            <span className="field-hint">{t("fileHelp")}</span>
          </label>
          <label>
            {t("fileTitleEn")}
            <input dir="ltr" value={form.title.en} onChange={(e) => setText("title", "en", e.target.value)} />
          </label>
          <label>
            {t("fileTitleAr")}
            <input dir="rtl" value={form.title.ar} onChange={(e) => setText("title", "ar", e.target.value)} />
          </label>
          <label>
            {t("descEn")}
            <input dir="ltr" value={form.description.en} onChange={(e) => setText("description", "en", e.target.value)} />
          </label>
          <label>
            {t("descAr")}
            <input dir="rtl" value={form.description.ar} onChange={(e) => setText("description", "ar", e.target.value)} />
          </label>
        </div>
        <div className="actions">
          <button className="btn primary" disabled={busy || !form.file}>
            <Upload size={16} />
            {busy ? t("uploading") : t("uploadFile")}
          </button>
        </div>
      </form>

      <div className="panel dl-admin">
        {files.length === 0 && <p className="empty">{t("noDownloads")}</p>}
        {files.map((d) =>
          edit?._id === d._id ? (
            <div key={d._id} className="dl-row editing">
              <div className="form-grid">
                {["en", "ar"].map((k) => (
                  <label key={k}>
                    {t(k === "en" ? "fileTitleEn" : "fileTitleAr")}
                    <input
                      dir={k === "en" ? "ltr" : "rtl"}
                      value={edit.title[k]}
                      onChange={(e) => setEdit({ ...edit, title: { ...edit.title, [k]: e.target.value } })}
                    />
                  </label>
                ))}
                {["en", "ar"].map((k) => (
                  <label key={"d" + k}>
                    {t(k === "en" ? "descEn" : "descAr")}
                    <input
                      dir={k === "en" ? "ltr" : "rtl"}
                      value={edit.description[k]}
                      onChange={(e) =>
                        setEdit({ ...edit, description: { ...edit.description, [k]: e.target.value } })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="actions">
                <button type="button" className="btn muted" onClick={() => setEdit(null)}>
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => update(d, { title: edit.title, description: edit.description })}
                >
                  <Save size={16} /> {t("saveChanges")}
                </button>
              </div>
            </div>
          ) : (
            <div key={d._id} className={d.active ? "dl-row" : "dl-row off"}>
              <span className="thumb">
                <FileText />
              </span>
              <div className="grow">
                <b>{pick(d.title, lang) || d.filename}</b>
                <small dir="ltr">
                  {d.filename} · {fileSize(d.size)}
                </small>
              </div>
              <a className="icon-btn" href={`${fileUrl(d)}${d.active ? "" : "?preview=admin"}`} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
              </a>
              <button
                className="icon-btn"
                title={d.active ? t("visible") : t("hidden")}
                onClick={() => update(d, { active: !d.active })}
              >
                {d.active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                className="icon-btn"
                onClick={() =>
                  setEdit({
                    _id: d._id,
                    title: { en: "", ar: "", ...d.title },
                    description: { en: "", ar: "", ...d.description },
                  })
                }
              >
                ✎
              </button>
              <button className="icon-btn danger" onClick={() => del(d)}>
                <Trash2 size={16} />
              </button>
            </div>
          ),
        )}
      </div>
    </>
  );
}
