import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource } from "react-admin";
import {
  Event as EventIcon,
  VideoLabel as VideoLabelIcon,
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";

import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { AppLayout }    from "./layout/AppLayout";
import { Dashboard as AdminDashboard } from "./pages/Dashboard";
import { LoginPage }    from "./pages/LoginPage";

import { EventList,   EventEdit,   EventCreate,   EventShow } from "./resources/events";
import { SessionList, SessionEdit, SessionCreate }             from "./resources/sessions";
import { SpeakerList, SpeakerEdit, SpeakerCreate }            from "./resources/speakers";
import { RoomList,    RoomEdit,    RoomCreate }                from "./resources/rooms";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={AppLayout}
      dashboard={AdminDashboard}
      loginPage={LoginPage}
      title="EventMilay Admin"
      requireAuth
    >
      <Resource
        name="events"
        list={EventList}
        edit={EventEdit}
        create={EventCreate}
        show={EventShow}
        icon={EventIcon}
        options={{ label: "Événements" }}
      />
      <Resource
        name="sessions"
        list={SessionList}
        edit={SessionEdit}
        create={SessionCreate}
        icon={VideoLabelIcon}
        options={{ label: "Sessions" }}
      />
      <Resource
        name="speakers"
        list={SpeakerList}
        edit={SpeakerEdit}
        create={SpeakerCreate}
        icon={PeopleIcon}
        options={{ label: "Intervenants" }}
      />
      <Resource
        name="rooms"
        list={RoomList}
        edit={RoomEdit}
        create={RoomCreate}
        icon={MeetingRoomIcon}
        options={{ label: "Salles" }}
      />
    </Admin>
  </React.StrictMode>
);
