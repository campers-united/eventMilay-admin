import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Create,
} from "react-admin";

import { RoomForm } from "./roomsCreate";

export const RoomList = () => (
  <List sort={{ field: "name", order: "ASC" }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <TextField source="name" label="Nom" />
      <TextField source="floor" label="Étage" emptyText="—" />
      <TextField source="capacity" label="Capacité" emptyText="—" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const RoomCreate = () => (
  <Create title="Nouvelle salle">
    <RoomForm />
  </Create>
);
