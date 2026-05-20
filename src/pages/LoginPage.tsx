import { useState, useRef } from "react";
import { useLogin, useNotify } from "react-admin";

/* ─── SVG Icons ─── */
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
const IconRadio = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/>
    <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
  </svg>
);

/* ─── Focus hook ─── */
function useInputFocus() {
  const ref = useRef<HTMLInputElement>(null);
  const onFocus = () => { if (ref.current) ref.current.style.borderColor = "rgba(99,102,241,0.70)"; };
  const onBlur  = () => { if (ref.current) ref.current.style.borderColor = "rgba(255,255,255,0.12)"; };
  return { ref, onFocus, onBlur };
}

/* ─── Styles ─── */
const T = {
  main: {
    position: "fixed", inset: 0,
    background: "#05050d", color: "#e2e8f0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "auto", zIndex: 9999,
  } as React.CSSProperties,
  glow1: {
    position: "absolute", top: -160, left: -160,
    width: 480, height: 480, borderRadius: "50%",
    background: "rgba(79,70,229,0.30)", filter: "blur(80px)", pointerEvents: "none",
  } as React.CSSProperties,
  glow2: {
    position: "absolute", bottom: -160, right: -160,
    width: 520, height: 520, borderRadius: "50%",
    background: "rgba(30,30,90,0.60)", filter: "blur(80px)", pointerEvents: "none",
  } as React.CSSProperties,
  gridOverlay: {
    position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
  } as React.CSSProperties,
  content: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 960,
    padding: "48px 24px",
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 64, alignItems: "center",
  } as React.CSSProperties,
  left: { display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 320 } as React.CSSProperties,
  logo: { display: "flex", alignItems: "center", gap: 12 } as React.CSSProperties,
  logoIcon: {
    width: 40, height: 40, borderRadius: 8,
    background: "rgba(99,102,241,0.20)", boxShadow: "0 0 0 1px rgba(99,102,241,0.40)",
    display: "flex", alignItems: "center", justifyContent: "center",
  } as React.CSSProperties,
  logoText: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", color: "#f1f5f9", margin: 0 } as React.CSSProperties,
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    border: "1px solid rgba(99,102,241,0.30)", background: "rgba(99,102,241,0.10)",
    borderRadius: 999, padding: "4px 12px", fontSize: 12, color: "#c7d2fe",
  } as React.CSSProperties,
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#818cf8", animation: "em-pulse 2s infinite" } as React.CSSProperties,
  heading: { fontSize: 36, fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.5px", color: "#fff", margin: "16px 0 12px" } as React.CSSProperties,
  headingAccent: {
    background: "linear-gradient(90deg, #a5b4fc, #6366f1)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  } as React.CSSProperties,
  subtext: { fontSize: 14, color: "#94a3b8", maxWidth: 380, lineHeight: 1.6, margin: 0 } as React.CSSProperties,
  securityNote: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" } as React.CSSProperties,
  card: {
    width: "100%", borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    padding: 40,
  } as React.CSSProperties,
  cardTitle: { fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 6px" } as React.CSSProperties,
  cardSub: { fontSize: 13, color: "#94a3b8", margin: "0 0 28px" } as React.CSSProperties,
  fieldWrap: { marginBottom: 18 } as React.CSSProperties,
  fieldHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } as React.CSSProperties,
  label: { fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 } as React.CSSProperties,
  forgotLink: { fontSize: 11, color: "#a5b4fc", textDecoration: "none" } as React.CSSProperties,
  inputWrap: { position: "relative" } as React.CSSProperties,
  iconLeft: {
    position: "absolute", left: 12, top: "50%",
    transform: "translateY(-50%)", color: "#64748b",
    pointerEvents: "none", display: "flex",
  } as React.CSSProperties,
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8,
    color: "#f1f5f9", fontSize: 13, padding: "10px 12px 10px 36px",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  } as React.CSSProperties,
  eyeBtn: {
    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "#64748b", cursor: "pointer",
    padding: 0, display: "flex", alignItems: "center",
  } as React.CSSProperties,
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 } as React.CSSProperties,
  checkLabel: { fontSize: 12, color: "#94a3b8", lineHeight: 1.4, margin: 0 } as React.CSSProperties,
  btn: {
    width: "100%", height: 44, background: "#4f46e5", border: "none", borderRadius: 8,
    color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 14,
    boxShadow: "0 4px 20px rgba(79,70,229,0.35)", transition: "background 0.2s",
  } as React.CSSProperties,
  footerText: { textAlign: "center" as const, fontSize: 11, color: "#475569", marginBottom: 4 } as React.CSSProperties,
  footerLink: { color: "#a5b4fc", textDecoration: "none" } as React.CSSProperties,
};

/* ═══════════════════════════════════════════════════
   PAGE DE CONNEXION (seule page — pas d'inscription)
═══════════════════════════════════════════════════ */
export const LoginPage = () => {
  const login  = useLogin();
  const notify = useNotify();

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailF = useInputFocus();
  const passF  = useInputFocus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Veuillez renseigner email et mot de passe", { type: "error" });
      return;
    }
    setLoading(true);
    try { await login({ username: email, password }); }
    catch { notify("Identifiants incorrects", { type: "error" }); }
    finally { setLoading(false); }
  };

  return (
    <main style={T.main}>
      <div style={T.glow1} />
      <div style={T.glow2} />
      <div style={T.gridOverlay} />

      <div style={T.content} className="em-login-grid">

        {/* ── Colonne gauche : branding ── */}
        <section style={T.left} className="em-login-left">
          <div style={T.logo}>
            <div style={T.logoIcon}><IconRadio /></div>
            <span style={T.logoText}>EventMilay</span>
          </div>

          <div>
            <div style={T.badge}>
              <span style={T.badgeDot} />
              Console administrateur
            </div>
            <h1 style={T.heading}>
              Pilotez vos conférences{" "}
              <span style={T.headingAccent}>en direct.</span>
            </h1>
            <p style={T.subtext}>
              Gérez les sessions en streaming, modérez les intervenants et accédez
              aux statistiques en temps réel depuis un seul tableau de bord.
            </p>
          </div>

          <div style={T.securityNote}>
            <IconShield />
            Connexion chiffrée · Accès réservé au personnel autorisé
          </div>
        </section>

        {/* ── Colonne droite : formulaire ── */}
        <section style={{ display: "flex", alignItems: "center" }}>
          <div style={T.card}>
            <h2 style={T.cardTitle}>Connexion Admin</h2>
            <p style={T.cardSub}>
              Entrez vos identifiants pour accéder au panneau de contrôle.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div style={T.fieldWrap}>
                <label style={T.label}>Email</label>
                <div style={T.inputWrap}>
                  <span style={T.iconLeft}><IconMail /></span>
                  <input
                    ref={emailF.ref} type="email" autoComplete="email"
                    placeholder="admin@eventmilay.io"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={emailF.onFocus} onBlur={emailF.onBlur}
                    style={T.input} required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div style={T.fieldWrap}>
                <div style={T.fieldHeader}>
                  <label style={{ ...T.label, marginBottom: 0 }}>Mot de passe</label>
                  <a href="mailto:support@eventmilay.io" style={T.forgotLink}>
                    Mot de passe oublié ?
                  </a>
                </div>
                <div style={{ ...T.inputWrap, marginTop: 6 }}>
                  <span style={T.iconLeft}><IconLock /></span>
                  <input
                    ref={passF.ref} type={showPwd ? "text" : "password"}
                    autoComplete="current-password" placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onFocus={passF.onFocus} onBlur={passF.onBlur}
                    style={{ ...T.input, paddingRight: 36 }} required
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    style={T.eyeBtn} aria-label={showPwd ? "Masquer" : "Afficher"}>
                    {showPwd ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

              {/* Se souvenir de moi */}
              <div style={T.checkRow}>
                <input type="checkbox" id="remember"
                  style={{ accentColor: "#4f46e5", width: 15, height: 15, cursor: "pointer", flexShrink: 0, marginTop: 1 }} />
                <label htmlFor="remember" style={T.checkLabel}>
                  Rester connecté sur cet appareil
                </label>
              </div>

              <button
                type="submit" disabled={loading}
                style={{ ...T.btn, background: loading ? "#3730a3" : "#4f46e5", cursor: loading ? "default" : "pointer" }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; }}
                onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5"; }}
              >
                {loading ? "Connexion…" : "Se connecter"}
              </button>

              <p style={T.footerText}>
                Problème d'accès ? Contactez{" "}
                <a href="mailto:support@eventmilay.io" style={T.footerLink}>
                  support@eventmilay.io
                </a>
              </p>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        .em-login-grid input::placeholder { color: #475569 !important; }
        .em-login-grid input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(15,15,30,0.95) inset !important;
          -webkit-text-fill-color: #f1f5f9 !important;
        }
        @keyframes em-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media (max-width: 768px) {
          .em-login-grid { grid-template-columns: 1fr !important; }
          .em-login-left { display: none !important; }
        }
      `}</style>
    </main>
  );
};