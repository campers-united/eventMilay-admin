import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import BoltIcon from "@mui/icons-material/OfflineBolt";

// ─── Google SVG ──────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.02h3.87c2.27-2.09 3.55-5.17 3.55-8.89z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.94-2.91l-3.87-3.02c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.12A11.99 11.99 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.27a7.21 7.21 0 0 1 0-4.54V6.61H1.27a12 12 0 0 0 0 10.78l4-3.12z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.12C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

// ─── Shared field styles ──────────────────────────────────────────────────────
const fieldSx = {
  mb: 1.5,
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    fontSize: 14,
    "& fieldset": { borderColor: "rgba(0,0,0,0.18)" },
    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.35)" },
  },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

// ─── Credentials form (sign-in OR sign-up) ────────────────────────────────────
function CredsForm({ mode }: { mode: "signin" | "signup" }) {
  const login = useLogin();
  const notify = useNotify();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 8) {
      notify(password.length < 8 ? "8 caractères minimum" : "Email requis", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      // react-admin's login() calls authProvider.login({ username, password })
      await login({ username: email, password });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("identifiants")) {
        notify("Email ou mot de passe incorrect", { type: "error" });
      } else {
        notify(msg, { type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="vous@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        size="small"
        sx={fieldSx}
      />
      <TextField
        label="Mot de passe"
        type="password"
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        size="small"
        inputProps={{ minLength: 8 }}
        sx={fieldSx}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
        sx={{
          mt: 0.5,
          py: 1,
          borderRadius: 1.5,
          fontWeight: 600,
          fontSize: 14,
          background: "#111",
          "&:hover": { background: "#333" },
          textTransform: "none",
        }}
      >
        {loading && <CircularProgress size={16} sx={{ mr: 1, color: "inherit" }} />}
        {mode === "signup" ? "Créer mon compte" : "Se connecter"}
      </Button>
    </Box>
  );
}

// ─── Google button (UI only — wire up OAuth as needed) ───────────────────────
function GoogleButton() {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      // TODO: integrate your OAuth flow here
      notify("Connexion Google non configurée", { type: "warning" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={handleClick}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <GoogleIcon />}
      sx={{
        borderRadius: 1.5,
        fontSize: 14,
        fontWeight: 500,
        textTransform: "none",
        borderColor: "rgba(0,0,0,0.18)",
        color: "text.primary",
        "&:hover": { borderColor: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.03)" },
      }}
    >
      Continuer avec Google
    </Button>
  );
}

// ─── Main login page ──────────────────────────────────────────────────────────
export const LoginPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #0f3460 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          p: 4,
          background: "#fff",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.75} mb={1.5}>
            <BoltIcon sx={{ color: "#a688ff", fontSize: 22 }} />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.04em",
                background: "linear-gradient(135deg, #a688ff, #f059c8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EventMilay
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={600} sx={{ fontSize: 22, color: "#111", letterSpacing: "-0.3px" }}>
            Bon retour
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, fontSize: 14 }}>
            Connectez-vous ou créez votre compte.
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 36,
            background: "#f5f5f5",
            borderRadius: 1.5,
            p: "3px",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 32,
              fontSize: 13,
              fontWeight: 400,
              textTransform: "none",
              borderRadius: 1.2,
              color: "text.secondary",
              "&.Mui-selected": {
                background: "#fff",
                color: "#111",
                fontWeight: 600,
                boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12)",
              },
            },
          }}
        >
          <Tab label="Connexion" />
          <Tab label="Inscription" />
        </Tabs>

        {/* Form */}
        {tab === 0 && <CredsForm mode="signin" />}
        {tab === 1 && <CredsForm mode="signup" />}

        {/* Divider */}
        <Box display="flex" alignItems="center" gap={1.5} my={2.5}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 11 }}>
            ou
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Google */}
        <GoogleButton />

        {/* Footer */}
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 3.5, color: "text.disabled", fontSize: 11 }}>
          En continuant, vous acceptez nos conditions d&apos;utilisation.
        </Typography>
      </Paper>
    </Box>
  );
};