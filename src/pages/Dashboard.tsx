import { useEffect, useState } from "react";
import { Title, useDataProvider } from "react-admin";

interface Stats { events: number; sessions: number; speakers: number; rooms: number; }
interface LiveSession { id: string; title: string; track?: string; room?: { name: string }; startTime?: string; }

/* ─── SVG Icons ─── */
const IconCalendar = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconVideo = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconPeople = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconRoom = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconRadio = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.4"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
  </svg>
);

/* ─── Stat Card ─── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
}
const StatCard = ({ icon, label, value, colorClass, bgClass }: StatCardProps) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className={`${bgClass} ${colorClass} p-2 rounded-lg flex`}>{icon}</span>
    </div>
    <span className={`text-4xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

/* ─── Dashboard ─── */
export function Dashboard() {
  const dp = useDataProvider();
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState<LiveSession[]>([]);
  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);

  useEffect(() => {
    Promise.all([
      dp.getList("events",   { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" }, filter: {} }),
      dp.getList("sessions", { pagination: { page: 1, perPage: 1000 }, sort: { field: "startTime", order: "ASC" }, filter: {} }),
      dp.getList("speakers", { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" }, filter: {} }),
      dp.getList("rooms",    { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" }, filter: {} }),
    ]).then(([ev, se, sp, ro]) => {
      setStats({
        events: ev.total ?? 0,
        sessions: se.total ?? 0,
        speakers: sp.total ?? 0,
        rooms: ro.total ?? 0,
      });
      const now = new Date();
      const sessions = se.data as any[];
      setLive(sessions.filter((s) => new Date(s.startTime) <= now && new Date(s.endTime) >= now));
      setUpcoming(sessions.filter((s) => new Date(s.startTime) > now).slice(0, 5));
    }).catch(console.error);
  }, [dp]);

  const statCards = [
    { icon: <IconCalendar />, label: "Événements",   key: "events"   as const, colorClass: "text-violet-600", bgClass: "bg-violet-100" },
    { icon: <IconVideo />,    label: "Sessions",     key: "sessions" as const, colorClass: "text-pink-500",   bgClass: "bg-pink-100"   },
    { icon: <IconPeople />,   label: "Intervenants", key: "speakers" as const, colorClass: "text-sky-500",    bgClass: "bg-sky-100"    },
    { icon: <IconRoom />,     label: "Salles",       key: "rooms"    as const, colorClass: "text-emerald-500",bgClass: "bg-emerald-100"},
  ];

  return (
    <div className="p-6">
      <Title title="Tableau de bord" />
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-6">Vue d'ensemble de la plateforme EventMilay</p>

      {!stats ? (
        <div className="flex justify-center mt-16">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statCards.map(({ icon, label, key, colorClass, bgClass }) => (
              <StatCard
                key={key}
                icon={icon}
                label={label}
                value={stats[key]}
                colorClass={colorClass}
                bgClass={bgClass}
              />
            ))}
          </div>

          {/* Live + Upcoming */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sessions en direct */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconRadio className="text-red-500" />
                <h2 className="font-bold text-gray-800">Sessions en direct</h2>
                {live.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {live.length}
                  </span>
                )}
              </div>
              <div className="border-b border-gray-100 mb-3" />
              {live.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune session en direct</p>
              ) : (
                <ul className="space-y-3">
                  {live.map((s) => (
                    <li key={s.id} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <IconRadio className="text-red-500" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.title}</p>
                        <p className="text-xs text-gray-400">{[s.track, s.room?.name].filter(Boolean).join(" · ")}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Prochaines sessions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <IconCalendar className="text-violet-500" />
                <h2 className="font-bold text-gray-800">Prochaines sessions</h2>
              </div>
              <div className="border-b border-gray-100 mb-3" />
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Aucune session à venir</p>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((s: any) => (
                    <li key={s.id} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <IconVideo className="text-violet-600" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(s.startTime).toLocaleString("fr-FR", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}