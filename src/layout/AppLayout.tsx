import { Layout, LayoutProps, UserMenu } from "react-admin";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import BoltIcon from "@mui/icons-material/OfflineBolt";

const StyledAppBar = styled(MuiAppBar)({
  background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  boxShadow: "none",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
});

const CustomAppBar = () => (
  <StyledAppBar position="static">
    <Toolbar sx={{ minHeight: "56px !important" }}>
      <Box display="flex" alignItems="center" gap={1} flex={1}>
        <BoltIcon sx={{ color: "#a688ff", fontSize: 24 }} />
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.5px" }}
        >
          EventMilay
        </Typography>
        <Chip
          label="Admin"
          size="small"
          sx={{
            ml: 1,
            background: "rgba(124,92,252,0.3)",
            color: "#a688ff",
            fontSize: 10,
          }}
        />
      </Box>
      <UserMenu />
    </Toolbar>
  </StyledAppBar>
);

export const AppLayout = (props: LayoutProps) => (
  <Layout
    {...props}
    appBar={CustomAppBar}
    sx={{
      "& .RaLayout-content": { background: "#f5f5f5" },
      "& .MuiDrawer-paper": {
        background: "#1a1a2e",
        "& .MuiListItemIcon-root": { color: "#a688ff" },
        "& .MuiListItemText-primary": { color: "#e0e0e0" },
        "& .RaMenuItemLink-active": {
          background: "rgba(124,92,252,0.2)",
          "& .MuiListItemText-primary": { color: "#fff" },
          "& .MuiListItemIcon-root": { color: "#f059c8" },
        },
      },
    }}
  />
);