import { Login, LoginForm } from "react-admin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BoltIcon from "@mui/icons-material/OfflineBolt";

const LoginHeader = () => (
  <Box textAlign="center" py={3}>
    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
      <BoltIcon sx={{ color: "#a688ff", fontSize: 32 }} />
      <Typography
        variant="h5"
        fontWeight={800}
        sx={{
          background: "linear-gradient(135deg, #a688ff, #f059c8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        EventMilay
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      Administration — Accès restreint
    </Typography>
  </Box>
);

export const LoginPage = () => (
  <Login
    sx={{
      background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #0f3460 100%)",
      "& .RaLogin-card": {
        borderRadius: 3,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      },
      "& .MuiTextField-root": { mb: 1 },
      "& .RaLoginForm-button": {
        background: "linear-gradient(135deg, #7c5cfc, #f059c8)",
        fontWeight: 700,
        borderRadius: 2,
        py: 1.25,
      },
    }}
  >
    <LoginHeader />
    <LoginForm />
  </Login>
);