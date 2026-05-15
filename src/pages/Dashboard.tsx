import { useEffect, useState } from "react";
import { Title, useDataProvider } from "react-admin";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import RadioIcon from "@mui/icons-material/Radio";

interface Stats { events: number; sessions: number; speakers: number; rooms: number; }
interface LiveSession { id: string; title: string; track?: string; room?: { name: string }; }

const StatCard = ({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: number; color: string;
}) => (
  <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography
          color="text.secondary"
          variant="body2"
          fontWeight={600}
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Typography>
        <Box sx={{ color, background: `${color}20`, borderRadius: 1.5, p: 0.75, display: "flex" }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h3" fontWeight={700} sx={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export function Dashboard() {
  const dp = useDataProvider();
  const [stats, setStats] = useState<Stats | null>(null);
  const [live, setLive] = useState<LiveSession[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);

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
      setUpcomingSessions(sessions.filter((s) => new Date(s.startTime) > now).slice(0, 5));
    }).catch(console.error);
  }, [dp]);

  return (
    <Box p={3}>
      <Title title="Tableau de bord" />
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        Tableau de bord
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Vue d&apos;ensemble de la plateforme EventMilay
      </Typography>

      {!stats ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { icon: <EventIcon fontSize="small" />,       label: "Événements",   value: stats.events,   color: "#7c5cfc" },
              { icon: <VideoLabelIcon fontSize="small" />,  label: "Sessions",     value: stats.sessions, color: "#f059c8" },
              { icon: <PeopleIcon fontSize="small" />,      label: "Intervenants", value: stats.speakers, color: "#00b4d8" },
              { icon: <MeetingRoomIcon fontSize="small" />, label: "Salles",       value: stats.rooms,    color: "#06d6a0" },
            ].map((s) => (
              <Grid item xs={6} md={3} key={s.label}>
                <StatCard {...s} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <RadioIcon sx={{ color: "#ff4444" }} />
                    <Typography fontWeight={700}>Sessions en direct</Typography>
                    {live.length > 0 && (
                      <Chip
                        label={live.length}
                        size="small"
                        sx={{ background: "#ff4444", color: "#fff", fontWeight: 700 }}
                      />
                    )}
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                  {live.length === 0 ? (
                    <Typography color="text.secondary" variant="body2" py={2} textAlign="center">
                      Aucune session en direct
                    </Typography>
                  ) : (
                    <List dense disablePadding>
                      {live.map((s) => (
                        <ListItem key={s.id} disableGutters>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, background: "#ff444420", color: "#ff4444" }}>
                              <RadioIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={s.title}
                            secondary={[s.track, s.room?.name].filter(Boolean).join(" · ")}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <EventIcon sx={{ color: "#7c5cfc" }} />
                    <Typography fontWeight={700}>Prochaines sessions</Typography>
                  </Box>
                  <Divider sx={{ mb: 1 }} />
                  {upcomingSessions.length === 0 ? (
                    <Typography color="text.secondary" variant="body2" py={2} textAlign="center">
                      Aucune session à venir
                    </Typography>
                  ) : (
                    <List dense disablePadding>
                      {upcomingSessions.map((s: any) => (
                        <ListItem key={s.id} disableGutters>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 32, height: 32, background: "#7c5cfc20", color: "#7c5cfc" }}>
                              <VideoLabelIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={s.title}
                            secondary={new Date(s.startTime).toLocaleString("fr-FR", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                            })}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}