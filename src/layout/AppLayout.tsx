import { Layout, LayoutProps, UserMenu } from "react-admin";

/* ─── Custom App Bar ─── */
const CustomAppBar = () => (
  <header
    className="flex items-center px-4 h-14 shadow-none border-b border-white/10"
    style={{ background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
  >
    {/* Logo & title */}
    <div className="flex items-center gap-2 flex-1">
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
      <span className="text-white font-bold text-lg tracking-tight">EventMilay</span>
      <span
        className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
        style={{ background: "rgba(124,92,252,0.3)", color: "#a688ff" }}
      >
        Admin
      </span>
    </div>

    {/* User menu from react-admin */}
    <UserMenu />
  </header>
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
    /* Hide react-admin's default AppBar so our custom one shows */
    .RaAppBar-root {
      display: none !important;
    }
  `}</style>
);

export const AppLayout = (props: LayoutProps) => (
  <>
    <SidebarStyles />
    <div className="flex flex-col min-h-screen">
      <CustomAppBar />
      <Layout {...props} appBar={() => null} />
    </div>
  </>
);