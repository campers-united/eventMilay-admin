import React from "react";
import ReactDOM from "react-dom/client";
import { Admin, Resource } from "react-admin";

import "./index.css";

import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { AppLayout } from "./layout/AppLayout";
import { Dashboard as AdminDashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";

import { EventList, EventEdit, EventCreate, EventShow } from "./resources/events/events";
import { SessionList, SessionEdit, SessionCreate } from "./resources/sessions";
import { SpeakerList, SpeakerEdit, SpeakerCreate, SpeakerShow } from "./resources/speakers";
import { RoomList, RoomEdit, RoomCreate } from "./resources/rooms/indexx";

const IconEvent = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconSession = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconPeople = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconRoom = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconUserAdmin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

function App() {
  return (
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
        icon={IconEvent}
        options={{ label: "Événements" }}
      />
      <Resource
        name="sessions"
        list={SessionList}
        edit={SessionEdit}
        create={SessionCreate}
        icon={IconSession}
        options={{ label: "Sessions" }}
      />
      <Resource
        name="speakers"
        list={SpeakerList}
        edit={SpeakerEdit}
        create={SpeakerCreate}
        show={SpeakerShow}
        icon={IconPeople}
        options={{ label: "Intervenants" }}
      />
      <Resource
        name="rooms"
        list={RoomList}
        edit={RoomEdit}
        create={RoomCreate}
        icon={IconRoom}
        options={{ label: "Salles" }}
      />
    </Admin>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
