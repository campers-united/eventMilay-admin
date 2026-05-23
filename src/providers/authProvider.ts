import { AuthProvider } from "react-admin";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Identifiants incorrects");
    }
    const payload = await res.json();
    // Server currently responds with { message, admin }
    const admin = payload.admin ?? payload;
    if (payload.token) {
      localStorage.setItem("admin_token", payload.token);
    }
    localStorage.setItem("admin_user", JSON.stringify(admin));
  },

  logout: async () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },

  checkAuth: async () => {
    // The backend currently does not expose /api/auth/me;
    // consider adding a token-check endpoint. For now, treat
    // presence of stored `admin_user` as proof of auth.
    const raw = localStorage.getItem("admin_user");
    if (!raw) throw new Error("Non authentifié");
  },

  checkError: async ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("admin_token");
      throw new Error("Non autorisé");
    }
  },

  getIdentity: async () => {
    const raw = localStorage.getItem("admin_user");
    if (!raw) throw new Error();
    const admin = JSON.parse(raw);
    return { id: admin.id, fullName: admin.name || admin.email };
  },

  getPermissions: async () => "admin",
};