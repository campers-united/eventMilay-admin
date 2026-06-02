import { AppBar, AppBarProps, Layout, LayoutProps, UserMenu } from "react-admin";

const CustomAppBar = (props: AppBarProps) => (
  <AppBar
    {...props}
    userMenu={<UserMenu />}
    sx={{
      background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      boxShadow: "none",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      "& .RaAppBar-toolbar": {
        minHeight: 56,
      },
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a688ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/>
        <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
      </svg>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
        EventMilay
      </span>
      <span
        style={{
          marginLeft: 4,
          padding: "2px 8px",
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 600,
          background: "rgba(124,92,252,0.3)",
          color: "#a688ff",
        }}
      >
        Admin
      </span>
    </div>
  </AppBar>
);

/* ─── Sidebar style injected via a style tag ─── */
const SidebarStyles = () => (
  <style>{`
    .RaLayout-appFrame .MuiDrawer-paper {
      background: #1a1a2e !important;
    }
    .RaLayout-appFrame .MuiDrawer-paper .MuiListItemIcon-root {
      color: #a688ff !important;
    }
    .RaLayout-appFrame .MuiDrawer-paper .MuiListItemText-primary {
      color: #e0e0e0 !important;
      font-size: 0.875rem;
    }
    .RaLayout-appFrame .MuiDrawer-paper .RaMenuItemLink-active {
      background: rgba(124,92,252,0.2) !important;
      border-radius: 8px;
    }
    .RaLayout-appFrame .MuiDrawer-paper .RaMenuItemLink-active .MuiListItemText-primary {
      color: #fff !important;
    }
    .RaLayout-appFrame .MuiDrawer-paper .RaMenuItemLink-active .MuiListItemIcon-root {
      color: #f059c8 !important;
    }
    .RaLayout-content {
      background: #f5f5f5 !important;
    }
  `}</style>
);

export const AppLayout = (props: LayoutProps) => (
  <>
    <SidebarStyles />
    <Layout {...props} appBar={CustomAppBar} />
  </>
);