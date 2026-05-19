import { useState, useRef } from "react";
import { useLogin, useNotify } from "react-admin";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── Styles ─────────────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  main: {
    position: "relative",
    minHeight: "100vh",
    background: "#05050d",
    color: "#e2e8f0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  glow1: {
    position: "absolute",
    top: -160, left: -160,
    width: 480, height: 480,
    borderRadius: "50%",
    background: "rgba(79,70,229,0.30)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    bottom: -160, right: -160,
    width: 520, height: 520,
    borderRadius: "50%",
    background: "rgba(30,30,90,0.60)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    opacity: 0.07,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: 960,
    margin: "0 auto",
    padding: "48px 24px",
    display: "grid",
    gap: 64,
    alignItems: "center",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 340,
  },
  logo: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: {
    width: 40, height: 40,
    borderRadius: 8,
    background: "rgba(99,102,241,0.20)",
    boxShadow: "0 0 0 1px rgba(99,102,241,0.40)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", color: "#f1f5f9" },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    border: "1px solid rgba(99,102,241,0.30)",
    background: "rgba(99,102,241,0.10)",
    borderRadius: 999, padding: "4px 12px",
    fontSize: 12, color: "#c7d2fe",
  },
  badgeDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#818cf8",
    animation: "pulse 2s infinite",
  },
  heading: {
    fontSize: 36, fontWeight: 600,
    lineHeight: 1.25, letterSpacing: "-0.5px",
    color: "#fff", margin: "16px 0 12px",
  },
  headingAccent: {
    background: "linear-gradient(90deg, #a5b4fc, #6366f1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtext: { fontSize: 14, color: "#94a3b8", maxWidth: 380, lineHeight: 1.6 },
  securityNote: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#475569" },
  card: {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: "40px",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  cardTitle: { fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 6px" },
  cardSub: { fontSize: 13, color: "#94a3b8", margin: "0 0 28px" },
  field: { marginBottom: 18 },
  fieldHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 13, color: "#cbd5e1", display: "block", marginBottom: 6 },
  forgotLink: { fontSize: 11, color: "#a5b4fc", textDecoration: "none" },
  inputWrap: { position: "relative" },
  iconLeft: {
    position: "absolute", left: 12, top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b", pointerEvents: "none", display: "flex",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 8,
    color: "#f1f5f9", fontSize: 13,
    padding: "9px 12px 9px 36px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputMono: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 8,
    color: "#f1f5f9", fontSize: 13,
    padding: "9px 12px 9px 36px",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase",
  },
  eyeBtn: {
    position: "absolute", right: 10, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none",
    color: "#64748b", cursor: "pointer", padding: 0,
    display: "flex", alignItems: "center",
  },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 20 },
  checkLabel: { fontSize: 12, color: "#94a3b8", fontWeight: 400, lineHeight: 1.4 },
  checkLink: { color: "#a5b4fc", textDecoration: "none" },
  btnPrimary: {
    width: "100%", height: 44,
    background: "#4f46e5", border: "none", borderRadius: 8,
    color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer",
    marginBottom: 14,
    boxShadow: "0 4px 20px rgba(79,70,229,0.30)",
    transition: "background 0.2s",
  },
  footerText: { textAlign: "center", fontSize: 11, color: "#475569", marginBottom: 4 },
  footerLink: { color: "#a5b4fc", textDecoration: "none", cursor: "pointer" },
  strengthBar: { display: "flex", gap: 4, marginTop: 6 },
  strengthSeg: {
    flex: 1, height: 3, borderRadius: 99,
    background: "rgba(255,255,255,0.10)", transition: "background 0.2s",
  },
  strengthLabel: { fontSize: 11, color: "#64748b", marginTop: 3 },
};

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
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
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>
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

/* ─── Helpers ────────────────────────────────────────────────────────── */
const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
const STRENGTH_LABELS = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"];

function getStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function useInputFocus() {
  const ref = useRef<HTMLInputElement>(null);
  const onFocus = () => { if (ref.current) ref.current.style.borderColor = "rgba(99,102,241,0.60)"; };
  const onBlur  = () => { if (ref.current) ref.current.style.borderColor = "rgba(255,255,255,0.10)"; };
  return { ref, onFocus, onBlur };
}

/* ═══════════════════════════════════════════════════════════════════════
   LOGIN FORM
═══════════════════════════════════════════════════════════════════════ */
function LoginForm({ onGoSignup }: { onGoSignup: () => void }) {
  const login  = useLogin();
  const notify = useNotify();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const emailF = useInputFocus();
  const passF  = useInputFocus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Veuillez renseigner email et mot de passe", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      await login({ username: email, password });
    } catch {
      notify("Identifiants incorrects", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.card}>
      <h2 style={S.cardTitle}>Connexion Admin</h2>
      <p style={S.cardSub}>Entrez vos identifiants pour accéder au panneau de contrôle.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={S.field}>
          <label style={S.label}>Email</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconMail /></span>
            <input ref={emailF.ref} type="email" autoComplete="email"
              placeholder="admin@eventmilay.io"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={emailF.onFocus} onBlur={emailF.onBlur}
              style={S.input} required />
          </div>
        </div>

        <div style={S.field}>
          <div style={S.fieldHeader}>
            <label style={{ ...S.label, marginBottom: 0 }}>Mot de passe</label>
            <a href="#" style={S.forgotLink}>Oublié ?</a>
          </div>
          <div style={{ ...S.inputWrap, marginTop: 6 }}>
            <span style={S.iconLeft}><IconLock /></span>
            <input ref={passF.ref} type={showPwd ? "text" : "password"}
              autoComplete="current-password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onFocus={passF.onFocus} onBlur={passF.onBlur}
              style={{ ...S.input, paddingRight: 36 }} required />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={S.eyeBtn} aria-label={showPwd ? "Masquer" : "Afficher"}>
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div style={S.checkRow}>
          <input type="checkbox" id="remember"
            style={{ accentColor: "#4f46e5", width: 15, height: 15, cursor: "pointer", flexShrink: 0, marginTop: 1 }} />
          <label htmlFor="remember" style={S.checkLabel}>Rester connecté sur cet appareil</label>
        </div>

        <button type="submit" disabled={loading}
          style={{ ...S.btnPrimary, background: loading ? "#3730a3" : "#4f46e5", cursor: loading ? "default" : "pointer" }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5"; }}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p style={S.footerText}>
          Problème d'accès ? Contactez{" "}
          <a href="mailto:support@eventmilay.io" style={S.footerLink}>support@eventmilay.io</a>
        </p>
        <p style={S.footerText}>
          Pas encore de compte ?{" "}
          <span style={S.footerLink} onClick={onGoSignup}>Créer un compte admin</span>
        </p>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SIGNUP FORM
═══════════════════════════════════════════════════════════════════════ */
function SignupForm({ onGoLogin }: { onGoLogin: () => void }) {
  const notify = useNotify();

  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPwd, setShowPwd]       = useState(false);
  const [accept, setAccept]         = useState(false);
  const [loading, setLoading]       = useState(false);

  const nameF    = useInputFocus();
  const emailF   = useInputFocus();
  const inviteF  = useInputFocus();
  const passF    = useInputFocus();
  const confirmF = useInputFocus();

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !inviteCode || !password || !confirm) {
      notify("Veuillez remplir tous les champs", { type: "error" }); return;
    }
    if (password.length < 8) {
      notify("Le mot de passe doit contenir au moins 8 caractères", { type: "error" }); return;
    }
    if (password !== confirm) {
      notify("Les mots de passe ne correspondent pas", { type: "error" }); return;
    }
    if (!accept) {
      notify("Vous devez accepter les conditions d'utilisation", { type: "error" }); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, inviteCode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error || "Erreur lors de la création du compte");
      }
      notify("Compte créé ! Vous pouvez maintenant vous connecter.", { type: "success" });
      onGoLogin();
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Erreur serveur", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...S.card, maxHeight: "88vh", overflowY: "auto" }}>
      <h2 style={S.cardTitle}>Créer un compte Admin</h2>
      <p style={S.cardSub}>Renseignez vos informations et votre code d'invitation.</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Nom complet */}
        <div style={S.field}>
          <label style={S.label}>Nom complet</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconUser /></span>
            <input ref={nameF.ref} type="text" autoComplete="name"
              placeholder="Alex Dupont"
              value={fullName} onChange={(e) => setFullName(e.target.value)}
              onFocus={nameF.onFocus} onBlur={nameF.onBlur}
              style={S.input} required />
          </div>
        </div>

        {/* Email */}
        <div style={S.field}>
          <label style={S.label}>Email professionnel</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconMail /></span>
            <input ref={emailF.ref} type="email" autoComplete="email"
              placeholder="admin@eventmilay.io"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={emailF.onFocus} onBlur={emailF.onBlur}
              style={S.input} required />
          </div>
        </div>

        {/* Code d'invitation */}
        <div style={S.field}>
          <label style={S.label}>Code d'invitation</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconKey /></span>
            <input ref={inviteF.ref} type="text"
              placeholder="EVENTMILAY-XXXX"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              onFocus={inviteF.onFocus} onBlur={inviteF.onBlur}
              style={S.inputMono} required />
          </div>
        </div>

        {/* Mot de passe */}
        <div style={S.field}>
          <label style={S.label}>Mot de passe</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconLock /></span>
            <input ref={passF.ref} type={showPwd ? "text" : "password"}
              autoComplete="new-password" placeholder="Au moins 8 caractères"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onFocus={passF.onFocus} onBlur={passF.onBlur}
              style={{ ...S.input, paddingRight: 36 }} required />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={S.eyeBtn} aria-label={showPwd ? "Masquer" : "Afficher"}>
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {password && (
            <>
              <div style={S.strengthBar}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    ...S.strengthSeg,
                    background: i < strength ? STRENGTH_COLORS[strength - 1] : "rgba(255,255,255,0.10)",
                  }} />
                ))}
              </div>
              <p style={S.strengthLabel}>Sécurité : {STRENGTH_LABELS[strength]}</p>
            </>
          )}
        </div>

        {/* Confirmer mot de passe */}
        <div style={S.field}>
          <label style={S.label}>Confirmer le mot de passe</label>
          <div style={S.inputWrap}>
            <span style={S.iconLeft}><IconLock /></span>
            <input ref={confirmF.ref} type={showPwd ? "text" : "password"}
              autoComplete="new-password" placeholder="••••••••"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              onFocus={confirmF.onFocus} onBlur={confirmF.onBlur}
              style={S.input} required />
          </div>
        </div>

        {/* CGU */}
        <div style={S.checkRow}>
          <input type="checkbox" id="accept" checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            style={{ accentColor: "#4f46e5", width: 15, height: 15, cursor: "pointer", flexShrink: 0, marginTop: 2 }} />
          <label htmlFor="accept" style={S.checkLabel}>
            J'accepte les{" "}
            <a href="#" style={S.checkLink}>conditions d'utilisation</a>
            {" "}et la{" "}
            <a href="#" style={S.checkLink}>politique de confidentialité</a>.
          </label>
        </div>

        <button type="submit" disabled={loading}
          style={{ ...S.btnPrimary, background: loading ? "#3730a3" : "#4f46e5", cursor: loading ? "default" : "pointer" }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#6366f1"; }}
          onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#4f46e5"; }}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p style={S.footerText}>
          Vous avez déjà un compte ?{" "}
          <span style={S.footerLink} onClick={onGoLogin}>Se connecter</span>
        </p>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
═══════════════════════════════════════════════════════════════════════ */
export const LoginPage = () => {
  const [view, setView] = useState<"login" | "signup">("login");
  const isSignup = view === "signup";

  const branding = {
    login: {
      badge: "Console administrateur",
      heading: <>Pilotez vos conférences <span style={S.headingAccent}>en direct.</span></>,
      sub: "Gérez les sessions en streaming, modérez les intervenants et accédez aux statistiques en temps réel depuis un seul tableau de bord.",
      security: "Connexion chiffrée · Accès réservé au personnel autorisé",
    },
    signup: {
      badge: "Nouveau compte administrateur",
      heading: <>Rejoignez l'équipe <span style={S.headingAccent}>de pilotage.</span></>,
      sub: "Créez votre compte administrateur pour orchestrer les sessions live, modérer les intervenants et accéder aux analytics en temps réel.",
      security: "Inscription sur invitation · Code requis",
    },
  };
  const b = branding[view];

  return (
    <main style={S.main}>
      <div style={S.glow1} />
      <div style={S.glow2} />
      <div style={S.gridOverlay} />

      <div style={{ ...S.content, gridTemplateColumns: "1fr 1fr" }} className="em-login-grid">

        {/* ── Colonne gauche : branding ── */}
        <section style={S.left} className="em-login-left">
          <div style={S.logo}>
            <div style={S.logoIcon}><IconRadio /></div>
            <span style={S.logoText}>EventMilay</span>
          </div>

          <div>
            <div style={S.badge}>
              <span style={S.badgeDot} />
              {b.badge}
            </div>
            <h1 style={S.heading}>{b.heading}</h1>
            <p style={S.subtext}>{b.sub}</p>
          </div>

          <div style={S.securityNote}>
            <IconShield />
            {b.security}
          </div>
        </section>

        {/* ── Colonne droite : formulaire ── */}
        <section style={{ display: "flex", alignItems: "center" }}>
          {isSignup
            ? <SignupForm onGoLogin={() => setView("login")} />
            : <LoginForm  onGoSignup={() => setView("signup")} />
          }
        </section>
      </div>

      <style>{`
        input::placeholder { color: #475569 !important; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media (max-width: 768px) {
          .em-login-grid { grid-template-columns: 1fr !important; }
          .em-login-left { display: none !important; }
        }
        .em-login-grid ::-webkit-scrollbar { width: 4px; }
        .em-login-grid ::-webkit-scrollbar-track { background: transparent; }
        .em-login-grid ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </main>
  );
};