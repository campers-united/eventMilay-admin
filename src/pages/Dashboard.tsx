import { useEffect, useState } from "react";
import { Title, useDataProvider } from "react-admin";

interface Stats { events: number; sessions: number; speakers: number;}


const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconVideo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconPeople = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconRadio = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/>
    <circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
  </svg>
);

/* ─── Stat Card ─── */
const STAT_CONFIGS = [
  { key: "events",   label: "Événements",   icon: <IconCalendar />, color: "#7c5cfc", bg: "rgba(124,92,252,0.12)", border: "rgba(124,92,252,0.25)" },
  { key: "sessions", label: "Sessions",     icon: <IconVideo />,    color: "#f059c8", bg: "rgba(240,89,200,0.12)", border: "rgba(240,89,200,0.25)" },
  { key: "speakers", label: "Intervenants", icon: <IconPeople />,   color: "#0ea5e9", bg: "rgba(14,165,233,0.12)",  border: "rgba(14,165,233,0.25)"  },
] as const;

function StatCard({ label, value, icon, color, bg, border }: {
  label: string; value: number; icon: React.ReactNode;
  color: string; bg: string; border: string;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid #e5e7eb",
      padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#9ca3af" }}>
          {label}
        </span>
        <span style={{ background: bg, color, border: `1px solid ${border}`, borderRadius: 8, padding: "6px 7px", display: "flex" }}>
          {icon}
        </span>
      </div>
      <span style={{ fontSize: 40, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

/* ─── Section card ─── */
function SectionCard({ title, icon, badge, children }: {
  title: string; icon: React.ReactNode; badge?: number; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid #e5e7eb", padding: 24,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{title}</span>
        {badge !== undefined && badge > 0 && (
          <span style={{
            marginLeft: "auto", background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 8px",
          }}>{badge}</span>
        )}
      </div>
      <div style={{ height: 1, background: "#f3f4f6", marginBottom: 16 }} />
      {children}
    </div>
  );
}

/* ─── Empty state ─── */
function Empty({ text }: { text: string }) {
  return <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "16px 0", margin: 0 }}>{text}</p>;
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
export function Dashboard() {
  const dp = useDataProvider();
  const [stats, setStats]     = useState<Stats | null>(null);
  const [live, setLive]       = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      dp.getList("events",   { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" }, filter: {} }),
      dp.getList("sessions", { pagination: { page: 1, perPage: 1000 }, sort: { field: "startTime", order: "ASC" }, filter: {} }),
      dp.getList("speakers", { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" }, filter: {} }),
    ]).then(([ev, se, sp]) => {
      setStats({ events: ev.total ?? 0, sessions: se.total ?? 0, speakers: sp.total ?? 0 });
      const now = new Date();
      const sessions = se.data as any[];
      setLive(sessions.filter(s => new Date(s.startTime) <= now && new Date(s.endTime) >= now));
      setUpcoming(sessions.filter(s => new Date(s.startTime) > now).slice(0, 5));
    }).catch(console.error);
  }, [dp]);

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "100vh" }}>
      <Title title="Tableau de bord" />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
          Tableau de bord
        </h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          Vue d'ensemble de la plateforme EventMilay
        </p>
      </div>

      {!stats ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 80 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "4px solid #7c5cfc", borderTopColor: "transparent",
            animation: "db-spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes db-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16, marginBottom: 24,
          }}>
            {STAT_CONFIGS.map(({ key, label, icon, color, bg, border }) => (
              <StatCard key={key} label={label} value={stats[key]} icon={icon} color={color} bg={bg} border={border} />
            ))}
          </div>

          {/* Live + Upcoming */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Sessions en direct */}
            <SectionCard
              title="Sessions en direct"
              badge={live.length}
              icon={<span style={{ color: "#ef4444", display: "flex" }}><IconRadio /></span>}
            >
              {live.length === 0
                ? <Empty text="Aucune session en direct" />
                : (
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {live.map(s => (
                      <li key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#ef4444", flexShrink: 0,
                        }}><IconRadio /></span>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.title}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                            {[s.track].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              }
            </SectionCard>

            {/* Prochaines sessions */}
            <SectionCard
              title="Prochaines sessions"
              icon={<span style={{ color: "#7c5cfc", display: "flex" }}><IconCalendar /></span>}
            >
              {upcoming.length === 0
                ? <Empty text="Aucune session à venir" />
                : (
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {upcoming.map(s => (
                      <li key={s.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "rgba(124,92,252,0.10)", border: "1px solid rgba(124,92,252,0.20)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#7c5cfc", flexShrink: 0,
                        }}><IconVideo /></span>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#111827" }}>{s.title}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>
                            {new Date(s.startTime).toLocaleString("fr-FR", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              }
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}