import { useState, useRef } from "react";
import { useLogin, useNotify } from "react-admin";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ─── Password strength ─── */
const STRENGTH_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500"];
const STRENGTH_LABELS = ["Très faible", "Faible", "Moyen", "Bon", "Excellent"];

function getStrength(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

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

/* ─── Reusable input ─── */
interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  mono?: boolean;
  required?: boolean;
}
function InputField({ label, type, placeholder, value, onChange, autoComplete, icon, rightSlot, mono, required }: InputFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-4">
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex">
          {icon}
        </span>
        <input
          ref={ref}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(mono ? e.target.value.toUpperCase() : e.target.value)}
          required={required}
          className={`login-input w-full bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm pl-9 ${rightSlot ? "pr-9" : "pr-3"} py-2.5 outline-none transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 ${mono ? "font-mono tracking-widest uppercase" : ""}`}
        />
        {rightSlot && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </div>
  );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Veuillez renseigner email et mot de passe", { type: "error" }); return;
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
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10">
      <h2 className="text-xl font-semibold text-white mb-1.5">Connexion Admin</h2>
      <p className="text-sm text-slate-400 mb-7">Entrez vos identifiants pour accéder au panneau de contrôle.</p>

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label="Email"
          type="email"
          placeholder="admin@eventmilay.io"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          icon={<IconMail />}
          required
        />

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-slate-400">Mot de passe</label>
            <a href="#" className="text-[11px] text-indigo-300 hover:text-indigo-200">Oublié ?</a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex">
              <IconLock />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input w-full bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm pl-9 pr-9 py-2.5 outline-none transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 bg-transparent border-none p-0 flex cursor-pointer"
              aria-label={showPwd ? "Masquer" : "Afficher"}
            >
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 mb-5">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 mt-0.5 accent-indigo-600 cursor-pointer flex-shrink-0"
          />
          <label htmlFor="remember" className="text-xs text-slate-400 leading-relaxed">
            Rester connecté sur cet appareil
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-default text-white text-sm font-medium rounded-lg transition-colors mb-4 shadow-lg shadow-indigo-500/30"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-center text-[11px] text-slate-500 mb-1">
          Problème d'accès ?{" "}
          <a href="mailto:support@eventmilay.io" className="text-indigo-300 hover:text-indigo-200">
            support@eventmilay.io
          </a>
        </p>
        <p className="text-center text-[11px] text-slate-500">
          Pas encore de compte ?{" "}
          <span className="text-indigo-300 hover:text-indigo-200 cursor-pointer" onClick={onGoSignup}>
            Créer un compte admin
          </span>
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
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 max-h-[88vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-white mb-1.5">Créer un compte Admin</h2>
      <p className="text-sm text-slate-400 mb-7">Renseignez vos informations et votre code d'invitation.</p>

      <form onSubmit={handleSubmit} noValidate>
        <InputField label="Nom complet" type="text" placeholder="Alex Dupont"
          value={fullName} onChange={setFullName} autoComplete="name" icon={<IconUser />} required />

        <InputField label="Email professionnel" type="email" placeholder="admin@eventmilay.io"
          value={email} onChange={setEmail} autoComplete="email" icon={<IconMail />} required />

        <InputField label="Code d'invitation" type="text" placeholder="EVENTMILAY-XXXX"
          value={inviteCode} onChange={setInviteCode} icon={<IconKey />} mono required />

        {/* Password with strength bar */}
        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5">Mot de passe</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex">
              <IconLock />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Au moins 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input w-full bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm pl-9 pr-9 py-2.5 outline-none transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 bg-transparent border-none p-0 flex cursor-pointer"
            >
              {showPwd ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
          {password && (
            <>
              <div className="flex gap-1 mt-2">
                {[0,1,2,3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all ${i < strength ? STRENGTH_COLORS[strength - 1] : "bg-white/10"}`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sécurité : {STRENGTH_LABELS[strength]}</p>
            </>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs text-slate-400 mb-1.5">Confirmer le mot de passe</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex">
              <IconLock />
            </span>
            <input
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="login-input w-full bg-white/5 border border-white/10 rounded-lg text-slate-100 text-sm pl-9 pr-3 py-2.5 outline-none transition-all focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 mb-5">
          <input
            type="checkbox"
            id="accept"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-indigo-600 cursor-pointer flex-shrink-0"
          />
          <label htmlFor="accept" className="text-xs text-slate-400 leading-relaxed">
            J'accepte les{" "}
            <a href="#" className="text-indigo-300 hover:text-indigo-200">conditions d'utilisation</a>
            {" "}et la{" "}
            <a href="#" className="text-indigo-300 hover:text-indigo-200">politique de confidentialité</a>.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-default text-white text-sm font-medium rounded-lg transition-colors mb-4 shadow-lg shadow-indigo-500/30"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Vous avez déjà un compte ?{" "}
          <span className="text-indigo-300 hover:text-indigo-200 cursor-pointer" onClick={onGoLogin}>
            Se connecter
          </span>
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
      heading: (
        <>
          Pilotez vos conférences{" "}
          <span className="text-gradient-accent">en direct.</span>
        </>
      ),
      sub: "Gérez les sessions en streaming, modérez les intervenants et accédez aux statistiques en temps réel depuis un seul tableau de bord.",
      security: "Connexion chiffrée · Accès réservé au personnel autorisé",
    },
    signup: {
      badge: "Nouveau compte administrateur",
      heading: (
        <>
          Rejoignez l'équipe{" "}
          <span className="text-gradient-accent">de pilotage.</span>
        </>
      ),
      sub: "Créez votre compte administrateur pour orchestrer les sessions live, modérer les intervenants et accéder aux analytics en temps réel.",
      security: "Inscription sur invitation · Code requis",
    },
  };
  const b = branding[view];

  return (
    <main
      className="relative min-h-screen text-slate-200 overflow-hidden flex items-center justify-center"
      style={{ background: "#05050d" }}
    >
      {/* Glows */}
      <div
        className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "rgba(79,70,229,0.30)", filter: "blur(80px)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "rgba(30,30,90,0.60)", filter: "blur(80px)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-center">

        {/* Left – branding */}
        <section className="hidden md:flex flex-col justify-between min-h-[340px]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.20)", boxShadow: "0 0 0 1px rgba(99,102,241,0.40)" }}
            >
              <IconRadio />
            </div>
            <span className="text-base font-semibold tracking-tight text-slate-100">EventMilay</span>
          </div>

          {/* Headline */}
          <div>
            <div
              className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs text-indigo-200 mb-4"
              style={{ borderColor: "rgba(99,102,241,0.30)", background: "rgba(99,102,241,0.10)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
              {b.badge}
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white mb-3">
              {b.heading}
            </h1>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{b.sub}</p>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <IconShield />
            {b.security}
          </div>
        </section>

        {/* Right – form */}
        <section className="flex items-center">
          {isSignup
            ? <SignupForm onGoLogin={() => setView("login")} />
            : <LoginForm onGoSignup={() => setView("signup")} />
          }
        </section>
      </div>
    </main>
  );
};