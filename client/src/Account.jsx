import React, { useState } from "react";
import { Save, Eye, EyeOff } from "lucide-react";
import { api } from "./api";
import { useLang } from "./i18n.jsx";

const empty = { currentPassword: "", newPassword: "", confirm: "" };

export default function Account() {
  const { t } = useLang();
  const [f, setF] = useState(empty),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState({ ok: false, text: "" });

  const upd = (e) => setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (f.newPassword.length < 8) return setMsg({ ok: false, text: t("passwordTooShort") });
    if (f.newPassword !== f.confirm) return setMsg({ ok: false, text: t("passwordsDontMatch") });
    setBusy(true);
    setMsg({ ok: false, text: "" });
    try {
      await api("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: f.currentPassword, newPassword: f.newPassword }),
      });
      setF(empty);
      setMsg({ ok: true, text: t("passwordChanged") });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const field = (name, label, autoComplete, hint) => (
    <label className="full">
      {t(label)}
      <input
        name={name}
        type={show ? "text" : "password"}
        dir="ltr"
        value={f[name]}
        onChange={upd}
        required
        autoComplete={autoComplete}
      />
      {hint && <span className="field-hint">{t(hint)}</span>}
    </label>
  );

  return (
    <>
      <div className="title">
        <div>
          <span className="eyebrow">{t("accountK")}</span>
          <h1>{t("account")}</h1>
          <p>{t("accountDesc")}</p>
        </div>
      </div>
      <form className="panel account-panel" onSubmit={submit}>
        <h2>{t("changePassword")}</h2>
        <div className="form-grid">
          {field("currentPassword", "currentPassword", "current-password")}
          {field("newPassword", "newPassword", "new-password", "passwordHint")}
          {field("confirm", "confirmPassword", "new-password")}
        </div>
        <div className="actions account-actions">
          <button type="button" className="btn muted" onClick={() => setShow((s) => !s)}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button className="btn primary" disabled={busy}>
            <Save size={16} />
            {busy ? t("saving") : t("changePassword")}
          </button>
        </div>
        {msg.text && <p className={msg.ok ? "success" : "error"}>{msg.text}</p>}
      </form>
    </>
  );
}
